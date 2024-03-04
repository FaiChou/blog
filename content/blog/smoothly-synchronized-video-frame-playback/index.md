---
title: "How video frames play in smooth synchronization with the audio track"
date: "2024-03-04"
category: "dev"
emoji: "🎥"
---

在做播放器的过程中，音视频的同步是一个挑战，也就是视频帧的渲染跟上音频播放的步伐。尽管视频帧都有固定的PTS，按照这个 PTS 来一直播放就可以了吗？

非也，系统或者视频文件都有可能出点小问题，问题多了，就会造成跟不上音轨导致音画不同步的问题。

下面请欣赏来自[An ffmpeg and SDL Tutorial](http://www.dranger.com/ffmpeg/tutorial05.html)的代码，只取了核心的部分来讲解:

```c
void video_refresh_timer(void *userdata) {

  videostate *is = (videostate *)userdata;
  videopicture *vp;
  double actual_delay, delay, sync_threshold, ref_clock, diff;

  if(is->video_st) {
    if(is->pictq_size == 0) {
      schedule_refresh(is, 1);
    } else {
      vp = &is->pictq[is->pictq_rindex];

      is->video_current_pts = vp->pts;
      is->video_current_pts_time = av_gettime();
      delay = vp->pts - is->frame_last_pts; /* the pts from last time */
      if(delay <= 0 || delay >= 1.0) {
        /* if incorrect delay, use previous one */
        delay = is->frame_last_delay;
      }
      /* save for next time */
      is->frame_last_delay = delay;
      is->frame_last_pts = vp->pts;



      /* update delay to sync to audio if not master source */
      if(is->av_sync_type != av_sync_video_master) {
        ref_clock = get_master_clock(is);
        diff = vp->pts - ref_clock;

        /* skip or repeat the frame. take delay into account
     ffplay still doesn't "know if this is the best guess." */
        sync_threshold = (delay > av_sync_threshold) ? delay : av_sync_threshold;
        if(fabs(diff) < av_nosync_threshold) {
          if(diff <= -sync_threshold) {
            delay = 0;
          } else if(diff >= sync_threshold) {
            delay = 2 * delay;
          }
        }
      }
      is->frame_timer += delay;
      /* computer the real delay */
      actual_delay = is->frame_timer - (av_gettime() / 1000000.0);
      if(actual_delay < 0.010) {
        /* really it should skip the picture instead */
        actual_delay = 0.010;
      }
      schedule_refresh(is, (int)(actual_delay * 1000 + 0.5));

      /* show the picture! */
      video_display(is);

      /* update queue for next picture! */
      if(++is->pictq_rindex == video_picture_queue_size) {
        is->pictq_rindex = 0;
      }
      sdl_lockmutex(is->pictq_mutex);
      is->pictq_size--;
      sdl_condsignal(is->pictq_cond);
      sdl_unlockmutex(is->pictq_mutex);
    }
  } else {
    schedule_refresh(is, 100);
  }
}
```

首先基本的思路是通过调整视频帧的显示时间来匹配音频时间戳:


```
┌───────────────────────┐          ┌────────────────────┐             ┌───────────────────┐
│                       │          │                    │             │                   │
│                       │          │                    │             │                   │
│   get audio pts       ├─────────►│  calculate delay   ├────────────►│ adjust play speed │
│                       │          │                    │             │                   │
│                       │          │                    │             │                   │
└───────────────────────┘          └────────────────────┘             └───────────────────┘
```

`video_refresh_timer` 是一个定时调用的函数, 以便按照视频的原始播放速率刷新视频帧，同时尝试与音频时钟同步。下面是代码的主要逻辑步骤和同步机制:

1. 检查视频流: 首先判断是否有视频流（is->video_st）。如果没有视频流，就设定一个较长的刷新间隔（100毫秒）等待视频流。
2. 检查视频队列: 如果视频帧队列（is->pictq_size）为空，意味着没有可显示的帧，因此设定一个短暂的延迟（1毫秒）后再次尝试。如果队列中有帧，则继续处理。
3. 计算帧显示延迟: 从视频帧队列中取出当前帧（vp），并计算与上一帧的时间差（delay）。这个延迟代表了当前帧应该在屏幕上保持的时间。如果计算出的延迟不合理（非正或过长），则使用上一次的延迟值。
4. 音视频同步调整:
  - 获取音频时钟: 使用get_audio_clock(is)获取当前的音频时钟（音频播放的参考时间）。
  - 计算音视频差异: 计算当前视频帧的PTS和音频时钟的差异（diff）。
  - 同步阈值: 设置一个同步阈值（sync_threshold），用于决定何时调整视频播放速度。如果差异小于无同步阈值（AV_NOSYNC_THRESHOLD），则考虑调整延迟；否则，保持当前的播放速度。
  - 调整延迟: 如果视频落后于音频（diff为负且小于同步阈值），则减少延迟（尽可能快地显示下一帧）。如果视频超前于音频（diff为正且大于同步阈值），则增加延迟（慢慢播放）。
5. 计算实际延迟: 更新帧定时器is->frame_timer，并计算出下一帧应该在什么时候显示。这是通过当前帧定时器值减去当前时间来确定的。如果计算出的实际延迟小于10毫秒，则设置延迟为10毫秒，以避免过快地渲染帧。
6. 设定刷新时间: 根据计算出的实际延迟调用schedule_refresh，安排下一次刷新。这保证了视频帧的显示与计算出的音视频同步时间相匹配。
7. 显示视频帧: 调用video_display(is)显示当前视频帧。
8. 更新视频队列: 更新队列读取索引is->pictq_rindex和队列大小is->pictq_size，并在必要时唤醒等待队列空间的线程。

第四步是重点和难点，整个过程也实现了平滑播放的逻辑，不会使视频帧播放的太快或者太慢让用户感觉不连贯或者不自然。它实现了一个缓冲机制，通过设置同步阈值（sync_threshold）和无同步阈值（AV_NOSYNC_THRESHOLD），来决定何时进行同步调整，以及如何平衡同步的精度与播放的平滑性。

下面我将再次详细讲解一下这一块逻辑:

假设我们有一个视频播放器正在播放一个视频文件，视频帧的显示时间（PTS）和音频播放时间是需要同步的。在某个特定的时刻，我们从视频帧队列中取出一个视频帧（vp），并计算出它应该显示的延迟时间（delay），这个延迟是基于该帧的PTS与上一帧PTS之间的差值计算出来的。同时，我们也获取当前音频的播放时间（ref_clock），作为音视频同步的参考。

现在，我们有：

- 视频帧PTS：vp->pts
- 音频时钟（音频参考时间）：ref_clock
- 计算得到的视频显示延迟：delay

接下来的关键步骤是计算视频PTS与音频时钟之间的差异（diff = vp->pts - ref_clock）。这个差异反映了当前视频帧与音频播放的时间偏差。

然后，我们设置一个同步阈值（sync_threshold）。这个阈值是为了决定视频帧是否需要跳过或者延迟显示，以达到与音频的同步。

这意味着，sync_threshold至少为AV_SYNC_THRESHOLD，除非计算出的delay更大。这样做是为了确保有一个最小的同步灵敏度，防止过于频繁地调整视频播放速度。

现在，我们用diff（视频和音频之间的时间差异）和sync_threshold来决定如何调整延迟：

- 如果diff小于-sync_threshold（即视频落后于音频太多），我们将延迟设置为0，意味着尽快显示下一帧，以减少视频落后的情况。
- 如果diff大于sync_threshold（即视频超前于音频太多），我们将延迟翻倍，意味着减慢视频的播放速度，让音频有时间追上。
- 如果diff的绝对值小于AV_NOSYNC_THRESHOLD，这意味着视频和音频已经足够同步，无需调整。

这种方法通过动态调整视频显示的延迟来尽量减少音视频之间的同步误差，提高观看体验。



---
title: "html里列表滑动删除的实现如此简单"
date: "2019-01-04"
category: "Dev"
emoji: "👨🏼‍💻"
---

## 预览

<!--<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/swiper-list.gif" width="400" />-->

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/1546589625180.png" width="375" />

---

<video src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/swiper-list.MP4" width="375" controls preload></video>

## 前言

[Demo gist地址](https://gist.github.com/FaiChou/857d15e94071f79c0f54991e479ee16d) 👈

做web开发经常会遇到列表操作, 如果不涉及移动端, 那么在列表上放几个按钮, 用户点击就完事了, 如果是移动端, 受限于屏幕宽度, 操作按钮太多会影响布局, 所以在移动端列表的滑动操作比较常见.

做原生开发, 系统可能给列表提供了基本的删除等功能, 那么网页应该如何实现呢?

本文以地址管理为demo, 用react实现, 其实不管是什么框架, 涉及到的大部分都是 web 的接口.

demo用到了[coroutine](https://juejin.im/post/5b0d55e551882539e7429632), 使用协程方便管理一系列事件 (event flow).

## 原理

2件事要处理: **滑动** 和 **布局**

#### 滑动

滑动事件需要被监听, 应该在列表的每一个item上设置监听, 每个item处理滑动事件.

如果是 mobile 监听这三个事件:

- touchstart 滑动开始, 记录初始位置
- touchmove 滑动过程中会有一系列的位置产生
- touchend 滑动结束, 记录结束位置

否则监听这几个:

- mousedown
- mousemove
- mouseup
- mouseleave (交给 mouseup 处理)


在生命周期开始时候监听这几个事件:

```javascript
startupTouchEvent() {
  const current = ReactDOM.findDOMNode(this);
  current.addEventListener('touchstart', this.moveLoop);
  current.addEventListener('touchend', this.moveLoop);
  current.addEventListener('touchmove', this.moveLoop);
}
```

其中 `this.moveLoop` 是:

```javascript
this.moveLoop = coroutine(function*() {
      let e = {};
      while (e = yield) {
        if (e.type === 'touchstart') {
          // trace position
          const startX = e.touches[0].clientX;
          while (e = yield) {
            if (e.type === 'touchmove') {
              // trace position
              // console.log('touchmove', e);
              const movedX = e.changedTouches[0].clientX;
              const deltaX = movedX - startX;
              // console.log('moved', deltaX);
              if (deltaX <= 0) {
                that.moveMask(deltaX);
              }
            }
            if (e.type === 'touchend') {
              const endX = e.changedTouches[0].clientX;
              const deltaX = endX - startX;
              // console.log('end', deltaX);
              if (deltaX >= -40) {
                that.closeMaskIfNeeded();
              } else {
                that.openMask();
              }
              break;
            }
          }
        }
      }
    })
```

这里用到了 **corutine**.

首先当手指放到 item 上时, 记录位置 `startX = e.touches[0].clientX;`.

当手指滑动时获取此时的位置 `e.changedTouches[0].clientX`, 减去初始位置 `deltaX = movedX - startX;`, 如果 `deltaX` 小于0, 那么此时是左滑, 进行 UI 上的操作, 将上层 `div` 左移 `deltaX`.

当手指离开屏幕时候, 记录此时位置并获取与初始位置的差值 `deltaX = endX - startX`, 判断 `deltaX`, 如果滑动距离太小(40px)或者向右滑, 那么就关掉展开的 `div`, 如果滑动距离够长, 那么就完全展开 `div`.


#### 布局

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/1546592992712.png" width="500" />


```html
      <div className="address-swipe-wrapper">
        <div className="swiper-operation-btns">
          <button style={{
            backgroundColor: '#7EA1D6'
          }} onClick={onEdit}>
            编辑
          </button>
          <button style={{
            backgroundColor: 'red'
          }} onClick={onDelete}>
            删除
          </button>
        </div>
        <div className="address-item" onClick={onClick} style={{
          left,
          position: 'relative',
          transition: 'all 250ms',
        }}>
          {selected &&
            <img className="address-item-selected-icon" src={require('../img/check.png')} alt="选中" />
          }
          <div className="address-content">
            <div>{`${name}  ${mobile}`}</div>
            <div>{provinceName+cityName+districtName+detailedAddress}</div>
          </div>
        </div>
      </div>
```

几个操作按钮是绝对布局被盖在 address-item 内容的下面, 当滑动或者展开时候 address-item 会左移 `left` 距离, 它是 relative 布局.

为了让滑动有动效, 可以添加 `transition: 'all 250ms'`.

#### 其他几个方法

```javascript
  openMask() {
    this.setState({
      left: -160
    });
  }
  moveMask(deltaX) {
    this.setState({
      left: deltaX
    });
  }
  closeMaskIfNeeded() {
    this.setState({
      left: 0
    });
  }
```

## 小结

#### 会不会手势滑动与点击冲突?

不会, 经过pc和手机(ios/android)尝试, 滑动时候不会触发 address-item 的选中, 并没发现会冲突, 除非你写 `evt.preventDefault()`.


#### 如何实现点击空白关掉?

给 `window` 添加监听事件:

```javascript
window.addEventListener('touchstart', this.closeMaskIfNeeded);
```

在 PC 上表现良好, 但是在 mobile 上表现异常. 所以移到 TODO 里待解决.

## TODO

1. 封装到HOC
2. 横向滑动时候禁止纵向滑动
3. 点击空白区域关掉展开的item
4. 展开时添加操作按钮的bounce动效 (TelegramX-iOS的右滑效果)

## 参考

- [TouchEvents](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [mobile touch event - SO](https://stackoverflow.com/questions/11397028/document-click-function-for-touch-device)
- [swipe in react - SO](https://stackoverflow.com/questions/40463173/swipe-effect-in-react-js)



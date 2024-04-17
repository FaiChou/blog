---
title: "音频的频谱分析"
date: "2024-05-16"
category: "dev"
emoji: "🎼"
---

好奇苹果音乐播放时在灵动岛上跳动的柱状图是怎么实现的，灵动岛上有两种，一种是录音的情况下会随着时间移动，这种记录的是声音的大小，也就是采集到音频的能量大小，比如下面这段代码:

```swift
private func timerDidUpdateMeter() {
  if self.isRunning {
    self.audioPlayer!.updateMeters()
    let averagePower = self.audioPlayer!.averagePower(forChannel: 0)
    let percentage: Float = pow(10, (0.05 * averagePower))
    NotificationCenter.default.post(name: .audioPlayerManagerMeteringLevelDidUpdateNotification, object: self, userInfo: [audioPercentageUserInfoKey: percentage])
  }
}
```

这个代码逻辑是用 AVAudioPlayer 来获取音频信号平均功率。

当然也可以根据一段音频数据自己分析，比如[这段代码](https://github.com/bastienFalcou/SoundWave/blob/master/SoundWave/Classes/AudioContext.swift#L56)，它的实现逻辑是这样的:

1. 使用 AVAssetReader 来读取音频数据
2. 需要将 buffer 中的数据提取 100 个采样，通过计算获取多少个字节分组处理
3. 使用 Accelerate 库(苹果专门计算的库)中的一些函数，将数据转换成供计算的数据
4. 将上面获取到的数据转换成 db，再降采样（卷积计算），最后得出想要的数值

上面讲到的是第一种情况，另一种是音乐播放或者打电话时候，后台灵动岛的跳跃波形，这种波形不是简单的音频功率的大小，而是执行了傅里叶变换后的频谱数据。

关于傅里叶变换的一些预备知识，先看这几个:

1. [李永乐老师讲的傅里叶变换](https://youtu.be/0LuyxzqI3Hk?si=-bV6ThLQFU7jZmNQ)
2. [离散傅里叶变换的衍生，负频率、fftshift、实信号、共轭对称](https://zhuanlan.zhihu.com/p/376254750?utm_id=0)
3. [如何正确理解信号处理中的负频率？](https://www.zhihu.com/question/24391035)

我们需要先理解一些关键字和苹果提供的一些 API，对于傅里叶变换，我们用到的是快速傅里叶变换(FFT)。要进行傅里叶变换，则需要用到复数，首先要把一堆实数的数据变成复数，虚部为0。

在苹果 API 中，有两种复数，`DSPSplitComplex` 和 `DSPComplex`，前者是分离的（split）实部和虚部，而后者则是交织的，比如这样的复数组合 `(1+2i),(3+4i),(5+6i)`，在 `DSPSplitComplex` 中是这样的内存表示 `[1,3,5,2,4,6]`, 在 `DSPComplex` 是这样的 `[1,2,3,4,5,6]`。前一种分离的对于计算机来讲是方便处理的，所以性能上也是比后者更佳。前者进行 FFT 需要用到的函数是 `vDSP_fft_zrip`, 而后者则是要用 `vDSP_fft_zip`。

对于执行 FFT 后的结果中，也是一系列复数，复数的实部(real)代表余弦cosine分量系数，虚部(imag)代表正弦sine成分的系数。而对于振幅的计算，是通过虚部和实部平方和的平方根，计算出的模(magnitude)代表了在该频率下的能量值，有时候没必要进行额外的开平方计算，直接使用平方和，比如 `vDSP_zvmags` 函数没有计算开平方，而 `vDSP_zvabs` 是开平方后的。平方幅度与振幅之间只差一个平方根运算，使用平方幅度即可满足需求，因为它避免了计算平方根的开销。

FFT 还有一个关键的 `log2n`(以2为底n的对数)，在 FFT 算法中，log2n 表示将问题规模 n 分解为子问题所需的二进制分解的次数。例如,对于 n = 1024 的信号,log2n = 10,意味着需要进行 10 次二进制分解才能将问题规模减小到最基本的子问题。log2n 也表示了 FFT 计算过程中的"阶段"数,每个阶段对应一次二进制分解和蝶形运算。FFT 算法的基本思想:

- FFT 算法是通过将 DFT (离散傅里叶变换) 分解为更小的 DFT 来实现快速计算的。
- 这种分解是基于时间 (时域) 或频率 (频域) 的分治策略。
- 通过递归地将 DFT 分解为规模更小的子问题,FFT 可以将计算复杂度从 O(n^2) 降低到 O(n log n)。

所以对于已知的一段音频数据，需要先计算其 log2n 的值。

假如一段声音有 1000 个采样点，进行 FFT 后，可以获取到 500 个复数，复数通过计算（实部虚部平方和的平方根）可得振幅（声音的大小），500 个值代表着不同的频率下的点。

这里就有两个问题:

问题一，为什么有 500 个复数结果？因为实数信号的傅里叶变换满足共轭对称性，即对于实数时间序列，其频域表示中，负频率部分的信息与正频率部分是重复的，所以只需要获取一半的整频率部分即可表示出所有频谱分量。这里有一个关键字 `nyquistFrequency` 奈奎斯特频率，它是最高的正频率，采样率的一半。

问题二，如何知道第 k 个点代表哪个频率？答案: `f(k) = k x (fs/N)`, fs 是采样率，总共有 N 个采样点。所以通过公式可以知道，对于同一首音乐，截取10秒钟和截取1分钟获取的音乐数据，虽然1分钟的时长长一些，采样点多一些，但最高的频率是和10秒的一样，因为采样率是相同的。但采样点多可以有更丰富的频谱数据。

对于音频的采样数据不能直接处理，因为数据可能不好看，会有泄漏效应和边缘效应。所以需要使用窗口函数用来对短时信号进行加权。常用的窗口函数有矩形窗，汉宁窗，汉明窗和布莱克曼窗。拿汉明窗(`vDSP_hann_window`)来举例，它在两端逐渐降到0，中间部分的权重较高，可以有效减少泄漏效应和边缘效应。在 swift 中可以这样操作:

```swift
vDSP_hann_window(&window, windowSize_vDSPLength, vDSP_HANN_NORM_Int32)
vDSP_vmul(bufferPtr, 1, window, 1, transferBuffer, 1, windowSize_vDSPLength)
```

其中 `vDSP_vmul` 函数做的工作是将两个向量（数组）的元素对元素的乘法操作，结果存储到 transferBuffer 中。

最后经过 FFT 计算得出的结果，经过取模后获取到的值也不能直接使用，需要将其转换成 db 并且乘一个数值来缩放一下:

```swift
vDSP_vdbcon(&magnitudes, 1, &zeroDBReference, normalizedMagnitudes, 1, halfBufferSize_UInt, 1)
vDSP_vsmul(normalizedMagnitudes, 1, vsMulScalar, normalizedMagnitudes, 1, halfBufferSize_UInt)
```

上面函数将 magnitudes 里的每个元素，按照步长为 1，使用 zeroDBReference 作为参考值，转换成分贝数，出的每个元素的结果存储到 normalizedMagnitudes 中（其中步长也是1）， halfBufferSize_UInt 是要处理的长度。`vDSP_vdbcon` 函数最后一个数值是 1 代表着 alpha 是 20，如果是 0，则 alpha 是 10，alpha 是内部计算分贝需要的值:

```
If Flag is 1:
    alpha = 20;
If Flag is 0:
    alpha = 10;
for (n = 0; n < N; ++n)
    C[n] = alpha * log10(A[n] / B[0]);
```

而 `vDSP_vsmul` 函数则是将 normalizedMagnitudes 里的每个元素，按照步长为 1，与 vsMulScalar 数值相乘，将结果再次保存到 normalizedMagnitudes（步长还是 1）。

至此，需要了解的知识已经写完，后面我会写一个 demo，播放并频谱展示一段音乐。



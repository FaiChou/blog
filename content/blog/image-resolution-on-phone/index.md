---
title: "Image resolution on phone"
date: "2018-09-05"
category: "dev"
emoji: "👾"
---

## 图像简介

以我的手机(iPhone8)为例.

#### 屏幕尺寸

4.7英寸

1英寸 = 2.54厘米

屏幕尺寸是对角线长度, 可以用勾股定理算出.


#### Point

375 * 667

平时开发都是以此为单位, 比如默认字体为14, 就是14pt.


#### Pixel

750 * 1334

1pt = 2px (iPhone8)

平时的图标有原图/@2x/@3x就是给不同分辨率iPhone做适配.

#### 总结与实践

手机截屏, 会得到一张分辨率为 750 * 1334 的图片, 放到百度存储:

[原图](https://userapp.bj.bcebos.com/bill/1535893448480.jpg)

[300px宽度](https://userapp.bj.bcebos.com/bill/1535893448480.jpg@w_300)

[500px宽度](https://userapp.bj.bcebos.com/bill/1535893448480.jpg@w_500)

[700px宽度](https://userapp.bj.bcebos.com/bill/1535893448480.jpg@w_700)

[900px宽度](https://userapp.bj.bcebos.com/bill/1535893448480.jpg@w_900)

[2000px宽度](https://userapp.bj.bcebos.com/bill/1535893448480.jpg@w_2000)


```javascript
<Image source={{ uri: url }}
  resizeMode="contain"
  style={{ width: 100, height: 178 }}
/>
```

以原图为标准, 300和500的会失真, 700的与原图近似, 900与2000的就有点浪费.

用我的iPhone8竖直拍摄一张照片, 大约是 3024 * 4032 像素, 大小在2.2MB左右,
所以如果只展示一个普通的图片缩略图, 没必要拉取原图.




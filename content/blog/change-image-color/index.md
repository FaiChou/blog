---
title: "图片换色"
date: "2021-08-21"
category: "dev"
emoji: "🏞"
---

有个改变图片颜色的需求. 首先从网上下载了 svg, 主体是黑色的. 所以改变图片颜色很简单:

```shell
$ convert 1.svg -fill red -opaque black 1.png
```

这脚本将 `1.svg` 黑色部分改为红色. 因为恰好这张图片是 svg, 里面的颜色都是黑色. 如果将 svg 保存为 png, 那这样黑色边缘部分并不是纯黑色, 那么这样转换就不行了, 所以需要用到 `-fuzz` 参数:

```shell
$ convert 1.png -fuzz 40% -fill red -opaque black 2.png
```

svg 保存的 png 图片背景是白色, 如何将其白色变成透明:

```shell
$ convert 1.png -transparent white 1t.png
```

## Ref

- [imagemagick](https://legacy.imagemagick.org/Usage/color_basics/#replace)

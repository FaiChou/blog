---
title: "快速生成markdown图片地址"
date: "2018-10-11"
category: "Dev"
emoji: "👨🏼‍💻"
---

## 需求

因为上次七牛回收域名事件, 决定换一个图床, 最好是收费的, 但是域名等问题让人头疼.

图床大多数是用在写博客获取图片外链, 所以既然博客都放在 GitHub 上了, 那么图片最好也是和博客同一个 repository , 引用图片也可以相对路径引用.

所以决定将图片放到 GitHub 上.

## 目标

因为之前上传图片到七牛使用了 `Alfred Workflow`, 复制一张图片或者截一张图片, 使用快捷键 `ctrl + cmd + v` 就会自动将图片上传到七牛, 最后将图片的外链拷贝到系统粘贴板.

所以最好还是保持相同的习惯: 复制图片/截图 -> 命令/快捷键 -> 上传到 GitHub -> 获取到图片外链.

## 尝试

想过用 shell 命令来完成此操作, 因为写起来 shell 比较简单. shell 对粘贴板的命令有 pbcopy 和 pbpaste, 但是这两个仅支持 string 类型的粘贴板. 经过一番搜索, 找到了一个大佬写的图片粘贴板的命令: [pngpaste](https://github.com/jcsalterego/pngpaste).

使用 pngpaste 是默认粘贴板里是图片类型, 如何用命令获取粘贴板类型呢? 经过一番搜索提问, 并没有发现任何 shell 支持这个功能. 所以只好放弃, 投奔 python.

其实更恰当的方法是使用 swift 来写, 因为系统粘贴板类型是系统的framework通过 OC/swift 的 API 获取的, 但是作为脚本开发, 还是 python 舒心, python 也可以通过 AppKit 来调用 OC 的 API.

## 达成

#### 第一步 运行环境

```
#!/usr/bin/env python3
```

#### 依赖库

```  python
import os
import tempfile
import imghdr
import shutil
import subprocess
import sys
import time

from AppKit import NSPasteboard, NSPasteboardTypePNG,\
        NSPasteboardTypeTIFF, NSPasteboardTypeString,\
        NSFilenamesPboardType

```

tempfile 用作创建临时文件, 将剪贴板的图片文件写入到临时文件, 最后返回临时图片文件.

imghdr 用做检查文件是否为图片, `imghdr.what(file)` 可以返回文件类型.

shutil 用作对文件的拷贝, `shutil.copy(p1, p2)`.

shubprocess 用作子进程图片处理.

AppKit 是调用 OC 类的核心, 主要用获取粘贴板内容以及类型, 粘贴板文件有多种类型, 暂时只处理三种:

1. 文件类型
2. 字符串类型
3. 图片类型

通过 `NSPasteboard.generalPasteboard().types()` 可以获取粘贴板文件类型:

```
>>> pb = NSPasteboard.generalPasteboard()
>>> pb.types() # 复制字符串
(
    "public.utf8-plain-text",
    NSStringPboardType,
    "dyn.ah62d4rv4gu81g7pcrvy043mrsvw1u7brqz6hk6xb",
    "sublime-text-extra"
)
>>> pb.types() # 复制图片
(
    "public.png",
    "Apple PNG pasteboard type",
    "public.tiff",
    "NeXT TIFF v4.0 pasteboard type"
)
>>> pb.types() # 复制文件
(
    "public.file-url",
    "CorePasteboardFlavorType 0x6675726C",
    "dyn.ah62d4rv4gu8y6y4grf0gn5xbrzw1gydcr7u1e3cytf2gn",
    NSFilenamesPboardType,
    "dyn.ah62d4rv4gu8yc6durvwwaznwmuuha2pxsvw0e55bsmwca7d3sbwu",
    "Apple URL pasteboard type",
    "com.apple.finder.noderef",
    "com.apple.icns",
    "CorePasteboardFlavorType 0x69636E73",
    fndf,
    "public.utf16-external-plain-text",
    "CorePasteboardFlavorType 0x75743136",
    "public.utf8-plain-text",
    NSStringPboardType,
    "public.tiff",
    "NeXT TIFF v4.0 pasteboard type"
)
```

可以观察到复制文件时候也会有一个 `"public.tiff"` 字段, 这同时也是个图片类型的字段, 所以需要先检查是否为文件:

``` python
if NSFilenamesPboardType in pb.types():
```

再检查是否为字符串类型:

``` python
if NSPasteboardTypeString in data_type:
```

最后再检查是否图片类型:

``` python
if any(filter(lambda f: f in data_type, (NSPasteboardTypePNG, NSPasteboardTypeTIFF))):
```

#### 系统警告

``` python
def notice(msg, title="notice"):
    os.system('osascript -e \'display notification "%s" with title "%s"\'' % (msg, title))

```

需要调用系统 `AppleScript` 命令 `osascript` 来显示系统推送通知.


#### 核心代码

```bash
def run():
    img_file, need_format, format = get_paste_img_file()
    if img_file:
        # has image

        # use time to generate a unique upload_file name, we can not use the tmp file name
        upload_name = "%s.%s" % (int(time.time() * 1000), format)
        if need_format:
            size_str = subprocess.check_output('sips -g pixelWidth %s | tail -n1 | cut -d" " -f4' % img_file.name, shell=True)
            size = int(size_str.strip()) / 2
            markdown_url = '<img src="%s/%s" width="%d" />' % (API_ROOT, upload_name, MD_IMG_WIDTH)
        else:
            markdown_url = '%s/%s' % (API_ROOT, upload_name)

        compressed_file = try_compress_png(img_file, format!='gif')
        shutil.copyfile(compressed_file.name, BLOG_IMG_PATH+upload_name)
        os.system("cd %s && git add . && git ci -m 'add new asset' && git push" % BLOG_IMG_PATH)

        # make it to clipboard
        os.system("echo '%s' | pbcopy" % markdown_url)
        # os.system('osascript -e \'tell application "System Events" to keystroke "v" using command down\'')
    else:
        notice("剪切版里没有图片！")
        exit(1)
```

- 获取剪贴板图片
- 使用时间戳命名
- 拼接出链接: `<img src="http://raw.githubusercontent.com/.." width="500" />`
- 压缩图片
- 将图片拷贝到本地 blog 项目 img 路径下
- git 推送到远程仓库
- 将拼接的链接复制到系统粘贴板


#### 移植到 Alfred

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/1539267511594.png" width="500" />

在 github 里引用图片可以使用相对路径, 比如这样的结构:

```
.
├── 404.html
├── CNAME
├── README.md
├── _posts/
├── img/
```

_posts 下存放博客md文件, img/ 存放图片文件, 在博客md文件里可以这样引用: `<img src="../img/tmp.png" width="50" />`. 但是因为博客是自己的域名, 使用相对路径会找不到资源. 所以需要找到图片的 raw 地址:

```
https://raw.githubusercontent.com/UserName/ProjectName/master/img/ImgName.png
```



## 最后


虽然是用 python 写的脚本, 但是大多数都是用 python 调用 OC/shell. 😄

开源地址: https://github.com/FaiChou/SendBlogImg


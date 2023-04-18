---
title: "My Rime"
date: "2023-04-18"
category: "dev"
emoji: "🎩"
---

Rime 是一款功能强大的输入法, 每个人的习惯不同, 它可以根据不同的习惯来调整方案. 之前使用的系统双拼输入法, 没有词库功能, 想打的字词经常排在后面, 所以体验了一下 Rime, 没想到这么舒畅, 并且使用 **WeChat 主题 + 霞鹜文楷** 非常漂亮. 它需要一点折腾, 比较适合程序员, 自己掌控输入法的各种管理与配置.

![落霞与孤鹜齐飞](loxxyuguwuqifw.png)

下面就是我的折腾历程.

# 安装工作

## 1. 安装 Rime

使用 brew 安装 㞢(https://rime.im/download/)

```bash
brew install --cask squirrel
```

## 2. 安装配置管理工具

使用东方破 plum 来管理配置(https://github.com/rime/plum)

```bash
cd ~/Projects/GitHub
git clone --depth=1 https://github.com/rime/plum
```

## 3. 安装雾凇拼音

雾凇拼音是一个长期维护的简体词库(https://github.com/iDvel/rime-ice)

```bash
cd plum
bash rime-install iDvel/rime-ice:others/recipes/full
```

## 4. 安装霞鹜文楷字体

```bash
brew tap homebrew/cask-fonts && brew install font-lxgw-wenkai
```

# 配置工作

以上安装工作完成后, 就可以开始配置了.

首先需要知道, Rime 的配置文件目录在 `~/Library/Rime` 下

![Rime Congif Path](Rime-Config-Path.png)

配置使用了 YAML 格式, 一些默认配置尽量不要调整, 比如 `default.yaml, dobule_pinyin_flypy.schema.yaml, squirrel.yaml`, 这几个配置文件想要调整则需要对应的 custom 文件: `default.custom.yaml, obule_pinyin_flypy.custom.yaml, squirrel.custom.yaml`.

任何配置文件的修改, 都需要重新部署才能生效, 点击右上角的输入法, 再点击部署, 或者使用脚本应该这么写:

```bash
/Library/Input\ Methods/Squirrel.app/Contents/MacOS/Squirrel --reload
```

好的, 接下来开始折腾吧.


## 1. 主题更新

使用 wechat 主题, 并使用霞鹜文楷

```yaml
# squirrel.custom.yaml
patch:
  # 通知栏显示方式以及 ascii_mode 应用，与外观无关
  show_notifications_via_notification_center: true

  # 修改应用的打开后的中英文
  app_options:
    com.apple.Spotlight:
      ascii_mode: true
    com.microsoft.VSCode:
      ascii_mode: true
      sacii_punct: true
    com.tencent.qq:
      ascii_mode: false
    com.tencent.xinWeChat:
      ascii_mode: false
    com.googlecode.iterm2:
      ascii_mode: true
    com.kingsoft.wpsoffice.mac:
      ascii_mode: false


# 如果想要修改皮肤，直接更改 color_scheme 的值即可
  style:
    color_scheme: wechat_light
    color_scheme_dark: wechat_dark

  preset_color_schemes:
    wechat_light:
      name: 微信键盘浅色
      horizontal: true                          # true横排，false竖排
      back_color: 0xFFFFFF                      # 候选条背景色
      border_height: 0                          # 窗口上下高度，大于圆角半径才生效
      border_width: 8                           # 窗口左右宽度，大于圆角半径才生效
      candidate_format: '%c %@ '                # 用 1/6 em 空格 U+2005 来控制编号 %c 和候选词 %@ 前后的空间
      comment_text_color: 0x999999              # 拼音等提示文字颜色
      corner_radius: 5                          # 窗口圆角
      hilited_corner_radius: 5                  # 高亮圆角
      font_face: 'LXGW WenKai'                  # 候选词字体
      font_point: 16                            # 候选字大小
      hilited_candidate_back_color: 0x75B100    # 第一候选项背景色
      hilited_candidate_text_color: 0xFFFFFF    # 第一候选项文字颜色
      label_font_point: 12                      # 候选编号大小
      text_color: 0x424242                      # 拼音行文字颜色
      inline_preedit: true                      # 拼音位于： 候选框 false | 行内 true
    wechat_dark:
      name: 微信键盘深色
      horizontal: true                          # true横排，false竖排
      back_color: 0x2e2925                      # 候选条背景色
      border_height: 0                          # 窗口上下高度，大于圆角半径才生效
      border_width: 8                           # 窗口左右宽度，大于圆角半径才生效
      candidate_format: '%c %@ '                # 用 1/6 em 空格 U+2005 来控制编号 %c 和候选词 %@ 前后的空间
      comment_text_color: 0x999999              # 拼音等提示文字颜色
      corner_radius: 5                          # 窗口圆角
      hilited_corner_radius: 5                  # 高亮圆角
      font_face: 'LXGW WenKai'                  # 候选词字体
      font_point: 16                            # 候选字大小
      hilited_candidate_back_color: 0x75B100    # 第一候选项背景色
      hilited_candidate_text_color: 0xFFFFFF    # 第一候选项文字颜色
      label_font_point: 12                      # 候选编号大小
      text_color: 0x424242                      # 拼音行文字颜色
      label_color: 0x999999                     # 预选栏编号颜色
      candidate_text_color: 0xe9e9ea            # 预选项文字颜色
      inline_preedit: true                      # 拼音位于： 候选框 false | 行内 true
    wechat:
      name: '微信键盘 / WeChat-keyboard' # 配色取自微信键盘
      author: zsakvo
      back_color: 0xFFFFFF
      border_height: 0
      border_width: 8
      candidate_format: '%c %@ '
      comment_text_color: 0x999999
      corner_radius: 5
      hilited_corner_radius: 5
      font_face: 'LXGW WenKai'
      font_point: 16
      hilited_candidate_back_color: 0x75B100
      hilited_candidate_text_color: 0xFFFFFF
      horizontal: true
      inline_preedit: true
      label_font_point: 12
      text_color: 0x424242
```

当然这里面也设置了应用打开后的默认中英文, 比如我们在 Spotlight 搜索时候一般是用来打开应用, 应用大多都是英文, 所以默认使用英文; 再比如打开 VSCode 大部分是要键入代码, 所以默认也是英文, 并且要使用半角符号.

## 2. 使用 CapsLock 切换中英文

```yaml
# default.custom.yaml
patch:
  "menu/page_size": 9   # 每頁候選數
  "punctuator/import_preset": symbols
  "ascii_composer/good_old_caps_lock": false
```

需要在系统设置中将 `使用大写锁定键切换“ABC”输入法` 关闭, 因为系统的设置优先级最高.

## 3. 设置默认使用英文标点

关于这条, 很多人不喜欢中文下用英文标点符号, 请忽略, 我个人还是习惯这种, 打一个标点再打一个空格.

```yaml
# double_pinyin_flypy.custom.yaml
patch:
  switches:
    - name: ascii_mode
      states: [ 中, A ]
      reset: 0
    - name: ascii_punct # 中英标点
      states: [ ¥, $ ]
      reset: 1
    - name: traditionalization
      states: [ 简, 繁 ]
      reset: 0
    - name: emoji
      states: [ 💀, 😄 ]
      reset: 1
    - name: full_shape
      states: [ 半角, 全角 ]
      reset: 0
```

要说一下半角和全角, 英文标点也是有半角和全角之分的, 所以要使用中英标点来区分.

## 4. 设置常用自定义文本

```yaml
# custom_phrase_double.txt
175xxxx0565	sj
37xxxxxxxxxxxxxxxx	sfz
faxxxxxxxh@gmail.com	yx
山东省青岛市xxxxxxxxxxxxxxx	dz
```

这样就和系统自带的 `Text Replacement` 功能一样了. 因为我用双拼, 需要在 `custom_phrase_double.txt` 里面创建, 而不是默认的 `custom_phrase.txt`.


# 自动更新词库与部署

虽然说 Rime 是一款功能齐全的输入法, 但如果没有词库, 还不如直接使用系统的输入法, 没有了词库便没有了灵魂, 搜狗输入法这种联网的会担心隐私问题, 所以 Rime + 词库能解决, 需要将词库下载到本地库中, 当然还有一些表情符号等.

输入法也有同步功能, 点一下同步, 会自动将配置文件全部同步到 `sync/YOUR_INSTALLATION_ID` 下面.

当然我们希望它能够自动更新, 所以可以使用下面这段脚本:

```bash
#!/bin/bash

set -e

cd ~/Projects/GitHub/plum

echo -e "\033[34mUpdating 㞢... \033[0m"

bash rime-install iDvel/rime-ice:others/recipes/all_dicts
bash rime-install iDvel/rime-ice:others/recipes/opencc

sleep 3

echo -e "\033[34mSyncing 㞢... \033[0m"
/Library/Input\ Methods/Squirrel.app/Contents/MacOS/Squirrel --sync

echo -e "\033[34mDeploying 㞢... \033[0m"
/Library/Input\ Methods/Squirrel.app/Contents/MacOS/Squirrel --reload

osascript -e 'display notification "Rime deployment succeeded 🍻" with title "Plum Update"'
```

这段脚本保存在 `~/bin/update_rime_and_deploy.sh` 中, 然后新建一个 `/Library/LaunchDaemons/com.faichou.rime.plist`:

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
        "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.faichou.rime</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/sh</string>
    <string>/Users/FaiChou/bin/update_rime_and_deploy.sh</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>
    <integer>12</integer>
    <key>Minute</key>
    <integer>0</integer>
  </dict>
</dict>
</plist>
```

命令执行:

```bash
sudo chown root:wheel /Library/LaunchDaemons/com.faichou.rime.plist
sudo launchctl load /Library/LaunchDaemons/com.faichou.rime.plist
```

这样, 每天中午12点就会自动更新词库, 并自动同步配置, 自动部署.


# Refs

- [Rime 配置：雾凇拼音](https://dvel.me/posts/rime-ice/#%e5%9f%ba%e6%9c%ac%e5%a5%97%e8%b7%af)
- [Schema.yaml 詳解](https://github.com/LEOYoon-Tsaw/Rime_collections/blob/master/Rime_description.md)
- [鼠须管输入法配置](https://www.hawu.me/others/2666)
- [Rime Squirrel 鼠须管输入法配置详解](https://ssnhd.com/2022/01/06/rime/)

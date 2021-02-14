---
title: "Linux下3个新快捷键"
date: "2021-02-14"
category: "dev"
emoji: "␡"
---

```
ctrl h: delete the preceding character
ctrl w: delete the preceding word
ctrl u: delete line
```

这三个快捷键在 Vim 的插入模式下也可以使用.

在 Terminal 下, 按下 Backspace 键会给 Terminal 发送一个控制信号: ASCII 码 08,
这个控制信号也可以使用键盘的 `ctrl h` 来完成, h 是第 8 个单词.

如果 Ternimal 没有绑定 Backspace 的功能, 那么当敲击键盘上 Backspace
键会出现一个 `^H`, 是不是很熟悉? 远程控制服务器时候, 虽然 Terminal 能够解释识别
Backspace, 但两个系统发送的信号却不一致, 就会导致屏幕上出现 `^H`.

相同的 `ctrl w` 和 `ctrl u` 就不再多说了.

之前一直记忆 Emacs 下的快捷键, 现在发现这三个快捷键反而特别陌生.


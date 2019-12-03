---
title: "VSCode Word Jump"
date: "2019-11-19"
category: "dev"
emoji: "⌨️"
---

习惯了 emacs 的操作快捷键, 码字敲代码时候不习惯挪动双手, 即便是去按一个方向键也要抬起右手, 太费劲了.
在 emacs 下进行单词跳转 `Option+f` 和 `Option+b`, 但是在 `VSCode` 中就不起作用, 因为按下这个组合键打出来的是特殊字符 `ƒ` 和 `∫`, 所以可以到 `VSCode` 的 `Keyboard Shortcuts` 下绑定快捷键:

1. 搜索 `"alt+f"`, `"alt+b"` 和 `"alt+d"`, 看下有没有已经绑定的快捷键
2. 如果有, 删除之(一般也不太常用), 没有则往下
3. 搜索 `cursorWordRight`, `cursorWordLeft` 和 `deleteWordRight` 绑定上 `Option+f`, `Option+b` 和 `Option+d`

大功告成!

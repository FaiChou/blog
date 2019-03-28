---
title: "px em and rem"
date: "2019-02-25"
category: "dev"
emoji: "🙈"
---

## 本篇其实是探讨 px, em, rem

#### px

px -> pixel for css, 绝对单位

> The px unit is the magic unit of CSS. It is not related to the current font and usually not related to physical centimeters or inches either. The px unit is defined to be small but visible, and such that a horizontal 1px wide line can be displayed with sharp edges (no anti-aliasing).

要区分与设备的分辨率, `1 css px` 不一定等于 `1 device px`.

#### em

em -> font size unit, 相对单位

> Relative to the font-size of the element (2em means 2 times the size of the current font)

#### rem

rem -> font size unit, 相对单位

> Relative to font-size of the root element


## 区别

以绝对单位 px 为准, 来区分 em 和 rem.

em 是相对于当前 font-size 的大小, 而 rem 是相对于 root 的 font-size 大小.

```html
<div id="f1" style="font-size: 1.2em">
    1.2em
</div>
```

html 的默认 root 字体大小是 `16px`, 可以更改之:

```css
html { /* or using :root */
  font-size: 10px;
}
```

在更改之前(root), `#f1` 的大小是 `16*1.2=19.2px`, 更改之后是 `10*1.2=12px`.

```html
<div id="f2" style="font-size: 1.2rem">
    1.2rem
</div>
```

这里的 `#f2` 在更改之前(root)大小是 `16*1.2=19.2px`, 更改之后是 `10*1.2=12px`.



#### 现在还看不出来区别, 多加一层嵌套就有区别了

```html
<div style="font-size: 1.2em">
    <div id="f3" style="font-size: 1.2em">1.2em</div>
</div>
```

在更改之前(root), `#f3` 的大小是 `16*1.2*1.2=23.04px`, 更改之后是 `10*1.2*1.2=14.4px`.

```html
<div style="font-size: 1.2em">
    <div style="font-size: 1.3em">
        <div id="f4" style="font-size: 1.2rem">1.2rem</div>
    </div>
</div>
```

在更改之前(root), `#f4` 的大小是 `16*1.2=19.2px`, 更改之后是 `10*1.2=12px`.


可以看出, em 总是 parent 的大小乘以 em 的数值, 而 rem 总是 root 的大小乘以 rem 的数值.

所以使用 em 要小心.



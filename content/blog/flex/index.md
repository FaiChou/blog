---
title: "flex布局"
date: "2019-04-19"
category: "dev"
emoji: "🎗"
---

`flex-direction` 默认 `row`, 在 `RN` 中默认是 `column`, 可以理解, 因为手机设备以 `Portrait` 为正.

> flex: displays an element as a block-level flex container

```html
<span style="display: flex">
  <div></div>
  ...
</span>
```

此时 `span` 是 `block-level`, 默认占据所有宽度.


> inline-flex: displays an element as an inline-level flex container

```html
<div style="display: inline-flex">
  <div></div>
  ...
</div>
```

此时 `div` 是 `inline-level`, 默认没有宽度.


`flex` 布局是父组件对子组件的布局.
默认不改变子组件在主轴(`flex-direction`的轴方向)的大小, 子组件会占据所有负轴(与`flex-direction`垂直的轴方向)大小.

> alin-self: auto; //	Default. The element inherits its parent container's align-items property, or "stretch" if it has no parent container	

如果设置 `align-items` 那么会改变子组件在负轴的表现形态.


`flex` 布局中所有的子组件都会变成 `block`:

```html
<div style="display: flex">
  <span id="span1"></span>
  <div></div>
</div>
<script>
  console.log(window.getComputedStyle(span1, null).getPropertyValue("display")) // block
</script>
```


## 使用 `flex-flow` 代替 `flex-direction` 和 `flex-wrap`

```css
flex-flow: <'flex-direction'> || <'flex-wrap'>
```

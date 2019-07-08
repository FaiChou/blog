---
title: "CSS Transitions and Transforms for Beginners"
date: "2019-07-05"
category: "translate"
emoji: "🍓"
---

## 原文地址

[CSS Transitions and Transforms for Beginners](https://thoughtbot.com/blog/transitions-and-transforms)


本篇文章将向你介绍 CSS 里的一对法宝: `transion` 和 `transform`. 当它们双剑合璧之后, 这两属性可以给你带来简单的动画交互, 进而提升用户的视觉效果.

要终铭记, 当你在项目中添加任何动画时候, 一定要保持动画的简单轻量与一致. 你创造的动画应该给用户传达思想, 提升而不是阻碍用户对网站的交互.

因此什么是 `transform` 和 `transition`?  最基础的解释: `transform` 是移动或改变元素的样子, `transition` 是设置元素的过渡动画流畅与渐变.

## Transition 介绍

以 `transition` 开始. `Transition` 像是 `transform` 的轮胎润滑油. 没有了 `transition`, 元素的变换像是丢失了灵魂从一个状态直接变化到另一个状态. 设置了 `transform` 你就可以控制变换的光滑与渐进.

鼠标放上去:

<p class="codepen" data-height="290" data-theme-id="0" data-default-tab="css,result" data-user="rachelcope" data-slug-hash="raGwPq" style="height: 290px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="With and Without Transition">
  <span>See the Pen <a href="https://codepen.io/rachelcope/pen/raGwPq/">
  With and Without Transition</a> by Rachel Cope (<a href="https://codepen.io/rachelcope">@rachelcope</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

本篇将配合使用 `transition` 和 `transform`. 但是, `transition` 可以用在任意元素变化的地方, 比如按钮悬浮时颜色变化.

`transition` 有两个必须的属性:

1. `transition-property`
2. `transition-duration`

每个属性都可以独立声明, 但为了保持代码的简洁, 建议使用合并的属性 `transition` 来代替.

以下是全部的简写属性顺序. (前两属性是必须的):

```
div {
  transition: [property] [duration] [timing-function] [delay];
}
```

### transition-property

`transition-property` 指明何种 css 属性将将被设置. 你可以设置单一属性比如背景颜色或变换, 或者应用所有属性规则变化: `all`.

```css
div {
  transition-property: all;
  transition-property: transform;
}
```

### transition-duration

`transition-duration` 属性指明过度动画的时间. 你可以用秒或毫秒做单位.

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="css,result" data-user="rachelcope" data-slug-hash="vOqVjg" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Translation Delay">
  <span>See the Pen <a href="https://codepen.io/rachelcope/pen/vOqVjg/">
  Translation Delay</a> by Rachel Cope (<a href="https://codepen.io/rachelcope">@rachelcope</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

```css
div {
  transition-duration: 3s;
}
```

#### 简写

```css
div {
  transition: all 3s;
}
```

### transition-timing (可选属性)

`transition-timing-function` 属性控制过渡时的速度. 默认是 `ease`, 初始速度慢, 逐渐加速, 最后减速结束. 其他可选属性有 `linear`, `ease-in`, `ease-out`, `ease-in-out`.

这里有个例子, 里面的元素使用了不同的时序:

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="css,result" data-user="rachelcope" data-slug-hash="gbxzmo" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Transition-Timing">
  <span>See the Pen <a href="https://codepen.io/rachelcope/pen/gbxzmo/">
  Transition-Timing</a> by Rachel Cope (<a href="https://codepen.io/rachelcope">@rachelcope</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

这里也可以设置自定义的时序函数, 比如 [cubic-bezier](https://developer.mozilla.org/en-US/docs/Web/CSS/timing-function).

#### 用法

```css
div {
  transition-timing-function: ease-in-out;
}
```

#### 简写

```css
div {
  transition: all 3s ease-in-out;
}
```

### transition-delay (可选)

`transition-delay` 属性指定元素过渡的开始时间. 默认是触发时就开始过渡, 比如鼠标划过.

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="css,result" data-user="rachelcope" data-slug-hash="vDIbj" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Transition Delay Example">
  <span>See the Pen <a href="https://codepen.io/rachelcope/pen/vDIbj/">
  Transition Delay Example</a> by Rachel Cope (<a href="https://codepen.io/rachelcope">@rachelcope</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

#### 简写

```css
div {
  transition: all 3s 1s;
}
```

负值会直接触发过渡的进行.


## Transform 介绍

现在我们掌握了如何使元素平滑渐进地变换, 现在我们在看下 `transform` - 如何使元素从一状态变道另一状态. 使用 `transform` 你可以将一个元素旋转, 移动, 倾斜, 缩放.

`Transform` 是触发了元素状态的变化, 比如鼠标滑到元素, 鼠标点击元素等. 例子中将演示鼠标滑到元素的变换.

为了简单, 这里将只是用未适配(通用)的浏览器版本来演示. 然而你要在开发时候添加前缀来适配其他浏览器.

### Scale

`Scale` 放大或缩小元素的大小.

比如, 设置 2, 元素将变为原始大小的 2 倍, 0.5 将元素变为原始大小的一半.

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="css,result" data-user="rachelcope" data-slug-hash="gbxxXe" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Transform: Scale">
  <span>See the Pen <a href="https://codepen.io/rachelcope/pen/gbxxXe/">
  Transform: Scale</a> by Rachel Cope (<a href="https://codepen.io/rachelcope">@rachelcope</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

你可以为元素的横轴或竖轴单独设置参数, 比如 `transform: scaleX(2)`.

或者使用 `scale()` 同时设置横竖轴: `transform: scale(2)`, 再或者单独为双轴设置: `transform: scale(2, 4)`.

#### 语法

不要忘记加 `transition` 属性. 如果没有设置 `transition`, 那么元素将直接形变.

```css
div {
  transition: transform 1s;
}
div:hover {
  transform: scale(2);
}
```

### rotate

使用 `rotate`, 元素将顺时针或逆时针旋转度数. 一个正数比如 `50deg` 将顺时针旋转元素, 一个负数 `-90deg`, 将逆时针旋转元素.

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="css,result" data-user="rachelcope" data-slug-hash="mhkgr" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Transform Rotate Example">
  <span>See the Pen <a href="https://codepen.io/rachelcope/pen/mhkgr/">
  Transform Rotate Example</a> by Rachel Cope (<a href="https://codepen.io/rachelcope">@rachelcope</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

可以设置大于 360 的度数, 比如 `1080deg`, 它将顺时针旋转3整圈.

#### 语法

```css
div {
  transition: transform 1s;
}
div:hover {
  transform: rotate(1080deg);
}
```

### translate

`transition` 可以移动上下左右移动元素.

一个正的 X 值将移动元素到右侧, 一个负的 X 值会移动元素到左侧. 同样, 一个正的 Y 值将向上移动元素, 负的 Y 值将向下.

下面例子元素被向右下移动了 20 像素.

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="css,result" data-user="rachelcope" data-slug-hash="GgvvyQ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Transform: Translate">
  <span>See the Pen <a href="https://codepen.io/rachelcope/pen/GgvvyQ/">
  Transform: Translate</a> by Rachel Cope (<a href="https://codepen.io/rachelcope">@rachelcope</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

#### 语法

```css
div {
  transition: transform 1s;
}
div:hover {
  transform: translate(20px, 20px);
}
```

### skew

`skew` 将元素向一个方向倾斜指定的数值.

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="css,result" data-user="rachelcope" data-slug-hash="azyGpO" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Transform: Skew">
  <span>See the Pen <a href="https://codepen.io/rachelcope/pen/azyGpO/">
  Transform: Skew</a> by Rachel Cope (<a href="https://codepen.io/rachelcope">@rachelcope</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

正值 X 会让元素向左倾斜, 负值 X 会让元素向右倾斜. 正值 Y 会让元素向下倾斜, 负值 Y 会让元素向上倾斜.


#### 语法

```css
div {
  transform: skewX(25deg);
  transform: skewY(10deg);
  transform: skew(25deg, 10deg);
}
```

```css
div {
  transition: transform 1s;
}
div:hover {
  transform: skewX(-20px);
}
```

备注: 倾斜某一元素会使此元素所有的子元素都倾斜, 如果想让某一子元素恢复原来状态, 那就需要设置子元素相反的值.

### transform-origin

`Transform-origin` 是独立于 `transform` 的, 但它是和 `transform` 搭配起来用的. 它规定了元素变换的初始位置. 默认是在元素的正中心位置开始变换.

比如你想旋转某一元素: 你想从元素左上角开始旋转而不是从中间开始, 那么你应该设置 `0% 0%` 或者 `left top`. 如果你想从右下角开始旋转, 那么你应该设置 `100% 100%` 或者 `right bottom`.


<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="css,result" data-user="rachelcope" data-slug-hash="bNjGrL" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Transform Origin Example">
  <span>See the Pen <a href="https://codepen.io/rachelcope/pen/bNjGrL/">
  Transform Origin Example</a> by Rachel Cope (<a href="https://codepen.io/rachelcope">@rachelcope</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

要确保 `transform-origin` 设置为当前元素上, 而不是 `:hover` 选择器上.

```css
div {
  transform-origin: left top;
  transition: transform 1s;
}

div:hover {
  transform: rotate(720deg);
}
```

### transform 结合

你可以结合多个属性到 `transform` 下, 或者使用 `matrix` 方法.

```css
div {
  transform: rotate(90deg) scale(2) translateY(-50%) translateX(50%);
}
```

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="css,result" data-user="rachelcope" data-slug-hash="jELxad" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Combining Transforms">
  <span>See the Pen <a href="https://codepen.io/rachelcope/pen/jELxad/">
  Combining Transforms</a> by Rachel Cope (<a href="https://codepen.io/rachelcope">@rachelcope</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>


## Matrix

`Matrix` 方法是结合了 `scale`, `skew` 和 `translate` 属性为一体, 使用坐标系统. 当使用一些 js 库时候 `matrix` 会显得格外有用, 但是手写 `matrix` 是挺困难的. 你可以在[这里](https://developer.mozilla.org/en-US/docs/Web/CSS/transform#matrix)阅读更多有关 `matrix` 方法 和 `coordinates` 的相关知识.


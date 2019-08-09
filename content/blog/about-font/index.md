---
title: "About Font"
date: "2019-08-09"
category: "dev"
emoji: "🔤"
---

## 字偏上?

```css
.text {
  height: 30px;
  line-height: 30px;
}
```

## 居中

```css
.text {
  text-align: center;
}
```

## 字间距

```css
.text {
  letter-spacing: 2px;
}
```

## 一行显示不开 ...

```css
.text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

## 显示3行 ...

```css
.text {
  display: block;
  display: -webkit-box;
  max-width: 100%;
  height: 43px;
  margin: 0 auto;
  font-size: 14px;
  line-height: 1;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
```
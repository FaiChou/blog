---
title: "element-vs-component"
date: "2019-01-07"
category: "dev"
emoji: "🌀"
---

## Element 和 Component

```javascript
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

```javascript
{
  type: Button,
  props: {
    color: 'blue',
    children: 'OK!'
  }
}
```

以上两种 object, 都是 DOM Element 在 React 中的**描述**, 被称作 React Element.

```javascript
React.createElement('button', { style: { background: color } }, text)
```

```javascript
const Button = ({ color, text }) => (
  <button style={{ background: color }}>{text}</button>
)
<Button />
```

```javascript
class Button extends React.Component {
  render() {
    return <button style={{ background: color }}>{text}</button>
  }
}
<Button />
```

以上几条语法, 都是 React 中创建 React Element 的方法.

严格地讲, `ReactDOM.render(<Button />, root)` 这句里面, ReactDOM 并不是渲染了 Component 或 React Element, 而是渲染 DOM Elements, 因为直接在屏幕上看到的 html 都是 DOM elements. 在 React 中, 描述一个 Element 要么是 class 的实例(instance), 要么是 function 的返回值, 再或者是最直接的 elements.

定义的 React Element 有关键的 **type** 属性: 要么是 *string*, 要么是 *function/class*.

*string* 的话都是内建的元素(built-in components) 比如 `div/a/img` 等, *function/class* 的话是复合元素(CompositeComponents) 比如 `Button/Star`..

一个常见问题:

```javascript
const D = <div>d</div>;
ReactDOM.render(<D />, document.getElementById('root'));
```

会报错:

> Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.


正确用法是 `ReactDOM.render(D, docu..)`, 如果用在 CompositeComponent 里 需要用花括号扩展(jsx): `<div>{D}</div>`.

```javascript
class D {}
typeof D // "function"
let d = new D();
typeof d // "object"
```

所以可以看出来 react 是如何检查的, **type** 只有 *string* 和 *function* 两种类型, 而 `D = <div>d</div>` 确是 **object** 类型.


## 总结

> `<Star />` 整个表达式是一个 React Element，而 `Star` 是一个 Component， Component 要么是 function（class 也是 function），要么是纯 DOM.


顺便提一嘴, `ReactDOMServer.renderToString(element)` 中, 返回的是 HTML 字符串, 这个 `ReactDOMServer.renderToString` 大多数用法是用来服务端渲染, 以利于 SEO 优化.

有点跑题? 慢慢拽回来.

既然 `ReactDOMServer.renderToString(element)` 返回的是 HTML 字符串, 如何把字符串转变为 DOM node:

```javascript
const getDOMNodeFromReact = element => {
	const div = document.createElement('div');
	div.innerHTML = ReactDOMServer.renderToString(element).trim();
	return div.firstChild;
};
```

https://github.com/Cogoport/cogo-toast/blob/master/src/index.js#L15

这就很有意思了: 可以通过这个方法将任意 element 直接转换出 DOM node, 而不需要 `ReactDOM.render` 的管理, 可以摆脱父组件的控制.

这里和 Portal 很像, 哈

> Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.

## 参考

- [React Components, Elements, and Instances](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)
- [React Interview Question: What gets rendered in the browser, a component or an element?](https://medium.freecodecamp.org/react-interview-question-what-gets-rendered-in-the-browser-a-component-or-an-element-1b3eac777c85)


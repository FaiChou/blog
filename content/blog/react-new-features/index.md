---
title: "拥抱react新特性"
date: "2018-11-19"
category: "dev"
emoji: "🌈"
---

很多特性是 *react16.3* 提出来的, 尽管 *16.3* 版本已经过去了很长时间, 但是这些「新」特性却很少在代码中使用, 或者说没有在重构时候拥抱新特性.

## life cycle

#### getDerivedStateFromProps

极少用到的方法.

#### UNSAFE_componentWill*

- willMount
- willUpdate
- willReceiveProps

这三个已经被列为 legacy, 应该尽量少用, 并且见到有用的地方就要考虑重构掉.

willMount 里的内容可以放到 constructor 或者 didMount 中.
willUpdate 在 update 之前还要做事?
willReceiveProps 的内容可以放到 didUpdate 中.

didMount 可以大多用做 网络请求 和添加 subscription.

didUpdate 可以对比 prevProps.p1 与 this.props.p1 来进行下一步逻辑.
比如:

```javascript
componentDidUpdate(prevProps) {
  // Typical usage (don't forget to compare props):
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID); // end will setState()
  }
}
```

当 props 改变时走完 render 方法, 如果忘记了比较 prevProps 那么容易触发死循环, 所以一定要加上判断.

## fragments

考虑这种情况:

```javascript
<tr>
{data.map(d =>
    <div>
        <td>{d.id}</td>
        <td>{d.title}</td>
    </div>
)}
</tr>
```

是不是感觉很烦? 如果不多加这一层 <div> 那么就会报错. 那么这时可以用 fragments:

```javascript
<React.Fragment>
  <td>{d.id}</td>
  <td>{d.title}</td>
</React.Fragment>
```

或

```javascript
<>
  <td>{d.id}</td>
  <td>{d.title}</td>
</>
```

## component vs purecomponent vs function component

任何一个继承自 `React.Component` 的控件, 只要它的 props 变了, 就会走 render 方法.

但是如果在 `shouldComponentUpdate` 里返回 `false` 就会禁止了重新 render, 所以在这个方法里多加一些对 props 的判断可以避免一些不必要的渲染工作.

这就是 `PureComponent` 已经做了的工作, 它会对比每一个 props 是否相等:

```javascript

shouldComponentUpdates(nextProps) {
  return (
    nextProps.id !== this.props.id ||
    nextProps.datas !== this.props.datas ||
    nextProps.person !== this.props.person
  );
}

```

单纯的 id 是没问题的, 可是 array 或者 obj 就会出现问题:

```javascript
class Words extends React.PureComponent {
  render() {
    return <div>{this.props.words.join(',')}</div>;
  }
 }
 
class WordAdder extends React.Component {
  state = {
    words: ['marklar']
  }
  handleClick = () => {
    // 这个地方导致了bug
    const words = this.state.words;
    words.push('marklar');
    this.setState({words: words});
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
        <Words words={this.state.words} />
      </div>
    );
  }
}
```

因为指向的 words 都是同一个, 所以一般用的时候都是这么用的:

```javascript
this.setState(prevState => ({
  words: prevState.words.concat(['marklar'])
}));
```

并且 RN 中的 FlatList 也是这个原因, 所以要绑定 `extraData={this.state}`, 防止数据变了而列表并没有刷新.

而 function (stateless) component 是没有状态的, 只要 props 变了它就会重新返回 dom , 一般的写一个 Item 会选择使用它.

function (stateless) component 不能创建 ref.


## refs

```javascript
<WebView ref="webview" />
```

这种使用方式已经被 react 列为 [legacy](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs), 应该采用以下两种:

```javascript
webview = React.createRef()

<WebView ref={this.webview} />

// or
<WebView ref={ref => this.webview = ref} />
```

## context

context api 是为了解决多级参数传递问题, 如果不用 context, 只能一级一级的将 props 传递下去, 愚蠢且复杂. (为什么不用redux呢?)

在 *16.3* 之前就已经有 context 了, 但是官方文档并没有推崇其用法.

虽然不能取代 redux 的位置, 但是 context api 搭配 redux 用可以起到很厉害的作用, 比如说国际化和主题用 context 控制, 其他复杂数据使用 redux 管理.

当然过度使用 context 也是很累的, 一层一层的 Provider 嵌套..

[例子](https://reactjs.org/docs/context.html#dynamic-context)

## portal

之前写过一篇 [portal](http://faichou.space/notes/2017/12/25/react-portal-tut) 的介绍, react 中是表现在创建平行于 root 级别的dom, 而 RN 中的实现则是使用 present 一个 viewcontroller (iOS), 安卓的类似.




## 参考

- [谈一谈创建React Component的几种方式](https://segmentfault.com/a/1190000008402834)
- [eact-functional-stateless-component-purecomponent-component-what-are-the-dif](https://stackoverflow.com/questions/40703675/react-functional-stateless-component-purecomponent-component-what-are-the-dif)
- [refs-and-the-dom](https://reactjs.org/docs/refs-and-the-dom.html)
- [fragments](https://reactjs.org/docs/fragments.html)
- [context](https://reactjs.org/docs/context.html)
- [portal](https://reactjs.org/docs/portals.html#___gatsby)
- [life cycle diagram](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)


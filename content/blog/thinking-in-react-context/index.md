---
title: "Thinking in React Context API"
date: "2022-02-25"
category: "dev"
emoji: "🛶"
---

https://reactjs.org/docs/context.html

Context 可以跨层级传数据, 并且直接被 React 支持.

想想这段代码:

```javascript
import React from 'react';
var obj = null;
var listener = null;
function getObj() { return obj; }
function setListener(l) { listener = l; }
function setObj(o) {
  obj = o;
  if (listener) { listener(o); }
}
function Child1() {
  return (
    <div>{JSON.stringify(getObj())}</div>
  )
}
function Child2() {
  const setRandom = () => {
    setObj({ val: Math.random().toString() });
  }
  return (
    <button onClick={setRandom}>click</button>
  )
}
export default function App() {
  const [, forceUpdate] = React.useReducer(x=>x+1,0);
  React.useEffect(() => {
    setListener((newObj) => {
      forceUpdate();
      console.log(newObj);
    })
  }, [])
  return (
    <div>
      <Child1 />
      <Child2 />
    </div>
  );
}
```

其实 Context 就是一个全局的数据, 可以方便 Consumer 使用, 并且配合现在的 useContext hook, 使用起来更方便.

但 Context 仅仅是对于数据, 没有人保证数据变化子组件也会变化, 就像 props 一样, 只有父组件 re-render 子组件重新被执行才能获取新的数据. 大部分的使用场景都是配合 setState 来用, setState 使父组件 re-render, 所以子组件会获得最新的数据. 除此之外, 也有其他的使用场景.

## react-redux

[react-redux](https://github.com/reduxjs/react-redux) 使用了 Context 来传输数据. 当然, 它最核心的是 subscription.

#### Provider

`Provider` 是这个库的最顶层, 存储了 ContextValue, 其中有两个主要的数据, 一个是主要的 store, 另一个是 subscription. 整个 *react-redux* 就是围绕最顶层 subscription 展开的.

#### Connect

`connect` 是一个 HOC, 被 connect 的组件会自动继承到 parent 的 subscription. 当 store 数据变化, 会通过 subscription 一个一个通知到整个 tree.

大概是这个流程, 所以就没有用到 setState 或者 forceUpdate 来通知整个 tree 来更新, 这样保证了没有被 connect 的组件避免刷新.

那它是通过什么方式呢? 通过一个神秘的 React API: `useSyncExternalStore`, 它接受的第一个参数是上面的 subscription, 这样 React 会插入一个 listener 到其中, 当 subscription 更新时候, React 会收到通知, 然后  re-render.


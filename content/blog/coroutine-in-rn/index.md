---
title: "协程在RN中的使用"
date: "2018-05-29"
category: "dev"
description: "react-native coroutine"
emoji: "🚴🏼‍♂️"
---


## 协程在RN中的使用

[Demo地址](https://github.com/FaiChou/RNRefreshingScrollViewDemo)

vs

[不使用Coroutine的控件地址](https://github.com/gameboyVito/react-native-ultimate-listview/blob/master/src/refreshableScrollView.ios.js)

本篇并不是 ScrollView 的新轮子, 而是对比两种实现方式的差别, 来认识coroutine.

要实现的是一个对 RN 中 ScrollView 的封装, 给它添加一个隐藏的 Header, 具有下拉刷新功能.

假设你已经对 js 的 [Iterators and generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)有所了解.

#### 什么是 Coroutine

```javascript
function* idMaker() {
  let index = 0;
  while(true)
    yield index++;
}
let gen = idMaker();
console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
```

这是官网 generator 的栗子, yield 作为一个类似 return 的语法返回id, 下次调用 `next()` 时候, 继续上次位置 -> 循环 -> 继续返回新id.


> The next() method also accepts a value which can be used to modify the internal state of the generator. A value passed to next() will be treated as the result of the last yield expression that paused the generator.

yield 还可以捕获 `next(x)` 传的参数, 所以可以根据传的不同参数, yield 代理转接不同的方法. 

再举个新的栗子.

```javascript
function* logTest(x) {
  console.log('hello, in logTest!');
  while (true) {
    console.log('received:', yield);
  }
}
let gen = logTest();
gen.next(); // hello, in logTest!
gen.next(1); // received: 1
gen.next('b'); // received: b
gen.next({a: 1}); // received: {a: 1}
```

这个方法中, 获取了 next 的参数, 调用 `gen.next(1)` 直接输出了结果.

如何自动执行 generator , 而不是手动调用 `next()` 呢? **使用 `coroutine`**:

```javascript
function coroutine(f) {
    var o = f(); // instantiate the coroutine
    o.next(); // execute until the first yield
    return function(x) {
        o.next(x);
    }
}
```

这样可以给 `logTest` 装备上 `coroutine`:

```javascript
let coLogTest = coroutine(logTest); // hello, in logTest!
coLogTest('abc'); // received: abc
coLogTest(2); // received: 2
```

再看个简单栗子吧:

```
let loginState = false;
function* loginStateSwitcher() {
    while (true) {
        yield;
        loginState = true;
        console.log('Login!');
        yield;
        loginState = false;
        console.log('Logout!');
    }
}

let switcher = coroutine(loginStateSwitcher);
switcher(); // Login!
switcher(); // Logout!
switcher(); // Login!
```

直接一个 `switcher()` 用户登录登出便捷明了.

#### ScrollView 下拉刷新的逻辑

![效果图](https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/refreshablescrollview.gif)

可以大致看下没有[使用 coroutine 的处理方式](https://github.com/gameboyVito/react-native-ultimate-listview/blob/master/src/refreshableScrollView.ios.js):

1. 放一个 `RefreshHeader` 到 `ScrollView` 的头上
2. 绑定 `onScrollBeginDrag`, `onScroll`, `onScrollEndDrag` 方法
3. 用户开始拖拽 scrollview, 记录 `_dragFlag = true` 和 `_offsetY`
4. 用户拖拽过程中
    - 判断是否为用户手动触发的 `onScroll`
    - 判断此时是否正在刷新
    - 拖拽高度大于触发高度, 设置 `this.state,refreshStatus` 为 `releaseToRefresh`
    - 拖拽高度小于出发高度, 设置 `this.state,refreshStatus` 为 `pullToRefresh`
5. 用户释放手指
    - 设置标志位 `_dragFlag = false` 和记录 `_offsetY`
    - 如果没在刷新, 并且刚才的状态为 `releaseToRefresh`, 去刷新, 设置 `_isRefreshing = true` 并且 `this.state,refreshStatus` 设置为 `refreshing`, 调用 `props.onRefresh()` 方法, scrollView 滚动到保持刷新状态位置 `{ x: 0, y: -80 }`
    - props 里的 `onRefresh(onEndRefresh)`, 需要将结束刷新的方法回调给用户
    - `onRefreshEnd` 方法里将 `_isRefreshing` 设为 false, `this.state,refreshStatus` 设为 `pullToRefresh`, scrollView 滚动到初始位置 `{ x: 0, y: 0}`


可以去看下代码, 几乎所有拖拽释放逻辑分散到 `onScrollBeginDrag`, `onScroll`, `onScrollEndDrag` 方法中了, 如果这几个方法要共享状态就需要申请几个临时变量, 比如 `_offsetY`, `_isRefreshing`, 和 `_dragFlag`.

#### 使用 coroutine 统筹管理

```javascript
    this.loop = coroutine(function* () {
      let e = {};
      while (e = yield) {
        if (
          e.type === RefreshActionType.drag
          && that.state.refreshStatus !== RefreshStatus.refreshing
        ) {
          while (e = yield) {
            if (e.type === RefreshActionType.scroll) {
              if (e.offsetY <= -REFRESH_VIEW_HEIGHT) {
                that.changeRefreshStateTo(RefreshStatus.releaseToRefresh);
              } else {
                that.changeRefreshStateTo(RefreshStatus.pullToRefresh);
              }
            } else if (e.type === RefreshActionType.release) {
              if (e.offsetY <= -REFRESH_VIEW_HEIGHT) {
                that.changeRefreshStateTo(RefreshStatus.refreshing);
                that.scrollToRefreshing();
                that.props.onRefresh(() => {
                  // in case the refreshing state not change
                  setTimeout(that.onRefreshEnd, 500);
                });
              } else {
                that.scrollToNormal();
              }
              break;
            }
          }
        }
      }
    });
```

只需要在相应的事件时候调用 `this.loop` 即可.

```javascript
  onScroll = (event) => {
    const { y } = event.nativeEvent.contentOffset;
    this.loop({ type: RefreshActionType.scroll, offsetY: y });
  }

  onScrollBeginDrag = (event) => {
    this.loop({ type: RefreshActionType.drag });
  }

  onScrollEndDrag = (event) => {
    const { y } = event.nativeEvent.contentOffset;
    this.loop({ type: RefreshActionType.release, offsetY: y });
  }
```

协程方法接受参数 `{type: drag, offsetY: 0}`, 用来根据当时拖拽事件和位置处理相应逻辑.

可以看到协程方法里有两个 `while (e = yield)`:

```javascript
while (e = yield) {
  if (
    e.type === RefreshActionType.drag
    && that.state.refreshStatus !== RefreshStatus.refreshing) {
    // ..
}
```

第一个配合 if, 可以限制用户只有当第一次拖拽开始时候来开启下一步.

```javascript
 while (e = yield) {
   if (e.type === RefreshActionType.scroll) {}
   else if (e.type === RefreshActionType.release) {}
}
```

第二个用来处理滑动过程中和释放的事件, 这里可以肯定用户是进行了拖拽才有的事件, 于是就免去了 `_dragFlag` 临时变量.

当事件为 `RefreshActionType.scroll`, 再根据 `offsetY` 调用 `changeRefreshStateTo()` 设置当前刷新的状态为 `releaseToRefresh` 还是 `pullToRefresh`.

当事件为 `RefreshActionType.release`, 判断 `offsetY`, 如果超过触发刷新位置, 调用 `changeRefreshStateTo()` 设置当前刷新状态为 `refreshing`, 将 scrollview 固定到刷新状态的位置(否则会自动滑上去), 并且调用 `props.onRefresh()`; 如果不超过触发刷新位置, 则将 scrollView 滑动到初始位置(隐藏header). **break 退出当前 while 循环**, 继续等待下次 drag 事件到来.


`<Header />` 会根据当前状态展示不同文字, 提示用户`继续下拉刷新,释放刷新和刷新中`, 根据刷新状态设置下尖头,上箭头还是 Loading.

PS.

 > setState() as a request rather than an immediate command to update the component. For better perceived performance, React may delay it, and then update several components in a single pass. React does not guarantee that the state changes are applied immediately.
 
[一直是下拉状态的issue](https://github.com/gameboyVito/react-native-ultimate-listview/issues/42), 是由于setState不会立即触发改变状态导致的, 为解决这个问题, 我的处理方式是加一个半秒的延迟:

```javascript
that.props.onRefresh(() => {
  // in case the refreshing state not change
  setTimeout(that.onRefreshEnd, 500);
});
```

#### 使用 coroutine 的优点

1. 逻辑清晰
2. 减少不必要的变量

如果发现其他优点, 欢迎留言.


#### 其他使用场景

[照片查看器](https://github.com/FaiChou/ImagePreviewer)

如果还有见过其他使用场景, 欢迎留言.



#### 参考链接

- [async-generators](https://davidwalsh.name/async-generators)
- [javascript-coroutines](https://x.st/javascript-coroutines/)
- [coroutines](http://www.dabeaz.com/coroutines/Coroutines.pdf)







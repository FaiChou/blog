---
title: "co函数的理解"
date: "2020-01-10"
category: "dev"
emoji: "🙇‍♂️"
---

[tj/co](https://github.com/tj/co) 是一个 generator 自执行的状态管理库, 短短的几百行代码即收获了 11k 的 star, 其实 generator 自执行也是 [redux-saga](https://github.com/redux-saga/redux-saga/) 的核心, 精简代码如下:

```javascript
function co(fn) {
  return function() {
    var gen = fn.apply(this, arguments)
    function handle(result) {
      if (result.done) return Promise.resolve(result.value)
      return Promise.resolve(result.value)
        .then(function(res) {
          return handle(gen.next(res))
        })
        .catch(function(ex) {
          return handle(gen.throw(ex))
        })
    }
    try {
      var result = gen.next()
      return handle(result)
    } catch (ex) {
      return Promise.reject(ex)
    }
  }
}
```

首先配合一个例子来解释下它的作用:

```javascript
function* login(name, pswd, session) {
  var user = yield queryUser(name);
  var hash = yield crypto.hashAsync(pswd + user.salt);
  if (user.hash !== hash) {
    throw new Error('Incorrect password');
  }
  session.setUser(user);
}
```

这是一个简单的登录的例子, 有两个异步方法: `queryUser` 和 `crypto.hashAsync`, 我们知道 `yield` 关键字相当于 `return` 会将表达式返回, 并且要继续往下执行, 需要一个 `for of` 或者手动调用 `.next()`, 所以这里可以配合 `co` 这个函数来自动执行它.

例子可以这样使用: `co(login)()`, 其中 `co` 接受一个 `generator` 并返回一个函数, 这个函数的执行会自动执行里面被 `yield` 的方法. `co` 的核心是 `handle` 方法:

```javascript
function handle(result) {
  if (result.done) return Promise.resolve(result.value)
  return Promise.resolve(result.value)
    .then(function(res) {
      return handle(gen.next(res))
    })
    .catch(function(ex) {
      return handle(gen.throw(ex))
    })
}
```

首先它需要判断 `generator` 结束与否, 使用 `result.done` 来判断. 如果没有结束, 此时 `result.value` 即为**被 `yield` 的异步方法**, 所以需要 `Promise.resolve(result.value)` 来执行. 执行结束, 拿到结果继续递归调用 `handle` 方法来向下执行, 因为需要将异步方法的结果传递下去, 需要将结果传递给 `next`: `return handle(gen.next(res))`.

有一个难点是 `catch` 块, 这里面为什么需要再次调用 `handle`? 直接 `throw` 会有什么问题吗?

这里我再写个例子来说明下:


```javascript
var delayMsg = (ms, content) => new Promise(r => setTimeout(r, ms, content))
var delayErr = (ms, content) => new Promise((_, reject) => setTimeout(reject, ms, new Error(content)))

co(function* (value) {
  try {
    var data1 = yield delayMsg(2000, value)
    yield delayErr(2000, data1)
    var data2 = yield delayMsg(1000, data1)
    console.log(data2)
  } catch (error) {
    console.log('IN CATCH BLOCK:', error)
    yield 1
  }
})('hello')
```

如果去掉了 `handle`, 则在 `catch` 块里的 `yield` 不会被继续执行.


业务场景中使用到的例子:

### 直播回放弹幕播放

有一个弹幕列表:

```javascript
const list = [
  { ms: 1000, msg: 'hello1' },
  { ms: 2000, msg: 'hello2' },
  { ms: 2400, msg: 'hello3' },
  { ms: 2800, msg: 'hello4' },
  { ms: 10000, msg: 'hello' },
]
```

ms 代表毫秒, msg 代表当到达视频 ms 时需要发送的弹幕, 所以需要写一个自动发射弹幕的方法:

```javascript
function launch(msg, ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms, msg)
  })
}

co(function* autoLancher(list) {
  for (var [i, obj] of list.entries()) {
    const ms = i === 0 ? obj.ms : obj.ms - list[i-1].ms
    const message = yield launch(obj.msg, ms)
    console.log(message)
  }
})(list)
```


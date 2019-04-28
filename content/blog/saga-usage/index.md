---
title: "saga"
date: "2018-12-01"
category: "translate"
emoji: "🇺🇸"
---

## Before

写 `react + redux` 程序, 在没有遇到 `saga` 之前, 只能在 component 的生命周期中使用 **异步请求 + dispatch(action)** 的方式进行状态变化, 这样网络请求可能会让 component 逻辑更加混乱并且引发不必要的冲突. 最理想的状态就是 MVC, M就是数据, VC是控件本身的 **div + 生命周期**, 控件只负责渲染样式, state 或者 props 改变继续响应改变的样式. 所以 saga 就是解决这件事情的.

redux-saga 是 redux 的中间件, 中间件可以捕获 action, 决定是否响应. 所以, 网络请求前只需要发送一个 action, 被 saga 捕获, saga 决定使用 Api 来请求数据, 这时候挂起了一个网络请求的 task, 当请求结束, 再将请求成功的结果 dispatch 到 store, 或者将请求失败的通知 dispatch 给 store.

所以 saga 可以解决异步的一系列痛点, 比如登录登出同时token的缓存的存储与销毁.

## How it works

> Sagas are implemented as *Generator functions* that yield objects to the redux-saga middleware. The yielded objects are a kind of instruction to be interpreted by the middleware. When a Promise is yielded to the middleware, the middleware will suspend the Saga until the Promise completes. 

saga 使用 es6 的`generator函数`来运行, yield 的简单用法可以在网上查到, 这里多说一点在 saga 中常用的方法, `yield asyncFunction`:

```javascript
function* fetchUser() {
  const user = yield apiCall()
  console.log(user)
}

const apiCall = () => new Promise(resolve =>
  setTimeout(
    resolve,
    2000,
    { name: 'faichou', dob: 1994 }
  )
)

const gen = fetchUser()

gen.next().value
gen.next()
```

常见的 saga 用法是 yield 后面跟一个动作, 这个动作如果返回一个异步函数, 那么 saga 就会挂载起来, 一直等到异步函数 resolve.

saga 是如何工作的呢? 首先 saga 会判断 `value` 是否为 `promise`, 如果是, 那么等到 `resolve`, 将值再返回 `next(val)`, 如果不是, 那么将表达式的值直接 `next(val)`:

```javascript
const valUnknown = gen.next().value
let val = null
if (valUnknown instanceof Promise) { // or typeof valUnkown.then === 'function'
  valUnknown.then(r => {
    val = r
    gen.next(val)
  }).catch(err => {
    gen.throw(err)
  })
} else {
  val = valUnknown
  gen.next(val)
}
```

> Effects are simple JavaScript objects which contain instructions to be fulfilled by the middleware. When a middleware retrieves an Effect yielded by a Saga, the Saga is paused until the Effect is fulfilled.


除了返回异步函数, 还可以返回 saga 自带的一些 effect, 比如 put, call 等等. effect 是 saga 中的封装好的 object, 它可以给 saga 指示, 比如 put 指示 saga 给 store 发一个通知 : `dispatch({ type: 'WHATEVER' })`, call 指示 saga 调用一个函数.

```
put({type: 'INCREMENT'}) // => { PUT: {type: 'INCREMENT'} }
call(delay, 1000)        // => { CALL: {fn: delay, args: [1000]} }
```

> An Effect is simply an object that contains some information to be interpreted by the middleware. 

effect 是包含一些指令信息的数据集, 它可以被 saga 解释执行.


#### Parallel

```javascript
function* rootSaga() {
  yield all([
    helloSaga(),
    watchIncrementAsync(),
  ]);
}
```

```javascript
function* rootSaga() {
  yield takeEvery('FETCH_UESRS', fetchUsers);
  yield takeEvery('CREATE_USER', createUser);
}
```

```javascript
const [users, repos] = yield all([
  call(fetch, '/users'),
  call(fetch, '/repos'),
]);
```

#### Non-blocking

```javascript
function* loginFlow() {
  while (true) {
    const { user, password } = yield take('LOGIN_REQUEST');
    // fork return a Task object
    const task = yield fork(authorize, user, password);
    const action = yield take(['LOGOUT', 'LOGIN_ERROR']);
    if (action.type === 'LOGOUT')
      yield cancel(task);

    yield call(Api.clearItem, 'token');
  }
}
```


```javascript
function* watchStartBackgroudnTask() {
  while (true) {
    yield take('START_BACKGROUND_TASK');
    yield race({
      task: call(backgroundTask),
      cancel: take('CANCEL_TASK'),
    });
  }
}
```

#### take*

takeEvery 和 takeLatest 都是对 take 的封装:

```javascript
const takeEvery = (pattern, saga, ...args) => fork(function* () {
  while (true) {
    const action = yield take(pattern);
    yield fork(saga, ...args.concat(action));
  }
});

const takeLatest = (pattern, saga, ...args) => fork(function* () {
  let lastTask;
  while (true) {
    const action = yield take(pattern);
    if (lastTask) {
      yield cancel(lastTask);
    }
    lastTask = yield fork(saga, ...args.concat(action));
  }
});

```


## Glossary

#### Effect

effect 是包含一些指令信息的数据集, 它可以被 saga 解释执行.

#### Task

> A task is like a process running in background.

task 是后台执行的一条小线程, like a daemon. 可以使用 fork 创建 task. 一般的应用程序会有多个 task 并行执行.

#### Blocking/Non-blocking call

阻塞是会让 saga 暂停, 通常是一个异步操作.
非阻塞不会让 saga 停住, yield 执行完立马执行下一条.

```javascript
yield take(ACTION); // blocking
yield call(ApiFn, ...args);; // blocking

yield put(...) // non-blocking
const task = yield fork(otherSaga, ...args); // non-blocking
yield cancel(task) // non-blocking
```

#### Watcher/Worker

观察者: 监听某一 action 到达后, fork 一条动作执行.
执行者: 被观察者操纵执行.

```javascript
function* watcher() {
  while (true) {
    const action = yield take(ACTION);
    yield fork(worker, action.payload);
  }
}

function* worker(action) {
 // do some staff
}
```

## API

#### Middleware

- createSagaMiddleware
- sagaMiddleware.run

初始化 saga 的入口:

```javascript
import createSagaMiddleware from 'redux-saga';

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware()
  return {
    ...createStore(
      reducer,
      initialState,
      applyMiddleware(/* other middleware, */sagaMiddleware),
    ),
    runSaga: sagaMiddleware.run,
  }
}

// main.js
const store = configureStore()
store.runSaga(rootSaga)
```



#### Helper

- takeEvery
- takeLatest
- throttle

takeEvery 和 takeLatest 在上面已经见识到了.

throttle 和 debounce 是很有趣的工具, throttle 是用做*节流*, 比如请求接口来弹出预选提示, 每次 input 改变就去请求接口会太浪费, 所以加一个节流时间, 保证在这节流时间内只调用一次, 每几秒执行一次. 而 debounce 是用做**防抖**, 一个按钮用户手抖连续点击了多次, 加上 debounce 会让点击事件只取最后一次点击.

```javascript
import { call, put, throttle } from `redux-saga/effects`

function* fetchAutocomplete(action) {
  const autocompleteProposals = yield call(
    Api.fetchAutocomplete,
    action.text
  );
  yield put({
    type: 'FETCHED_AUTOCOMPLETE_PROPOSALS',
    proposals: autocompleteProposals,
  });
}

function* throttleAutocomplete() {
  yield throttle(1000, 'FETCH_AUTOCOMPLETE', fetchAutocomplete)
}
```

#### Effect creators

> - Each function below returns a plain JavaScript object and does not perform any execution.
> - The execution is performed by the middleware during the Iteration process described above.
> - The middleware examines each Effect description and performs the appropriate action.

- take

> Creates an Effect description that instructs the middleware to wait for a specified action on the Store. The Generator is suspended until an action that matches pattern is dispatched.

returns same action


```javascript
take('*') // wait for all actions
take(action => action.entities) // match action having a entities field
take('INCREMENT') // match INCREMENT action
take(['INCREMENT', 'DECREMENT']) // match actions in array
```

- put

> Creates an Effect description that instructs the middleware to dispatch an action to the Store. 


- call

returns a Task object.

> Creates an Effect description that instructs the middleware to call the function `fn` with `args` as arguments.


- fork

> Creates an Effect description that instructs the middleware to perform a non-blocking `call` on `fn`

> `fork`, like `call`, can be used to invoke both normal and Generator functions. But, the calls are non-blocking, the middleware doesn't suspend the Generator while waiting for the result of fn. Instead as soon as fn is invoked, the Generator resumes immediately.


- cancel

> Creates an Effect description that instructs the middleware to cancel previously forked tasks.


- select

> Creates an effect that instructs the middleware to invoke the provided selector on the current Store's state (i.e. returns the result of `selector(getState(), ...args))`.

```javascript
const name = yield select(state => state.user.name);
```


#### Other

- race

> Creates an Effect description that instructs the middleware to run a Race between multiple Effects (this is similar to how Promise.race([...]) behaves).

```javascript
function* fetchUsersSaga {
  const { response, cancel } = yield race({
    response: call(fetchUsers),
    cancel: take(CANCEL_FETCH)
  })
}
```

- all

> Creates an Effect description that instructs the middleware to run multiple Effects in parallel and wait for all of them to complete. It's quite the corresponding API to standard `Promise#all`.

```javascript
function* mySaga() {
  const [customers, products] = yield all([
    call(fetchCustomers),
    call(fetchProducts)
  ])
}

function* mySaga() {
  const { customers, products } = yield all({
    customers: call(fetchCustomers),
    products: call(fetchProducts)
  })
}
```

- delay

> Returns a Promise that will resolve after ms milliseconds with val.

```javascript
const delay = ms => new Promise(resolve => setTimeout(() => resolve(), ms))
```

## Cheatsheets


| Name | Blocking |
| --- | --- |
| takeEvery | No |
| takeLatest | No |
| throttle | No |
| take | Yes |
| put | No |
| call | Yes |
| apply | Yes |
| fork | No |
| cancel | No |
| select | No |
| all |  Yes if there is a blocking effect |


## References

- [official tutorial](https://redux-saga.js.org/)
- [generator and iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)


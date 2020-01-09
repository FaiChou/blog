---
title: "那些年写过的异步函数"
date: "2019-04-11"
category: "dev"
emoji: "🔮"
---

```javascript
function foo(msg) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(msg), 1000)
  })
}
```

上面函数返回 `promise`


可以用 `then` 来获取 `resolve` 值:

```javascript
const f = foo('f')
f.then(r => console.log(r))
```

可以用 es6 中的 `async await` 来替代 `promise`:

```javascript
async function main() {
  const r = await foo('f')
  console.log(r)
}
```

### onFulfilled returns a promise

```javascript
var delayMsg = (ms, msg) => new Promise(r => setTimeout(r, ms, msg))
Promise.resolve(delayMsg(1000, 'hello'))
  .then(r => console.log(r)) // log `hello` after 1s
```

> If `onFulfilled` returns a promise, the return value of `then` will be resolved/rejected by the promise.


### promise then chain

```javascript
foo('ff')
  .then(r=> console.log(r)) // log ff
  .then(r => console.log(r)) // log undefined
  .then(() => 'fff')
  .then(r => console.log(r)) // log fff
  .then(() => new Promise(resolve => setTimeout(() => resolve('ffff'), 1000)))
  .then(r => console.log(r)) // log ffff after 1s
```

> The `then` method returns a `Promise` which allows for method chaining.

> If the function passed as handler to `then` returns a `Promise`, an equivalent `Promise` will be exposed to the subsequent `then` in the method chain.

`then` 的返回值会被下一个 `then` 捕获, 如果没有 `return` 默认 `return undefined`.

如果返回值是个 `Promise`, 下一个 `then` 会捕获 `resolve` 的参数.

在 es6 中:

```javascript
async function bar() {
  const r = await foo('ff')
  console.log('-')
  return r+'~'
}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
async function baz() {
  const r = await bar('gg')
  console.log('--')
  await delay(1000)
  console.log('---')
  return r+'%'
}
async function main() {
  const r = await baz()
  console.log(r)
}
```

### 同步执行 task

```javascript
async function main() {
  const results = await Promise.all(
    [task1, task2, task3].map(
      (task) => task()
    )
  )
  console.log(results)
}
```

### 串行执行 task

```javascript
function taskSerial() {
  [task1, task2, task3].reduce(
    (promise, task) => promise.then(task),
    Promise.resolve()
  )
}
```

### 串行执行并收集结果

```javascript
function taskSerial(tasks) {
  return tasks.reduce(
    (promise, task) => promise.then(
      r1 => task().then(
        r2 => r1.concat(r2) // awesome 😄
      )
    ),
    Promise.resolve([])
  )
}

async function taskSerialInES(tasks) {
  return tasks.reduce(
    async (promise, task) => {
      const r1 = await promise
      const r2 = await task()
      return r1.concat(r2)
    },
    Promise.resolve([])
  )
}
```

测试:

```javascript
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
const task1 = async () => {
    await delay(1000)
    console.log('t1 after delay')
    return 't1'
}
const task2 = async () => {
    await delay(3000)
    console.log('t2 after delay')
    return 't2'
}
const task3 = async () => {
    await delay(100)
    console.log('t3 after delay')
    return 't3'
}
const tasks = [task1, task2, task3]

taskSerial(tasks).then(r => console.log(r))
taskSerialInES(tasks).then(r => console.log(r))
```

### for 代替版的串行执行

```javascript
async function taskSerial(tasks) {
  for(const task of tasks) {
    await task()
  }
}
```

### asyncForEach ployfill

```javascript
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
Array.prototype.asyncForEach = async function(
  asyncTask,
  allDoneCallback,
  dealingCallback,
  failCallback
) {
  try {
    await asyncForEach(
      this,
      async (data, index) => {
        dealingCallback(data, index);
        await asyncTask(data, index, this);
      }
    );
    allDoneCallback();
  } catch (error) {
    failCallback(error);
  }
}
```

### 异步递归

```javascript
// 递归获取文件夹下所有文件及文件夹
// return:
// [
//   {
//     name: 'abc.txt',
//     path: '/var/abc.txt',
//   },
//   {
//     name: 'def.txt',
//     path: '/var/def.txt',
//   },
// ]
const rgetfiles = async (dir, allFiles = []) => {
  const isExist = await RNFS.exists(dir)
  if (!isExist) return allFiles
  const files = (await RNFS.readDir(dir)).map(f => ({
    path: f.path,
    name: f.name,
    // size: bytesToSize(f.size),
  }))
  allFiles.push(...files)
  await Promise.all(files.map(async f => 
    (await RNFS.stat(f.path)).isDirectory() && rgetfiles(f.path, allFiles)
  ))
  return allFiles
}
```

## Catch error

```javascript
Promise.reject()
  .then(
    () => {},
    () => console.error('error occurred') // log
  )
  .catch(() => console.log('nothing')) // not called
```

`reject` 会被第一个 `then` 中捕获, 所以最后的 `catch` 不会执行.

```javascript
Promise.reject()
  .then(() => console.log('1'))
  .then(() => console.log('2'))
  .then(() => console.log('3'))
  .catch(
    ()=>console.log('eee')
  )
```

此时第一个 `promise` `reject`, 被最后的 `catch` 捕获, 所有中间的 `then` 都不会执行.

`async function` 中使用 `try catch` 捕获异常:

```javascript
async function main() {
  try {
    await mayThrowError()
    await alsoMayThrowError()
  } catch (e) {
    console.log(e)
  }
}
```

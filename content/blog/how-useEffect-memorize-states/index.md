---
title: "How useEffect memorize states"
date: "2022-02-24"
category: "dev"
emoji: "🛸"
---

直接上最终的代码:

```javascript
let memorizedCallback;
let lock = false;
function foo(callback) {
  if (!lock) {
    lock = true;
    memorizedCallback = callback;
  }
  memorizedCallback();
}
let memorizedVal = null;
function useX(val) {
  const x = memorizedVal || val;
  memorizedVal = x;
  function setX(v) {
    memorizedVal = v;
  }
  return [x, setX];
}
function bar() {
  const [a, setA] = useX(0);
  let b = 0;
  function setB(val) {
    b = val;
  }
  foo(() => setTimeout(() => { console.log(a); console.log(b); }, 1000));
  return { setB, setA };
}
var { setA, setB } = bar(); 
setA(2);
setB(3);
bar();
// log 0 3 0 3
```

`foo` 的函数参数当第一次被执行, 就会被锁住, 不论以后执行多少次, 也不会变化.

当第一次执行 `bar` 时候, `bar` 函数所创建的环境会被 `foo` 参数闭包捕获, 里面用到的 a 和 b, 是第一次执行生成的 a 和 b.

当执行到 `setA(2) setB(3)` 时候, `memorizedVal` 和 `bar` 环境下的 b 被修改了. 此时 log 会打印 0(a) 和 3(b).

当执行到第二遍 `bar()` 时, 因为 `foo` 里面锁住, 传入的参数可以忽略, 其还是执行第一次的 callback, 所以数据还是取自第一次闭包环境. 第一次闭包环境下 `a=0`, 而 b 已经被下面的 `setB(3)` 修改成 3.

所以会有结果: `0 3 0 3`.

## 例子1

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      console.log(`You clicked ${count} times`);
    }, 3000);
  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

在3秒内, 点击按钮5次, 它会 log: `0 1 2 3 4 5`, 因为 `useEffect` 没有 `deps` 默认 **update** 后重新执行.


## 例子2

```javascript
componentDidUpdate() {
  setTimeout(() => {
    console.log(`You clicked ${this.state.count} times`);
  }, 3000);
}
```

例子1中如果改成 class component 则最终结果是 `0 5 5 5 5 5`.

## 例子3

```javascript
function Example() {
  const [count, setCount] = useState(0);
  const latestCount = useRef(count);
  latestCount.current = count;
  useEffect(() => {
    setTimeout(() => {
      // Read the mutable latest value
      console.log(`You clicked ${latestCount.current} times`);
    }, 3000);
  });
  // ...
}
```

这里会 log: `0 5 5 5 5 5`.

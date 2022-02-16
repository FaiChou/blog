---
title: "useState & useEffect"
date: "2022-02-14"
category: "dev"
emoji: "🎁"
---

发现了一个对 `React + useState + useHooks` 的[简单实现](https://medium.com/swlh/learn-by-implementing-reacts-usestate-and-useeffect-a-simplified-overview-ea8126705a88):

```javascript
let React = (function() {
  let global = {}; // define a global variable where we store information about the component
  let index = 0; // index to keep track of the component's state
  function render(Component) {
    global.Component = Component;
    const instance = Component(); // get the instance of the component
    index = 0;
    instance.render();  // call the component's render function
    global.instance = instance; // store the component's instance for any future calls of the component's functions
    return global; // return the global variable
  }
  function useState(initialState) {
    if (!global) {
      throw new Error("Need a global");
    }
    if (!global.hooks) {
      global.hooks = []; // this array holds the state of the component
    }
    const hooks = global.hooks;
    const currentState = global.hooks[index] || initialState; 
    hooks[index] = currentState;    // memoize the state for future access
    firstrender = true;
    const setState = (function() {
      let currentIndex = index; // copy the index so each useState call will have it's own "closed" value over index (currentIndex)
      return function(value) {
        global.hooks[currentIndex] = value;
        render(global.Component);   //re-render the component after state change
      };
    })();
    index = index + 1;
    return [currentState, setState];
  }
  function useEffect(cb, deps) {
    const hooks = global.hooks; 
    // getting older dependencies from the hooks array since 
    // we are storing dependencies as a sub-array inside the hooks array
    let oldDeps = hooks[index];
    // if no dependencies are provided, 
    // the callback function will be called at each re-render
    let hasChanged = true;    
    if (oldDeps) {
      // checking if the old dependencies are different from older dependencies
      hasChanged = deps.some((d, index) => !Object.is(d, oldDeps[index]));
    }
    if (hasChanged) cb();   // if dependencies has changed call the callback function.
    hooks[index] = deps;    //store dependencies inside the hooks array as a sub-array
    index++;    // increment index for any other useEffect calls
  } 
  return { render, useState, useEffect };
})();

function Component() {
  // Component is called at each re-render. index is reset to 0.
  const [count, setCount] = React.useState(0);
  const [word, setWord] = React.useState("");
  const countSetter = () => { setCount(count + 1) };
  const wordSetter = word => { setWord(word); };
  function render() {
    console.log(`Count is: ${count}, Word is: ${word}`);
  }
  React.useEffect(() => {
    console.log("hookssss!!!!");
  }, [count, word]);
  React.useEffect(() => {
    console.log("hooks2!!!!!");
  }, []);
  return { render, countSetter, wordSetter };
}

const global = React.render(Component);
global.instance.countSetter();
global.instance.countSetter();
global.instance.countSetter();
global.instance.wordSetter("yooo");
global.instance.wordSetter("ssup");
```

首先使用 IIFE 来持有两个变量 `global` 和 `index`; 还有三个方法 `render`, `useState` 和 `useEffect`.

`index` 的作用是记录当前的 hooks 数组下标. 当使用 `useState` 或者 `useEffect` 时候进行移位.

在 `render` 方法中, 需要将 `index` 重置为 0, 不管是第一次 **render** 还是状态变化导致的 **rerender**.

`useState` 里面初始化了 `hooks` 数组, 当第一次 **render**, 会将初始的 `state` 存放到 `hooks` 数组内, 然后 `index++`. 如果是 **rerender**, 则取出 `hooks` 内的数据(缓存).

有趣的是 `setState` 方法, 它使用 IIFE 来记录了当前 `state` 所在 `hooks` 的下标 `index`, 然后是对 `hooks` 之前的旧变量进行覆盖, 最后再调用 `render` 方法进行 **rerender**.

`useEffect` 也是比较有趣, 它也是利用的 `hooks` 数组, 当第一次调用, 也就是第一次 **render** 时候, `hooks` 当前 `index` 数据为空, 所以第一次 **render** 必定会执行回调函数. 然后将 `deps` 存入到 `hooks[index]`, 这样不管是哪次 *render* 都是记录了上一次的数据. 当 `deps` 是个空数组时, `if` 内的 `some` 永远是 `false`, 所以就达成了: 空数组代表着 `componentDidMount`. 当*非*首次 **render**时, 要进行判断:

```javascript
hasChanged = deps.some((d, index) => !Object.is(d, oldDeps[index]))
```

传入的 `deps` 的每个元素, 是否在 `oldDeps` 下有变化, 如果有变化, 则需要执行回调.

`useEffect` 使用了 `hooks` 而且可以多次调用 `useEffect` 所以到最后也需要将 `index++`.

这样, 不管是第一次 **render** 还是第 n 次 **render**, 都是顺序使用的 `index`, `hooks` 都不会乱, 正式因为这个原因:

> Don’t call Hooks inside loops, conditions, or nested functions.

## 这个实现的不足点

1. 只能 **render** 一个 *Component*, 因为此实现里的 *React* 只有一个 `global` 和 `index`, 如果存在多个 `Component`, 则共用同一份数据, 则会出错.
2. `deps.some((d, index) => !Object.is(d, oldDeps[index]))` 这样写, 逻辑比较混乱.
3. *BUG*: 当 *Component* 不使用 `useState` 而使用 `useEffect`, 或者 `useEffect` 在 `useState` 前使用, 则 `hooks` 不会被初始化而报错. 


## 自己实现了一个简易的 `useState`

```javascript
let state = [];
let index = 0;
let global = {};
function createSetter(index) {
  return function(newVal) {
    state[index] = newVal;
    // TODO: re-render
  };
}
function useState(initVal) {
  const value = state[index] || initVal;
  state[index] = value;
  const setter = createSetter(index);
  index++;
  return [value, setter];
}
function Component1() {
  const [firstName, setFirstName] = useState("Fai");
  const [lastName, setLastName] = useState("Chou");
  console.log(firstName);
  console.log(lastName);
  return {
    setFirstName,
    setLastName,
  }
}
function render(Component) {
  var componentSetters = Component();
  console.log(componentSetters)
  for (const [key, value] of Object.entries(componentSetters)) {
    global[key] = value;
  }
}
function APP() {
  index = 0; // reset
  render(Component1);
}

console.log(state); // []
APP();
console.log(state); // First-render: ['Fai', 'Chou']
APP();
console.log(state); // Subsequent-render: ['Fai', 'Chou']
global.setFirstName('Hui');
console.log(state); // After: ['Hui', 'Chou']

```

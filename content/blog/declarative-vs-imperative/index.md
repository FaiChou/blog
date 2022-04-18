---
title: "Declarative vs Imperative"
date: "2022-04-17"
category: "dev"
emoji: "🙈"
---

在看文档时候发现有一句: `LottieView can be used in a declarative way`, 这里的 `declarative` 不明确是什么意思, 虽然通过查字典能够知道是*直观的*意思, 但还是不懂在 CS 领域它代表着什么.

于是我进行了一些查阅, 说一下自己的理解, talk is cheap, just show the code:

```javascript
function foo() {
  const array = [1,2,3,4,5,6,7,8,9];
  const result = []
  for (const i of array) {
    if (i%2 === 0) {
      result.push(i);
    }
  }
  console.log(result)
}
foo()
```

上面的代码是取数组里面的偶数, 这种表达给没有开发经验的人来说, 是看不懂的. 所以替换成下面这种:

```javascript
function foo() {
  const array = [1,2,3,4,5,6,7,8,9];
  const result = array.filter(i => i%2 === 0);
  console.log(result)
}
foo()
```

这样就明显多了, **数组**, **过滤**, **条件**, **结果**, 无开发经验的人也能看懂.

因此可以得出, 直观明显的就是 `declarative`, 而第一种代码方式是拐弯抹角的 `imperative`.

所以可以说函数式编程(FF)是比较直观的, FF is declarative. 而 OO 可以代表比较复杂且难以理解的 `imperative`.

综上所述, `LottieView can be used in a declarative way` 这句话可以这么理解: **LottieView 使用起来很方便**. 并不需要表达它 *直观的* 这层意思.


ps. 遇到难以理解的词汇, 直接搜索查看翻译也是很难理解的. 不如换一个方式: 搜图! 我们从生下来不会说话不懂任何事情, 是先靠眼睛来学习这个世界的, 毕竟眼睛是感官里最重要的部件. 用图来理解, 这本身也是一个 `declarative way`, 而阅读大量故事和讲解来理解一个词汇, 这就挺 `imperative` 的.


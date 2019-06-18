---
layout: post
title: "构造与原型"
date: "2019-06-17"
category: "dev"
emoji: "🐣"
---

## 构造

构造是在 js 中创建物件(object)的过程, 使用 `new` 关键字来定义, 构造过程:

1. 创建一个空的 js 物件
2. 建立此物件与另一物件的关系(设置 constructor)
3. 设置此物件 `this` 关键字
4. 如果构造方法没有 `return`, 那么返回 `this`

## 原型

原型是 js 物件继承的机制, 一个物件被创造出来, 一定是具有其「原型」, 比如说二哈被构造出来, 那么它就具有狗的特性.

```
二哈 => 狗 => 生物 => null
```

原型分为显示原型(explicit prototype property)与隐式原型(implicit prototype link).

每个函数在创建之后都有一个 `prototype` 属性, 其值就是此函数的原型.
每个对象都有一个内置的 `[[prototype]]` 属性, 大多浏览器都支持使用 `__proto__` 来访问, 当然也可以使用 `Object.getPrototypeOf()` 来访问.

## 构造与原型关系

以二哈为例, 二哈是一个**实例**, 狗是一个**构造器**, 需要通过 `new` 关键字加 `Dog` 这个构造器才能构造出二哈.

二哈长什么样/有什么功能等都是与狗的**原型**密切相关.

```javascript
function Dog(name, age) {
  this.age = age
  this.name = name
}

var ha = new Dog('ErHa', 1)

> ha
Dog {name: "ErHa", age: 1}
```

构造器:

```javascript
> ha.constructor
ƒ Dog(name, age) {
  this.age = age
  this.name = name
}
> Dog.constructor
ƒ Function() { [native code] }
```

可以看到二哈(ha)的构造器是狗(Dog), 狗的构造器是 `Function`.


原型:

```javascript
> ha.prototype
undefined
> Dog.prototype
{constructor: ƒ}

> ha.__proto__
{constructor: ƒ}
> Dog.__proto__
ƒ () { [native code] }
```

二哈是个实例, 只有隐式原型, 而狗既有显示原型又有隐式原型, 因为它是个构造器, 又是被实例出来的.
可以看出:

```javascript
ha.__proto__ === Dog.prototype
Object.getPrototypeOf(ha) === Dog.prototype // (same above)
```

js 是门动态语言, 所以可以随意给实例/构造器添加属性:

```javascript
> ha.foo = 'foo'
> Dog.prototype.bar = 'bar'
> ha.foo
"foo"
> ha.bar
"bar"
```

```javascript
> ha instanceof Dog
true
> ha instanceof Object
true

> ha.__proto__ === Object.prototype
false
> ha.__proto__ === C.prototype
true

> ha.constructor.name
"Dog"
```

## 关于 class

class 是 ES6 中基于 js 原型继承链的语法糖, 以上狗的 class 表示如下:

```javascript
class Dog {
  constructor(name, age) {
    this.age = age
    this.name = name
  }
}

> Dog.constructor
ƒ Function() { [native code] }
```

## 普通类型

```javascript
> var a = 'a'; var b = 2; var c = true;
> a.constructor
ƒ String() { [native code] }
> b.constructor
ƒ Number() { [native code] }
> c.constructor
ƒ Boolean() { [native code] }
> a.__proto__
String {"", constructor: ƒ, anchor: ƒ, big: ƒ, blink: ƒ, …}
> b.__proto__
Number {0, constructor: ƒ, toExponential: ƒ, toFixed: ƒ, toPrecision: ƒ, …}
> c.__proto__
Boolean {false, constructor: ƒ, toString: ƒ, valueOf: ƒ}
```

## 小问题

```javascript
Function.prototype.a = 'a'
Object.prototype.b = 'b'
function Person() {}
var p = new Person()
console.log(p.a) // undefined
console.log(p.b) // b
```

有位群友问:

> 继承关系不应该是 p - Person - Function - Object 吗，应该都可以打印出来，为什么中间没有 fucntion 了呢
> Person.__proto__===Function.prototype

他错在 `p` 继承与 `Person`, 应该是继承与 `Person.prototype`, 而 `Person.prototype` 继承与 `Object.prototype`.

> Function 是其他声明函数的构造函数，__proto__ 隐式原型指向其构造函数的显式原型

---
title: "Immutable"
date: "2017-09-05"
category: "dev"
emoji: "🦆"
---


```javascript
import { List, Map } from 'immutable';

let arr = [1, [2], {a: 3}];
fromJS(arr);
let obj = {a:1, b:2};
fromJS(obj);
```



### List

```javascript
const list = List([1, 2, 3]);

List.of(1, 2, [3], 4);
```



##### 增

```javascript
/**set*/
const originalList = List([ 0 ]);
// List [ 0 ]
originalList.set(1, 1);
// List [ 0, 1 ]
originalList.set(0, 'overwritten');
// List [ "overwritten" ]
originalList.set(2, 2);
// List [ 0, undefined, 2 ]

/**insert*/
List([ 0, 1, 2, 3, 4 ]).insert(10000, 5)
// List [ 0, 1, 2, 3, 4, 5 ] (if 10000>length insert to last)
List([ 0, 1, 2, 3, 4 ]).insert(2, 5)
// List [ 0, 1, 5, 2, 3, 4 ]

/**push*/
List([ 1, 2, 3, 4 ]).push(5)
// List [ 1, 2, 3, 4, 5 ]
List([ 1, 2, 3, 4 ]).push(5, 6, 7)
// List [ 1, 2, 3, 4, 5, 6, 7 ]


/**unshift*/
List([ 2, 3, 4]).unshift(1);
// List [ 1, 2, 3, 4 ]

```



##### 删

```javascript
List([ 0, 1, 2, 3, 4 ]).delete(0);
// List [ 1, 2, 3, 4 ]

List([ 1, 2, 3, 4 ]).clear()
// List []

List([ 1, 2, 3, 4 ]).pop()
// List[ 1, 2, 3 ]

List([ 0, 1, 2, 3, 4 ]).shift();
// List [ 1, 2, 3, 4 ]

```



##### 改

```javascript
const list = List([ 'a', 'b', 'c' ])
const result = list.update(2, val => val.toUpperCase())
// List [ "a", "b", "C" ]


```



##### 查

```javascript
get<NSV>(index: number, notSetValue: NSV): T | NSV
get(index: number): T | undefined
```





### Map

```javascript
const { Map } = require('immutable')
Map({ key: "value" })


let obj = { 1: "one", b: 2 }
Object.keys(obj) // [ "1" ]
obj["1"] // "one"
obj[1]   // "one"
obj.1 // error!!
obj.b // 2
let map = Map(obj)
map.get("1") // "one"
map.get(1)   // undefined


let obj = {a: [1, 2, 3]}
let imObj1 = Immutable.Map(obj) // Map can't init deep persistent immutablejs.
let imObj2 = Immutable.fromJS(obj) // use fromJS()
imObj1.get('a') // it's a js array
imObj2.get('a') // it's an immutable List
```



##### 增

```javascript
const { Map } = require('immutable')
const originalMap = Map()
const newerMap = originalMap.set('key', 'value')
const newestMap = newerMap.set('key', 'newer value')
originalMap
// Map {}
newerMap
// Map { "key": "value" }
newestMap
// Map { "key": "newer value" }

const one = Map({ a: 10, b: 20, c: 30 })
const two = Map({ b: 40, a: 50, d: 60 })
one.merge(two) // Map { "a": 50, "b": 40, "c": 30, "d": 60 }
two.merge(one) // Map { "b": 20, "a": 10, "d": 60, "c": 30 }

const one = Map({ a: 10, b: 20, c: 30 })
const two = Map({ b: 40, a: 50, d: 60 })
one.mergeWith((oldVal, newVal) => oldVal / newVal, two)
// { "a": 0.2, "b": 0.5, "c": 30, "d": 60 }
two.mergeWith((oldVal, newVal) => oldVal / newVal, one)
// { "b": 2, "a": 5, "d": 60, "c": 30 }

const one = Map({ a: Map({ x: 10, y: 10 }), b: Map({ x: 20, y: 50 }) })
const two = Map({ a: Map({ x: 2 }), b: Map({ y: 5 }), c: Map({ z: 3 }) })
one.mergeDeep(two)
// Map {
//   "a": Map { "x": 2, "y": 10 },
//   "b": Map { "x": 20, "y": 5 },
//   "c": Map { "z": 3 }
// }
```



##### 删

```javascript
const originalMap = Map({
  key: 'value',
  otherKey: 'other value'
})
// Map { "key": "value", "otherKey": "other value" }
originalMap.delete('otherKey')
// Map { "key": "value" }

Map({ key: 'value' }).clear()
// Map {}
```



##### 改

```javascript
const aMap = Map({ key: 'value' })
const newMap = aMap.update('key', value => value + value)
// Map { "key": "valuevalue" }

const aMap = Map({ nestedList: List([ 1, 2, 3 ]) })
const newMap = aMap.update('nestedList', list => list.push(4))
// Map { "nestedList": List [ 1, 2, 3, 4 ] }

const aMap = Map({ key: 'value' })
const newMap = aMap.update('noKey', 'no value', value => value + value)
// Map { "key": "value", "noKey": "no valueno value" }


```



##### 查

```javascript
get<NSV>(key: K, notSetValue: NSV): V | NSV
get(key: K): V | undefined
```



##### Deep persistent changes

```javascript
setIn()
deleteIn()
updateIn()
mergeIn()
mergeDeepIn()
```



##### 高阶函数

```javascript
concat()
map()
flatMap()
filter()
reduce()
```



##### 转为js

```javascript
toJS()
toJSON()
toArray()
toObject()
```



##### 遍历

```javascript
forEach(
  sideEffect: (value: V, key: K, iter: this) => any,
  context?: any
): number
```


---
title: "Swift Tips"
date: "2017-07-03"
category: "dev"
emoji: "⛑"
---

### 1.  "Implicitly Unwrapped" Optional

在许多类或者结构体中，有些属性的值随着实例化即可确定下来不为空，那么这种情况下再做判断或者解析就显得繁冗且低效，做了好多不必要的工作，就像下面这个例子。

```swift
class User {
  var id: String?
  var name: String?
  var age: Int?
  init() {
    id = "defaultId"
  }
  func login() {
    self.id = "abcdefg"
    self.name = "Bob"
    self.age = 13
  }
}
let Bob = User()
Bob.login()
if Bob.id != nil {
  print("id: \(Bob.id!)")
}

```

在上述例子中，就像用户的id号，每次新注册一个用户或者登陆一个用户，他的id肯定是存在的，如果这时候再判断id是否为nil，显然是不必要的。这时候就需要将属性类型后面的`?`改为`!`。

其实无论类型是用`!`还是用`?`声明的，类型都是作为Optional的存在，但是`!`被称作隐式解析可选类型，意味着你想获取其值不必解析，可以直接拿来用，但是呢，也不代表它不为nil。


### 2. collection使用字面量进行初始化

```swift
var arr: [String] = []
var dic: [String: Int] = []
var set: Set<String> = []
```


### 3. url中汉字encode

```swift
let urlStr = "http://faichou.com?name=周辉"
let urlStrEncode = urlStr.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)
print(urlStrEncode) // http://faichou.com?name=%E5%91...
```


### 4.  #line #file #function

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1499091752944.png" width="500"/>

`#line` `#function` `#file` 在Swift中相当于Objective-C中的`__LINE__` `__FUNCTION__` `__FILE__`。


### 5. guard let 和 if let 

```swift
func foo() {
  let someStr: String = ""
  guard let str = someStr, str != "" else {
    return 
  }
  print("str is not empty!")
}
func bar() {
  if let url = URL(string: urlString), url.pathExtension == "png",
     let data = try? Data(contentsOf: url),
     let image = UIImage(data: data) {
       let view = UIImageView(image: image)
       // ..
  }
}
```


### 6. 高阶函数

```swift
let arr = [1, 3, 2, 4]			// 求
let res = arr.filter { $0%2 == 0 } 	// 数组中偶数的
	.map { $0*$0 } 	   		// 平方
	.reduce { 0, + }	   	// 和

```


### 7. singleton

```swift
class Singleton {
  static let sharedInstance = Singleton()
  private init() {}
}
```


### 8. 闭包中使用self

```swift
User.autologin(phone, password) {
  [weak self] (status) in
  guard let strongSelf = self else { return }
  DispatchQueue.main.async {
    if status == true {
      strongSelf.pushTo(.home)
    } else {
      strongSelf.pushTo(.login)
    }
  }
}
```


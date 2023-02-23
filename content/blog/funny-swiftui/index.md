---
title: "Funny SwiftUI"
date: "2023-02-23"
category: "dev"
emoji: "🤣"
---

开发 SwiftUI 应用有一段时间了, 感觉完全没有像 js 那样的动态语言灵活, Swift 写起来感觉是在推车, 而 js 写起来是在开车. 写的时候不是在抱怨 Swift 难用就是在抱怨 Xcode 垃圾!

所以从现在开始收集一下遇到的坑. 可能是因为自己还是太菜, 希望之后回过头来看这篇文章能打脸现在的我.

## 例子1

```swift
struct ContentView: View {
  var body: some View {
    NavigationStack {
      NavigationLink {
        ChildView()
      } label {
        Text("GO Child")
      }
    }
  }
}
struct ChildView: View {
  var body: some View {
    Text("I am ChildView")
  }
}
```

上面代码看起来没问题, 但是我要告诉你, 在页面还没进子页面之前, `ChildView` 就已经执行过了, 你觉得震惊不? 不信你可以在 `ChildView` 添加 `init` 方法打一下 log 看看.

这就是 SwiftUI 的优势, 完全数据驱动, 页面刚开始时候所有层级都已经展开了, 当 push 新页面时候, 新页面的 body 会被执行, 相应的在 `onAppear` 时候请求网络数据等, 使用 `@State` 将数据绑定页面, 数据变化会导致页面变化.

但是将上面代码增加一个方法:

```swift
extension ChildView: Equatable {
  static func ==(lhs: ChildView, rhs: ChildView) -> Bool {
    return true
  }
}
```

这样即使父组件再怎么更新, 也不会刷新 `ChildView`, 比如如果想传一个可以变化的数据到 `ChildView`, 即使在父组件中数值发生了变化, 但是进入子页面, 还是一开始的数据.


## 例子2

这个例子比较难懂, 开发了这么久, 我仍然没有完全搞明白类型协议和 Opaque Type.

```swift
protocol MobileOS {
    associatedtype Version
    var version: Version { get }
    init(version: Version)
}
struct iOS: MobileOS {
    var version: Float
}
struct Android: MobileOS {
    var version: String
}
```

这是一个协议, 并且 `iOS` 和 `Android` 都继承这个协议, 于是写一个这样的方法:

```swift
func buildOS() -> MobileOS {
  return iOS(version: 16.1)
}
```

这个代码会报错, 为什么呢? 因为 `MobileOS` 是有 `associatedtype` 的, Swift 编译器无法推断出函数里的 `associatedtype`.

我就奇了怪了, 为什么它能推断出来结构体 iOS 的 `associatedtype` 却无法推断出这个函数的呢? 所以应该怎么改呢?

```swift
func buildOS<T: MobileOS>(version: T.Version) -> T {
  return T(version: version)
}
let o1: Android = buildOS(version: "XiaoMi")
let o2: iOS = buildOS(version: 16.1)
```

哎, 贼麻烦, 有没有简单点的呢? 有, 可以用 Opaque Type:

```swift
func buildOS() -> some MobileOS {
  return iOS(version: 16.1)
}
```

好的, 那来吧:

```swift
func buildOS() -> some MobileOS {
   let isEven = Int.random(in: 0...10) % 2 == 0
   return isEven ? iOS(version: 16.1) : Android(version: "Pie")
}
// Compiler ERROR 😭
// Cannot convert return expression of type 'iOS' to return type 'some MobileOS'
```

哎, 又不行了, 编译器又报错. 这个我始终无法理解. 但是这么写就可以:

```swift
func buildOS() -> some MobileOS {
   let isEven = Int.random(in: 0...10) % 2 == 0
   return isEven ? iOS(version: 16.1) : iOS(version: 16.2)
}
```

总结下这奇葩的逻辑, 函数返回一个 protocol 是可以的, 但是如果 protocol 里面有 `associatedtype` 是不行的, 编译器不会推断;
如果添加上 `some` 又可以了, 因为这个 `some` 让编译器不管了, 只要返回值遵守协议即可; 但是如果用 `if else` 逻辑返回不同类型但遵守协议的又不行了, 但用 `if else` 返回多个相同类型的它又行了..


上面是理论的东西, 结合 SwiftUI 来看下:

```swift
struct FolderInfoView: View {
  @Binding var folder: Folder
  var isEditable: Bool
  var body: some View {
    HStack {
      Image(systemName: "folder")
      textView
    }
  }
  private var textView: some View {
    // Error: Function declares an opaque return type, but
    // the return statements in its body do not have matching
    // underlying types.
    if isEditable {
      return TextField("Name", text: $folder.name)
    } else {
      return Text(folder.name)
    }
  }
}
```

这个代码会报错和上面理论中的一样问题, 用 `if else` 返回不同的类型, 虽然它都遵守 View 协议.

但这段 `if else` 逻辑直接拿到 body 里面, 它又行了...??? 或者将 textView 添加一个 `@ViewBuilder`.

总的来说, 编译器能够推断出函数的返回值的类型和计算属性的类型, 但如果被一个 `if else` 逻辑返回了不同的类型, 是不可以的.


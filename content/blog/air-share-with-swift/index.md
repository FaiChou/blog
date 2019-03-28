---
title: "airshare-with-swift"
date: "2017-12-11"
category: "Dev"
description: "swift shell"
emoji: "👨🏼‍💻"
---

## 前言

由于苹果的玄学，我的handoff功能失效了。而我经常有这样的需求：手机打开电脑的当前网页。
Handoff功能失效前的操作步骤是：复制链接(chrome)，手机上打开Safari打开链接。失效后我只能通过第三方软件发送链接到手机，复制链接，再粘贴链接到Safari。
幸好发现了[这个](https://github.com/JustinFincher/WebDrop)软件，让我节省不少工作时间，但是算下来并没节省多少，这需要让我打开这个软件，点击软件上的按钮才能用airdrop。
于是就开发了自己的[commandline](https://github.com/FaiChou/AirShare)。

## 食用方法

```
Usage:
AirShare -c
	 Share chrome current tab url
AirShare -s
	 Share safari current tab url
AirShare -h
	 Show usage information
Type AirShare without an option to share chrome current tab URL.
```

## Step0 项目过程

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1512962233525.png" width="700"/>

编写的Swift程序可以无缝调用AppleScript，通过AppleScript可以获取chrome/safari浏览器当前页面链接，再将链接返回给程序，继续调用苹果的ShareService，可以分享到推特/微博/mail/airdrop。


## Step1 初始化项目

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1512961428075.png" width="700"/>

注意这里新建的项目是CommandLineTool。
CommandLineTool入口文件是`main.swift`，传统macOS/iOS项目都会用`@NSApplicationMain/@UIApplicationMain`来简化入口文件，CLT会顺序执行`main.swift`中代码，如果不手动添加application，程序将会在main最后一行执行完毕后退出，那么我们如何执行异步操作呢？比如项目里异步调用`ShareService`服务？下文再述。

## Step2 格式化输出

cmd虽然没有UI花哨的界面，但单调的输出也是比较乏味的。多亏[喵神的RainBow](https://github.com/onevcat/Rainbow)，可以对console加点颜色。

```
// ConsoleIO.swift
enum OutputType {
  case error
  case standard
}

class ConsoleIO {
  func writeMessage(_ message: String, to: OutputType = .standard) {
    switch to {
    case .standard:
      print("\(message)")
    case .error:
      print("\(message)\n".red.bold)
    }
  }
  func printUsage() {
    let executableName = (CommandLine.arguments[0] as NSString).lastPathComponent
    writeMessage("Usage:")
   // ..
  }
}
```
这里将程序的标准输出进行了分类：
1. 标准输出
2. 错误输出

错误输出红色粗体。
其他输出默认颜色。
`printUsage`函数是CLI的食用方法打印。

## Step3 关键代码

```
  func getUrl(with cmd: String) {
    var error: NSDictionary?
    guard let scriptObject = NSAppleScript(source: cmd)  else {
      consoleIO.writeMessage("Cannot attach to browser.", to: .error)
      exit(1)
    }
    let output = scriptObject.executeAndReturnError(&error)
    if error != nil {
      consoleIO.writeMessage("\(String(describing: error))", to: .error)
      exit(1)
    }
    guard let urlString = output.stringValue, let url = URL(string: urlString) else {
      consoleIO.writeMessage("Cannot resolve correct URL.", to: .error)
      exit(1)
    }
    share(url)
  }
  func share(_ url: URL) {
    let service = NSSharingService(named: .sendViaAirDrop)!
    let items: [URL] = [url]
    if service.canPerform(withItems: items) {
      service.delegate = self
      service.perform(withItems: items)
    } else {
      consoleIO.writeMessage("Cannot perform", to: .error)
      exit(1)
    }
  }
```

`getUrl`方法通过执行AppleScript来获取浏览器当前页面链接，具体的script如下：

```
let CHROME_SCRIPT = "tell application \"Google Chrome\" to get URL of active tab of front window as string"

let SAFARI_SCRIPT = "tell application \"Safari\" to return URL of front document as string"
```

`share`方法将传入的url通过调用系统Service分享到airdrop。

## Step4 解决异步

step1提到了如何异步操作时候，程序不退出。有两种方法。
1. 使用while循环，获取用户输入`FileHandle.standardInput`
2. 手动添加NSApplication

本程序采用的是第二种方法，因为使用第一种方法会报`fault] 0 is not a valid connection ID.`这个莫名的错误，导致不能成功调出airdrop。


```
// main.swift

import cocoa
let air = AirShare()
air.run()

let app = NSApplication.shared
app.delegate = air
app.run()
```
这里会生成一个app在后台跑着。

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1512970804400.png" width="700"/>

传统的iOS/macOS，只要run程序，就会调出来一个模拟器/有无窗体的window，如何禁止调出来而在后台跑呢？
可以在.plist中添加一个：

```
Application is agent (UIElement): YES
```

[mattt大神的terminal-share](https://github.com/mattt/terminal-share)就是这样做的。

## Step5 调试与发布

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1512971130674.png" width="600"/>

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1512971168888.png" width="700"/>

点击了run，其实就是执行了`./path/program`这样一个命令，可以通过图一图二添加其他运行参数，这样就是执行了`./path/program -c`。

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1512971358060.png" width="600"/>

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1512971471591.png" width="700"/>


也可以在finder中找到程序本身，cd到目录下运行之。

确保程序完备后，可以添加此CLI到系统:

```
$ cp AirShare /usr/local/bin
```

这样在任何目录下都可以识别`AirShare`这个命令了。

## Step6 @TODO

每次执行程序都会遇到这样的警告，这貌似是系统的bug，网上也没有解决方法，并且每次使用此命令调用系统的airdrop，airdrop窗口总是会在所有窗口最下面。应该是这个系统bug造成的。

```
2017-12-11 13:37:24.187 AirShare[1106:17796] warning: illegal subclass SHKRemoteView instantiating; client should use only NSRemoteView (
	0   ViewBridge                          0x00007fff5f063bff -[NSRemoteView _preSuperInit] + 195
	1   ViewBridge                          0x00007fff5f063f83 -[NSRemoteView initWithFrame:] + 25
	2   ShareKit                            0x00007fff5b448aa5 -[SHKRemoteView initWithOptionsDictionary:] + 161
	3   ShareKit                            0x00007fff5b427fbd __38-[SHKSharingService performWithItems:]_block_invoke_4 + 1347
	4   libdispatch.dylib                   0x00007fff622e1591 _dispatch_call_block_and_release + 12
	5   libdispatch.dylib                   0x00007fff622d9d50 _dispatch_client_callout + 8
	6   libdispatch.dylib                   0x00007fff622e532d _dispatch_main_queue_callback_4CF + 1148
	7   CoreFoundation                      0x00007fff3aafd7a9 __CFRUNLOOP_IS_SERVICING_THE_MAIN_DISPATCH_QUEUE__ + 9
	8   CoreFoundation                      0x00007fff3aabf9ca __CFRunLoopRun + 2586
	9   CoreFoundation                      0x00007fff3aabed23 CFRunLoopRunSpecific + 483
	10  HIToolbox                           0x00007fff39dd6e26 RunCurrentEventLoopInMode + 286
	11  HIToolbox                           0x00007fff39dd6b96 ReceiveNextEventCommon + 613
	12  HIToolbox                           0x00007fff39dd6914 _BlockUntilNextEventMatchingListInModeWithFilter + 64
	13  AppKit                              0x00007fff380a1f5f _DPSNextEvent + 2085
	14  AppKit                              0x00007fff38837b4c -[NSApplication(NSEvent) _nextEventMatchingEventMask:untilDate:inMode:dequeue:] + 3044
	15  AppKit                              0x00007fff38096d6d -[NSApplication run] + 764
	16  AirShare                            0x000000010ae32d76 main + 246
	17  libdyld.dylib                       0x00007fff62313115 start + 1
	18  ???                                 0x0000000000000001 0x0 + 1
)
```

将错误输出到错误日志:

```
$ AirShare -c 2>air_share_error.log 
```


## 参考
1. [Swift Command Line Tutorial](https://www.raywenderlich.com/163134/command-line-programs-macos-tutorial-2)
2. [Mattt大神的terminal-share](https://github.com/mattt/terminal-share)
3. [开源的WebDrop](https://github.com/JustinFincher/WebDrop)
4. [ApplicationMain](http://swifter.tips/uiapplicationmain/)
5. [ApplicationMain2](http://swift.gg/2016/05/04/swift-qa-2016-05-04/)
6. [Application is agent](https://en.atjason.com/Cocoa/Status%20Bar%20App.html)
7. [ApplicationMain3](https://richardallen.me/2015/05/16/main-swift.html)



---
title: "升级RN的代价"
date: "2018-05-19"
category: "dev"
emoji: "🦋"
---

## ReactNative项目的version变化过程

从0.50.1升级到0.52.3

```
-		"react": "16.0.0",
-		"react-native": "0.50.1",
+		"react": "16.2.0",
+		"react-native": "0.52.3",
```

又从0.52.3降回到0.50.1

```
-		"react": "16.2.0",
-		"react-native": "0.52.3",
+		"react": "16.0.0",
+		"react-native": "0.50.1",
```

## 期间发生了什么?

RN一直没有稳定的版本, 在0.50.1版本遇到了好多问题, 只好期待能够在0.52.3上有所改进, 所以进行了一系列的升级. 结果升级之后, 遇到各种问题.

项目是iOS/安卓原生+RN的结构, iOS项目使用CocoaPods管理依赖包, 但是由于建项目初期没采用CocoaPods, 导致很多RN的依赖直接采用编译`.xcodeproj`方式进行, 索性就将这些Libraries统一放到了Pod里来管理. 于是就发生了一系列不可描述的问题以及相应的方案:

#### 1. 'boost/iterator/iterator_adaptor.hpp' file not found’

https://blog.csdn.net/qianzhihe1992110/article/details/76686031


#### 2. 'folly/dynamic.h' file not found after pod install 

https://github.com/facebook/react-native/issues/18924

以上两个错误是react的依赖boost和folly没有安装上, 之前根据[论坛里的这个帖子](http://bbs.reactnative.cn/topic/4301/ios-rn-0-45%E4%BB%A5%E4%B8%8A%E7%89%88%E6%9C%AC%E6%89%80%E9%9C%80%E7%9A%84%E7%AC%AC%E4%B8%89%E6%96%B9%E7%BC%96%E8%AF%91%E5%BA%93-boost%E7%AD%89)使用下载好的这几个库, 放到`~/.rncache`里还是不行, 删掉重来几次就好了, 这几个库即使让terminal代理http/https还是很困难才能下载下来.

#### 3. 'React/RCTDefines.h' file not found

https://github.com/facebook/react-native/issues/12265


#### 4. Argument list too long: recursive header expansion failed at Project/node_modules/react-native-fabric/ios/../../../ios/Pods/boost/boost/bimap/container_adaptor.

https://github.com/invertase/react-native-firebase/issues/294

## 爬过这些坑给我带来了什么?

1. Project和Target理解
2. 静态库的链接
3. Pod管理项目的方式


#### Project和Target的理解

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1526702069356.png" width="615"/>

新建一个iOS项目, 都会给你创建一个`.xcodeproj`文件, 这个就是PROJECT, 它是文件/资源/编译结果/编译产出的容器, 它可以包含多个target, 并且组织这些target如何编译. 新建项目一般都会创建一个项目名的target和tvos的target, 可以设置一些默认的编译选项, 让所属的target继承这些编译属性, target也可以选择override这些属性.

一个target可以经过编译产出一个app或者一个静态库.

#### 静态库的链接

拿[RNFS](https://github.com/itinance/react-native-fs)的安装为栗子:

首先需要执行安装 `$ yarn add react-native-fs`, 它会将npmjs上的package拉取到项目node_modules下.


##### 自动链接(无CocoaPods)
由于RNFS使用到了原生代码, 所以可以用 `$ react-native link react-native-fs` 自动链接.
它会自动将`node_modules/react-native-fs/`下的`RNFS.xcodeproj`添加到Library下, 并且将 `libRNFS.a`添加到`Linked Frameworks and Libraries`下, 最后将`Header Search Path`添加一行 `$(SRCROOT)/../node_modules/react-native-fs (recursive)`. 再次编译运行就可以使用RNFS了. 如果一个rn第三方库只需要js代码来调用, 原生从来不用, 那么就不需要添加`Header Search Path`.

##### 自动链接(有CocoaPods)

如果项目使用了CocoaPods, 那么执行link就会在Podfile里自动添加一句:

```
pod 'RNFS', :path => '../node_modules/react-native-fs'
```

这样再执行 `$ pod install`, Pod就会自动将所需要的文件根据`node_modules/react-native-fs`下的`RNFS.podspec`下载放好.

##### 手动链接(无CocoaPods)

1. 将`node_modules/react-native-fs`下的`RNFS.xcodeproj`拖拽到项目的Library下
2. 添加`libRNFS.a`到`Linked Frameworks and Libraries`
3. [非必须]在`Header Search Path`下添加一行`$(SRCROOT)/../node_modules/react-native-fs (recursive)`

##### 手动连接(有CocoaPods)

1. 在Podfile里添加一行: `pod 'RNFS', :path => '../node_modules/react-native-fs'`
2. 执行`$ pod install`

##### 疑问🤔️

`RNFS.xcodeproj`下的`RNFSManager.m`里有:

```
#import <React/RCTEventDispatcher.h>
#import <React/RCTUtils.h>
#import <React/RCTImageLoader.h>

```

如果React还没编译, 岂不会报错? 或者怎么保证React先编译了?

如图:

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1526707081680.png" width="671"/>


如果还报一些诸如:

```
library not found for -lXXX

framework -> xxx.h file not found
```

那肯定是有些`Header Search Path` 或 `Framework Search Path`配置有问题.


####  Pod管理项目方式

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1526708491508.png" width="274"/>

像这种项目中依赖很多其他第三方的`.xocdeproj`, 编译这些依赖, 产出它们的target编译结果.a, 这种方式简直弱爆了, 所以就有了CocoaPods.

执行 `pod install` 会根据Podfile下的依赖自动下载并放到指定位置, 项目由一个.xocdeproj升级为.xcworkspace.

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1526708755983.png" width="373"/>

Pod下分为`Development Pods`和`Pods`, 其中Pods是可以在`ios/pods`文件夹下找到所对应的依赖文件, 而Development Pods是引用了`node_modules/`下的具体依赖. 

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1526708803875.png" width="755"/>

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1526708844144.png" width="348"/>


##### Podfile配置



简单的`pod 'FMDB'`会在安装时候将FMDB下载到**Pods文件夹**下.

而 `pod 'yoga', :path => '../node_modules/react-native/ReactCommon/yoga'`则会根据`node_modules/react-native/ReactCommon/yoga`路径下的`yoga.podspec`来下载依赖. 放到**Development Pods**下.

而 `pod 'GLog', :podspec => '../node_modules/react-native/third-party-podspecs/GLog.podspec'`会根据这个路径下的`GLog.podspec`去下载相应的依赖放到**Pods文件夹**下.

以下这种subspecs方式

```
pod 'React', :path => '../node_modules/react-native', :subspecs => [
    'Core',
    'CxxBridge',
    'DevSupport',
    'ART',
    'RCTImage',
    'RCTAnimation',
    'RCTActionSheet',
    'RCTGeolocation',
    'RCTNetwork',
    'RCTSettings',
    'RCTText',
    'RCTVibration',
    'RCTWebSocket',
    'RCTLinkingIOS'
  ]
```

会引用`React.podspec`下的subspec, 放到**Development Pods下的React**里.

如果是RCTImage, 则它的目录为:

```
node_modules/react-native/Libraries/Image
```

其中`React.podspec`的subspec配置为:

```
  s.subspec "RCTImage" do |ss|
    ss.dependency             "React/Core"
    ss.dependency             "React/RCTNetwork"
    ss.source_files         = "Libraries/Image/*.{h,m}"
  end
```

说明引用Image也必须引用Core和RCTNetwork, 所以自动将Core和RCTNetwork也引用了.


<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1526710455680.png" width="261"/>

这里的`SSZipArchive`和`JWT`在Podfile中找不到, 是怎么添加进去的呢? 

项目中添加了CodePush, 而CodePush依赖于这几个库, 所以会添加进去, CodePush.podsepc:

```
  s.dependency 'React'
  s.dependency 'SSZipArchive', '~> 2.1'
  s.dependency 'JWT', '~> 3.0.0-beta.7'
  s.dependency 'Base64', '~> 1.1'
```

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1526710797129.png" width="710"/>

项目编译后, 之前需要链接像`libRCTImage.a`等静态库, 现在都会打包到pods里, 只需要链接`libPods-myapp.a`即可将之前的静态库一起链接.




## Podfile
```
platform :ios, '8.0'

target 'myapp' do

  pod 'React', :path => '../node_modules/react-native', :subspecs => [
    'Core',
    'CxxBridge',
    'DevSupport',
    'ART',
    'RCTImage',
    'RCTAnimation',
    'RCTActionSheet',
    'RCTGeolocation',
    'RCTNetwork',
    'RCTSettings',
    'RCTText',
    'RCTVibration',
    'RCTWebSocket'
  ]
  pod 'yoga', :path => '../node_modules/react-native/ReactCommon/yoga'
  pod 'DoubleConversion', :podspec => '../node_modules/react-native/third-party-podspecs/DoubleConversion.podspec'
  pod 'glog', :podspec => '../node_modules/react-native/third-party-podspecs/glog.podspec'
  pod 'Folly', :podspec => '../node_modules/react-native/third-party-podspecs/Folly.podspec'

  pod 'AFNetworking','~>3.1.0'
  pod 'FMDB'
  pod 'GTMBase64'
  pod 'RegexKitLite'
  pod 'SDWebImage'
  pod 'MBProgressHUD'
  pod 'SVPullToRefresh'
  pod 'MJRefresh'
  pod 'Fabric'
  pod 'Crashlytics'

  pod 'react-native-video', :path => '../node_modules/react-native-video'
  pod 'react-native-image-picker', :path => '../node_modules/react-native-image-picker'
  pod 'RNDeviceInfo', :path => '../node_modules/react-native-device-info'
  pod 'RNFS', :path => '../node_modules/react-native-fs'
  pod 'JCoreRN', :path => '../node_modules/jcore-react-native'
  pod 'JPushRN', :path => '../node_modules/jpush-react-native'

end
```


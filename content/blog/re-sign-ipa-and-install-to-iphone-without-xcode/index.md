---
title: "重签名ipa并安装到iPhone(不用Xcode)"
date: "2021-02-17"
category: "dev"
emoji: "🔏"
---

拿到一个 ipa 文件, 对其重签名, 使用的工具是这个: https://www.iosappsigner.com/.

重签名后如何将其安装到手机上呢?

## 1. 使用 Xcode

菜单栏: Window - Devices, 找到连接的 iOS 设备, 然后将签名好的 ipa 文件托进去,
安装完成.

## 2. 使用网页下载

网页需要托管在 https 域名下(记得好像是). 网页有个下载按钮, 下载按钮指向的是一个
plist 文件, plist 文件是对 ipa 的描述.

```html
<a href="itms-services://?action=download-manifest&url=https://bdc3168dc0ea.ngrok.io/tf.plist">download</a>
```

```plist
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
"http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <!-- array of downloads. -->
  <key>items</key>
  <array>
   <dict>
    <!-- an array of assets to download -->
     <key>assets</key>
      <array>
       <!-- software-package: the ipa to install. -->
        <dict>
         <!-- required. the asset kind. -->
          <key>kind</key>
          <string>software-package</string>
          <!-- required. the URL of the file to download. -->
          <key>url</key>
          <string>https://baidu.com</string>
        </dict>
        <!-- display-image: the icon to display during download.-->
        <dict>
         <key>kind</key>
         <string>display-image</string>
         <key>url</key>
         <string>https://bdc3168dc0ea.ngrok.io/dilidili2.ipa</string>
        </dict>
        <!-- full-size-image: the large 512x512 icon used by iTunes. -->
        <dict>
         <key>kind</key>
         <string>full-size-image</string>
         <key>needs-shine</key>
         <true/>
         <key>url</key><string>https://baidu.com</string>
        </dict>
      </array><key>metadata</key>
      <dict>
       <!-- required -->
       <key>bundle-identifier</key>
       <string>com.faichou.test</string>
       <!-- optional (software only) -->
       <key>bundle-version</key>
       <string>1.0.9</string>
       <!-- required. the download kind. -->
       <key>kind</key>
       <string>software</string>
       <!-- optional. displayed during download; typically company name -->
       <key>subtitle</key>
       <string>test</string>
       <!-- required. the title to display during the download. -->
       <key>title</key>
       <string>Test</string>
      </dict>
    </dict>
  </array>
</dict>
</plist>
```

所以目前需要3个文件:

1. html 文件
2. plist 文件
3. ipa 文件

将其放到统一目录下(方便托管), 然后在目录下开一个 server, 记住端口号. 然后用
ngrok 等工具将其内网转发到外面去. 于是手机就可以用域名来访问下载页面了.

## 3. 使用命令行下载

```bash
$ brew install libimobiledevice
$ brew install ideviceinstaller
$ ideviceinstaller --install WeChat.ipa
```

这里使用 `ideviceinstaller` 命令来安装 ipa 文件, `ideviceinstaller` 依赖于
`libimobiledevice`, 它也有很多有趣的功能: https://github.com/libimobiledevice/libimobiledevice#utilities


<hr>

在 iOS8.3 之后, 苹果强制要求 `entitlement` 文件, 只用 `codesign` 签名 ipa
并不能导入到手机使用, 导入会失败: `ApplicationVerificationFailed`.

所以现在都需要使用 `mobileprovision` 文件来进行签名, 它包含了签名证书, AppID, 设备IDs和 `entitlement`.

那么如何生成 `mobileprovision` 文件呢? 答案是使用 Xcode:

> Xcode is the easiest way to create an iOS provisioning profile.

能否有命令行可以生成 Provisioning Profile 呢(Personal Team)? 答案是没找到!

但大概也能猜出个八九不离十, 因为当手机插到电脑上时候,
手机上会弹框提示是否信任这台电脑, 当点击信任时候, 电脑就可以拿到手机的一些信息,
其中包含 UDID, 当用 Xcode 创建一个项目时候, 它就会自动创建 Provisioning Profile,
不信就去 `~/Library/MobileDevice/Provisioning Profiles` 里面看是否有刚生成的
mobileprovision 文件, 它里面就包含刚刚信任手机的 UDID.

那为什么不能用命令行生成 mobileprovision 文件呢?
因为它的组成部分(证书和其他信息)需要被苹果亲自签名一下, 只能通过 Xcode,
签名加上证书等文件才最终组成了 Provisioning Profile.


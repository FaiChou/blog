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


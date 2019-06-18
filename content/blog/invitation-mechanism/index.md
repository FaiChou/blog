---
title: "邀请奖励机制"
date: "2019-06-18"
category: "dev"
emoji: "👫"
---

如何设置一种邀请奖励机制, 让用户分享下载 APP 时候可以获取到相对有效的下载量?

比如 A 用户分享带有 AAA 邀请码的分享链接推荐他人下载 APP, 其他用户通过此链接点击了下载(iOS与安卓), 那么此时给 A 用户增加邀请数量.

本文讨论我所了解的处理方法.

## 下载发送日志到后台

受邀用户在分享页面点击下载按钮时候向后台发送邀请码.

这样有个明显的漏洞, A 用户可以自己手动点击下载按钮, 会不停的给后台发送请求, 从而刷邀请量.

限制方法:

后台通过cookie/ip等判断用户是否存在刷单, 进而增加限制.

## 神奇的方法

以上方法用户很简单就能 get 到请求链接, 进而用个简单的脚本就可以刷单.

昨天发现了一个神奇的邀请机制, 在邀请下载页面没有向后台发送任何请求, 页面有两个按钮, 「iOS」与「安卓」下载, 点击 iOS下载, 会通过 *itms-services* 协议下载企业版本 app, 点击安卓下载会下载安卓 apk 包.

经过我的测试, 点击下载后也不能给我增加邀请数量, 但当我安装**打开**之后我的邀请数量会增加.

[👉邀请链接👈](http://app.dyporn.me/download?invite_code=NFBZH&channel=official&from=qrcode)

可以查看上方的链接源码, 里面没有向后台发请求的代码, 点击按钮只是 `location.href` 跳转, 那它是怎么实现的呢?

猜测: 打开链接时将邀请码存到系统本地, 打开app时候获取此邀请码发送给后台.

再次检查它的源码, 发现他们用了 `clipboardjs`. 于是真相大白, 他们将邀请码保存到系统粘贴板, 在打开app时候 check 粘贴板内容, 再将数据上报.

## 正规途径

以上方法很蹊跷, 当然也可以抓包看下调用的是哪一个请求, 再模拟刷单, 这是避免不了的.

但是保存到粘贴板就是**网页与app内容共享**的唯一途径了吗?

不是的.

一个友好的操作系统必须提供一种方式来让沙盒app与系统其他项目共享数据, 比如在 iOS 里 app 可以读取和操作 iCloud 数据, 当然对于网站数据共享 apple 提供了一种独立的解决方案: [Shared Web Credentials](https://developer.apple.com/documentation/security/shared_web_credentials).

![Shared Web Credentials](https://docs-assets.developer.apple.com/published/0ddea9db46/1722250e-9b29-4e7c-bbed-4fb0410d0aae.png)

那么安卓的处理方式是什么呢? [Enable automatic sign-in across apps and websites](https://developers.google.com/identity/smartlock-passwords/android/associate-apps-and-sites)


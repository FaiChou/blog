---
title: "Cors and Cookies"
date: "2018-12-25"
category: "Dev"
description: "web cookies on chrome"
emoji: "👨🏼‍💻"
---


## Merry Christmas!

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/1545734043147.png" width="500" />


## 问题描述

前端项目: reactjs, 使用 fetch 接口请求.

后端接口: php5.6, 使用 session 来保存用户会话.

跨域请求.

在使用 fetch 请求时候, 在 Chrome Devtool 里一直找不到 Response set-cookie 字段, 并且也看不到下次请求带上的 cookies 字段, 以至于服务器不能认识「我」.

## 尝试过的方法

1. `fetch` 设置 `credentials: 'include'`
2. 服务器设置 `Access-Control-Allow-Credentials: true`
3. 服务器设置 `Access-Control-Allow-Origin: http://localhost:3000`
4. 怀疑过 cookie 过来时候就失效(过期)了, GMT ~
5. 在 safari / firefox / iPhone safari 里尝试

## 真正原因

前后端能做的都已经做了, 可为何请求不会带上 cookie 呢? 答案是**现在大多浏览器都默认禁止第三方 cookie**.

其实这里的问题不只一个:

1. 浏览器第三方 cookie 政策
2. Chrome Devtool 特(wen)性(ti)

首先三方 cookie 政策导致的不能发送 cookie, 其次在 Chrome Devtools 中跨域的请求都会看不到 set-cookie 字段, 在 Safari 和 firefox 中是可以看到的, 并且在 Chrome Devtools 中跨域的请求 header 看到的也是不完整的, 会有个警告⚠️: `Provisional headers are shown`.

> Provisional headers are shown 是 Chrome 的祖传 Bug，对于部分 HTTP2 的连接故意不显示，其实抓包你就发现挺正常的。

---

> 在 devtool 中对某一次请求右键-copy-as cURL, 然后粘贴到 terminal 使用.

---

[Requests_with_credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Requests_with_credentials):

> **Third-party cookies**
> Note that cookies set in CORS responses are subject to normal third-party cookie policies. In the example above, the page is loaded from foo.example, but the cookie on line 22 is sent by bar.other, and would thus not be saved if the user has configured their browser to reject all third-party cookies.


## 如何解决

1. 部署到同一域名下
2. 关掉三方 cookie 限制
3. 换掉验证方式, 比如使用 oauth 替代

以及:

> 1. b.com 和 c.com 都跳转到 a.com 设置 cookies，再跳转回来
> 2. 使用小弹窗的方式设置 Cookies
> 3. Storage Access API，在 Safari 上会弹出一个用户授权框，需要用户显式授权
> 4. 让用户修改浏览器设置，允许第三方 Cookies


## 参考

- [前后端分离的项目中(跨域请求 api), 如何正确使用 cookie 作为验证?](https://www.v2ex.com/t/520669)
- [fetch api 在浏览器内无法保存和发送 cookie?](https://www.v2ex.com/t/520459)
- [Browser cannot read and send cookies with fetch api even set credentials to include on cross origin request](https://stackoverflow.com/questions/53909632/browser-cannot-read-and-send-cookies-with-fetch-api-even-set-credentials-to-incl)
- [网页的隐式跨多域 Cookies 的方法探讨，在 Safari 上面似乎路径都已经被堵死](https://www.v2ex.com/t/520756)


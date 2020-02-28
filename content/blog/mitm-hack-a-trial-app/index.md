---
title: "AnyProxy 和 mitmproxy 的使用"
date: "2020-02-28"
category: "dev"
emoji: "🧿"
---

## 前言

上篇介绍了如何使用 Charles 来改写接口，达到 hack 的目的。其实针对 Charles 的抓包破解，app 可以很简单的防范住，比如客户端发送一个字符串 X，后台经过**与客户端相同的算法**处理变成 Y 返回给客户端， 这时客户端判断 `foo(X) === Y` 即可。因为在 Charles 中只能做简单的字符替换或正则替换，比较困难的算法处理是没办法解决的。幸运的是，上篇介绍的 Sip 采用了此中防范策略，可以继续拿它来测(kai)试(dao)。

还要考虑一种情况，接口请求来判断剩余试用天数，如果试用结束，那么返回的状态信息可能会千变万化，而采用 Charles 的替换 response 是不能够满足的, 所以针对这种情况，最好能够拦截请求，直接响应返回，不经过服务器处理。

所以本篇的 AnyProxy 和 mitmproxy 就出场了。


## AnyProxy

它是阿里团队写的一个基于 Node.js 的 HTTP 代理服务。

针对 HTTPS 抓包，需要下载 CA 并信任，教程在官方文档上都有，这里不多赘述。

使用方法有两种，命令行模式和 node 模式。命令行模式比较单纯，可以配置的只有几个参数：是否代理 https / 代理端口等。

所以命令行模式比较单一，只有代码模式是符合我们的需求的。

#### 设置系统代理

抓包 app 需要配置系统的 http / https 代理，手动打开「网络」-「高级」-「代理」-「http 和 https」-「填上server 和 port」.

这样做比较呆，幸运的是 AnyProxy 提供了简便的方法:

```javascript
AnyProxy.utils.systemProxyMgr.enableGlobalProxy('127.0.0.1', PORT_PROXY, 'http')
AnyProxy.utils.systemProxyMgr.enableGlobalProxy('127.0.0.1', PORT_PROXY, 'https')
```

如果它不提供也可以使用命令行来完成:

```bash
# set HTTP proxy to 127.0.0.1:8888
$ networksetup -setwebproxy Wi-Fi 127.0.0.1 8888 && networksetup -setproxybypassdomains Wi-Fi 127.0.0.1 localhost
# set HTTPS proxy to 127.0.0.1:8888
$ networksetup -setsecurewebproxy Wi-Fi 127.0.0.1 8888 && networksetup -setproxybypassdomains Wi-Fi 127.0.0.1 localhost
```

查看系统的代理设置:

```bash
$ scutil --proxy
<dictionary> {
  ExceptionsList : <array> {
    0 : 127.0.0.1
    1 : localhost
  }
  HTTPEnable : 1
  HTTPPort : 8888
  HTTPProxy : 127.0.0.1
  HTTPSEnable : 1
  HTTPSPort : 8888
  HTTPSProxy : 127.0.0.1
  SOCKSEnable : 1
  SOCKSPort : 7891
  SOCKSProxy : 127.0.0.1
}
```

#### 代码编写

```javascript
const AnyProxy = require('anyproxy')

const PORT_PROXY = 8765
const SIP_URL = 'https://api.sipapp.io/2.0/trial'
const PIN_MAP = {
  '0': 'b',
  '1': 'F',
  '2': '7',
  '3': 'A',
  '4': '1',
  '5': 'e',
  '6': 'K',
  '7': '1',
  '8': 'Z',
  '9': 'c',
}

const rule = {
  summary: 'Hack Sip!',
  *beforeDealHttpsRequest({ host, _req }) {
    if (host.includes('api.sipapp.io')) {
      return true
    }
    return false
  },
  *beforeSendRequest({ url, requestData }) {
    if (url === SIP_URL) {
      const { pin, id } = JSON.parse(requestData)
      const match = pin.toString().split().reduce((num, str) => str+PIN_MAP[num])
      const body = JSON.stringify({
        build: 200,
        environment: 'production',
        match,
        status: 200,
        success: true,
        trial: {
          id,
          days: 15,
          remaining: 15,
          date: '2020-02-23',
          name: 'FaiChou-MBP'
        },
        version: '2.0'
      })
      return {
        response: {
          body,
          statusCode: 200,
          header: { 'content-type': 'application/json' }
        }
      }
    }
  }
}

const OPTIONS = {
  rule,
  port: PORT_PROXY,
  forceProxyHttps: true,
  dangerouslyIgnoreUnauthorized: true
}

const server = new AnyProxy.ProxyServer(OPTIONS)
server.on('ready', () => console.log('😁 [PROXY READY]'))
server.on('error', e => console.error('😭 [PROXY ERROR]:', e))

function start() {
  if (!AnyProxy.utils.certMgr.ifRootCAFileExists()) {
    console.log('😡 未发现证书')
    return
  }
  server.start()
  AnyProxy.utils.systemProxyMgr.enableGlobalProxy('127.0.0.1', PORT_PROXY, 'http')
  AnyProxy.utils.systemProxyMgr.enableGlobalProxy('127.0.0.1', PORT_PROXY, 'https')
}

function close() {
  server.close()
  AnyProxy.utils.systemProxyMgr.disableGlobalProxy()
}

start()
```

使用 Node 来执行它，就可以抓包并更改接口。它主要做了以下几件事:

1. 初始化一个代理服务器
2. 开启系统全局代理为当前代理服务器
3. 设置抓包规则，开启 https 抓包

规则是: 代理服务器只处理 host 为 `api.sipapp.io` 的请求，当收到请求（并未发送给「真」服务器）时候做以下处理：

1. 解析请求 body
2. 通过算法将 `pin` 转成 `match`, 此算法即抓包 app 采用的算法
3. 构造返回信息进行返回

#### 滑铁卢

在进行测试时候发现，每次打开 Sip 都会提示 *Invalid JSON*, 怎么修改都不能解决，经过一下午的挣扎，终于发现端倪，因为 Sip 发出的请求方法是 `VIEW`, 并非传统的 `POST, GET`, 应该是 AnyProxy 的 bug 导致不能处理 `VIEW` 的请求。

代码其实没有任何问题，只是被框架限制住了。于是再采用 mitmproxy 方法。


## mitmproxy

它名字就非常形象，MITM (man-in-the-middle): 中间人代理。

废话不多讲，首先安装信任 CA. 经过简单的翻看文档，可以看到它提供三种命令:

1. mitmproxy 和 AnyProxy 类似
2. mitmdump 和 tcpdump 类似
3. mitmweb 提供图形界面

AnyProxy 也提供图形界面，可以在配置中打开。

因为本人的 python 水平有限，所以文档也粗略查看，不像写 js 代码，哪里不会点哪里，VSCode 会自动帮你找到你的方法对应的 ts 文件，写 python 真是煎熬，只能查文档或看源码。

```python
import json
import mitmproxy.http
from mitmproxy import http
from functools import reduce

PIN_MAP = {
  "0": "b",
  "1": "F",
  "2": "7",
  "3": "A",
  "4": "1",
  "5": "e",
  "6": "K",
  "7": "1",
  "8": "Z",
  "9": "c",
}

def request(flow):
  if flow.request.pretty_url.endswith("api.sipapp.io/2.0/trial"):
    pin = json.loads(flow.request.content)["pin"]
    match = reduce(lambda x, y: x + PIN_MAP[y], str(pin), "")
    body = {
      "build": 200,
      "environment": "production",
      "match": match,
      "status": 200,
      "success": True,
      "trial": {
        "days": 15,
        "remaining": 15,
        "date": "2020-02-23",
        "name": "FaiChou-MBP",
        "id": json.loads(flow.request.content)["id"]
      },
      "version": "2.0"
    }
    flow.response = http.HTTPResponse.make(
      200,
      json.dumps(body, separators=(',', ':')),
      {"content-type": "application/json"}
    )
```

简简单单一个方法，使用方法是搭配命令行:

```bash
$ mitmproxy -p 8888 -s ~/bin/hack-sip.py
```

打开 Sip 测试，bingo！完美 hack!


## 总结

这么一用就即可发现，mitmproxy 比 AnyProxy 好用，因为 AnyProxy 不支持 `VIEW` 的请求方法，让我 debug 半天！

最后，感谢 Sip，向开发人员致敬。

## 参考

- [AnyProxy](http://anyproxy.io/cn/)
- [mitmproxy](https://mitmproxy.org/)
- [Mitmproxy使用教程for mac](http://rui0.cn/archives/498)

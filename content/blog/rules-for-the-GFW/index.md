---
title: "关于fq乱七八糟规则的问题"
date: "2020-10-29"
category: "dev"
emoji: "🌎"
---

## 环境 🌲

- Chrome
- SwitchyOmega
- ClashX

不考虑使用 Proxifier / Proxychains / Proximac / Tsocks / Privoxy 等工具的情况.

## 为什么 🤷🏻‍♂️

ClashX 有 System Proxy 和 proxy mode (global/rule/direct) 

配置的文件也可以设置 group 和 rule

所以一个连接到底经过几关规则?

## Chrome 一关 🤲🏻

浏览器访问A链接, 经过 SwitchyOmega 的 4 种规则:

1. DIRECT, 跳过ClashX的服务, 直接连接目标服务器
2. SYSTEM, 跟从系统的代理, 如果系统代理没有设置, 则直连
3. PROXY, 走 ClashX 的服务
4. auto switch, 根据设置的规则, 到底走不走 ClashX 的服务

## ClashX 一关 👐🏻

走到了 ClashX 的服务, 之所以把它称之为服务, 是因为 ClashX 建立的 server 有很多规则.

### System Proxy 小关卡 🙌🏻

先说最简单的, Set as system proxy. 它会将系统的代理设置为 ClashX 的 server; 那些走系统代理的软件会经过 ClashX, 而不走系统代理的, 仍然不会到达 ClashX. 比如, 常见的如何让 Terminal 挂代理? 答案是:

```
export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
```

### Proxy Mode 小关卡 👏

是不是设置系统代理,  而且 App 也走系统代理就一定会通过你的fq服务? 答案是不一定. 因为还要经过下面的规则:

Proxy Mode 的 3 种:

1. Global
2. Rule
3. Direct

当设置为 Direct 时, 来到 ClashX 的请求, 都会再次直接面对目标服务器, 而不经过fq服务器.
当设置为Global时, 是不是都经过fq服务器? 也不一定, 因为 Global 模式下, 请求走哪里也是可以配置的. 可以选择的请求方式有:

1. 直连
2. 拒绝请求
3. 代理节点
4. 代理组(group)

### Rule 关卡 🤝

当 Proxy Mode 设置为 Rule 时, 到达 ClashX 的请求会经过配置文件的过滤, 再决定是否走fq服务器.

这里的配置文件可以设置 proxies 和 proxy-groups, 并且还可以配置 rules. 如果一个请求被 rules 匹配到(严格讲所有请求都会被匹配到), 则请求会根据规则到底选择走 proxy 节点, 还是经过 proxy-group 处理, 或者直连/拒绝.

### 例子 🌰

当在 Chrome 中设置 SwitchyOmega 为 PROXY. 此时 ClashX 的配置是 Rule:

```
- 'DOMAIN-SUFFIX,baidu.com,DIRECT'
```

那么, 请求是否经过fq服务器?

答案是**不经过**, 但在 Chrome 中打开 DevTools 查看请求可以发现:

```
Remote Address: http://127.0.0.1:7890
```

它确实是经过 ClashX 的服务, 但被 ClashX 下的规则过滤掉了.

所以要想使一个打不开的链接走fq节点, 不光需要在 Chrome 中设置代理, 还要确定在 ClashX 规则里将其匹配到 Proxy 上.


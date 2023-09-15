---
title: "Socket编程"
date: "2023-09-15"
category: "dev"
emoji: "🛜"
---

## sockfd = socket(AF_INET, SOCK_STREAM, 0)

- 创建一个 `socket`, 返回一个文件描述符（file descriptor）到 `sockfd`，在 linux/unix 中一切设备和 I/O 操作都是通过文件描述符抽象的。
- `AF_INET` 是 address family internet 一般指的是 ipv4
- `SOCK_STREAM` 是套接字类型参数，表示使用一个面向连接的，通常用于 TCP
- 第三个参数 0 是指协议，这情况是用 TCP


## connect(sockfd, (SA *) &servaddr, sizeof(servaddr))

- 建立与远程服务器连接，tcp 三次握手
- sockfd 是上面的套接字
- servaddr 是服务端地址

## send(sockfd, sendBuffer, strlen(sendBuffer), 0)

发送数据，或者用 write

## recv(sockfd, recvBuffer, sizeof(recvBuffer) - 1, 0)

接收数据，或者用 read


## bind(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr))

bind 用于绑定套接字到一个本地地址和端口，本地地址可以是所有可用的接口（INADDR_ANY）。
这样有客户端向绑定的地址+端口发送消息时候可以被这个 socket 收到。

## listen(sockfd, 5)

listen 用于监听，一般用于 bind 之后，和 accept 之前。
上面例子允许最多有 5 个连接在队列中等待。

## accept(sockfd, (struct sockaddr *)&cliaddr, &cli_len)

`accept` 会阻塞程序，等待客户端请求的到来。当客户端请求到来后，会将客户端的地址信息保存在 `cliaddr` 中，并且 `accept` 返回一个新的 socket file descriptor，这个 `newfd` 用来处理当前请求。

通常 `bind+listen+accept` 用于服务端。`listen+accept` 用于**通信套接字**，和开始的**监听套接字**做区分隔离。

当新的请求到来后使用 `while(read(newfd, recvline, MAXLINE-1)>0)` 来读取请求发送来的数据，如果发送完毕，则读取结束后连接关闭(0)，跳出循环。或者遇到错误返回 -1 也会跳出循环。


## 理解 ClashX Pro 开启增强模式后的行为

首先在命令行执行 `netstat -rn` 查看完整的路由表:

```
~ netstat -rn
Routing tables

Internet:
Destination        Gateway            Flags           Netif Expire
default            192.168.31.1       UGScg             en1
default            link#28            UCSIg           utun3
1                  198.18.0.1         UGSc           utun10
2/7                198.18.0.1         UGSc           utun10
4/6                198.18.0.1         UGSc           utun10
8/5                198.18.0.1         UGSc           utun10
16/4               198.18.0.1         UGSc           utun10
32/3               198.18.0.1         UGSc           utun10
64/2               198.18.0.1         UGSc           utun10
100.64/10          link#28            UCS             utun3
100.100.100.100/32 link#28            UCS             utun3
100.124.11.45      100.124.11.45      UH              utun3
127                127.0.0.1          UCS               lo0
127.0.0.0          127.0.0.1          UHW3I             lo0      1
127.0.0.1          127.0.0.1          UH                lo0
128.0/1            198.18.0.1         UGSc           utun10
169.254            link#13            UCS               en1      !
169.254            link#20            UCSI              en7      !
169.254.89.170     de:53:92:5b:4e:c0  UHLSW             en7   1198
169.254.92.128     de:53:92:59:db:6a  UHLSW             lo0
169.254.92.128/32  link#20            UCS               en7      !
192.168.31         link#13            UCS               en1      !
192.168.31.1/32    link#13            UCS               en1      !
192.168.31.1       88:c3:97:c8:2:b6   UHLWIir           en1   1191
192.168.31.24      4:cf:8c:29:a4:97   UHLWI             en1   1188
192.168.31.50      76:29:4:e0:c8:ea   UHLWI             en1   1193
192.168.31.59      c:7a:15:c1:ad:cc   UHLWI             en1      !
192.168.31.73      6:6e:f7:98:f3:4b   UHLWI             en1   1198
192.168.31.80      84:c5:a6:9e:4:3    UHLWIi            en1    677
192.168.31.129     86:11:14:df:18:ce  UHLWI             en1      !
192.168.31.144     56:f9:cf:1e:97:7d  UHLWI             en1    548
192.168.31.166/32  link#13            UCS               en1      !
192.168.31.199     60:dd:8e:69:5c:d0  UHLWI             en1      !
192.168.31.200     4c:1d:96:b7:7f:37  UHLWI             en1    391
192.168.31.222     f8:d0:27:54:e4:84  UHLWI             en1   1198
192.168.31.255     ff:ff:ff:ff:ff:ff  UHLWbI            en1      !
198.18.0.1         198.18.0.1         UH             utun10
224.0.0/4          link#13            UmCS              en1      !
224.0.0/4          link#20            UmCSI             en7      !
224.0.0/4          link#28            UmCSI           utun3
224.0.0.251        1:0:5e:0:0:fb      UHmLWI            en1
224.0.0.251        1:0:5e:0:0:fb      UHmLWI            en7
239.255.255.250    1:0:5e:7f:ff:fa    UHmLWI            en1
255.255.255.255/32 link#13            UCS               en1      !
255.255.255.255/32 link#20            UCSI              en7      !
255.255.255.255/32 link#28            UCSI            utun3
```

其中 `2/7` 表示 `2.0.0.0/7`，地址范围: `2.0.0.0` 到 `2.255.255.255`。

`4/6` 地址范围: `4.0.0.0` 到 `7.255.255.255`。

`8/5` 地址范围: `8.0.0.0` 到 `15.255.255.255`。

`16/4` 地址范围: `16.0.0.0` 到 `31.255.255.255`

`32/3` 地址范围: `32.0.0.0` 到 `63.255.255.255`。

`64/2` 地址范围: `64.0.0.0` 到 `127.255.255.255`。

`128.0/1` 地址范围: `128.0.0.0` 到 `255.255.255.255`。

可以通过路由表可以知道 ip 地址是走哪一个接口跳转哪个网关出去的。

执行 `ifconfig` 可以看到:

```
utun10: flags=8051<UP,POINTOPOINT,RUNNING,MULTICAST> mtu 9000
	inet 198.18.0.1 --> 198.18.0.1 netmask 0xffff0000
```

这个 utun10 就是 ClashX Pro 开启增强模式后添加的虚拟网络接口。

在查看下 DNS 配置:

```
~ scutil --dns
DNS configuration (for scoped queries)

resolver #1
  nameserver[0] : 198.18.0.2
  if_index : 13 (en1)
  flags    : Scoped, Request A records
  reach    : 0x00000002 (Reachable)
```


所以当某个客户端发起请求时候，如果是一个域名，那么需要向 `198.18.0.2:53` 这个 DNS 服务器请求解析获取 ip 地址，通过路由表，这个请求最终到达 clash，由于增强模式下，clash 是 fake-ip 模式，所以 clash 会立即返回一个 `198.18.x.x` 的地址(可以通过 `ping google.com` 或者 `ping youtube.com` 测试)。

这样获取到一个 `198.18.x.x` 的 ip 地址后，则会向这个地址发起请求，根据路由表则又到达 clash，clash 收到请求后则会处理这个请求，首先拿到它对应的域名是多少，然后再根据规则决定是否真正解析 DNS。

下面这个程序模拟了 clash 开启虚拟网卡以及后续发送请求的过程。

```c
// 创建两个套接字
int utun_sock = socket(AF_INET, SOCK_STREAM, 0);
int eth0_sock = socket(AF_INET, SOCK_STREAM, 0);

// 绑定 utun_sock 到 utun 的 IP 地址
struct sockaddr_in utun_addr;
// 初始化 utun_addr
bind(utun_sock, (struct sockaddr *)&utun_addr, sizeof(utun_addr));

// 绑定 eth0_sock 到 eth0 接口
setsockopt(eth0_sock, SOL_SOCKET, SO_BINDTODEVICE, "eth0", strlen("eth0"));

// 读取数据并转发
char buffer[2048];
while (1) {
    // 从 utun_sock 读取数据
    int n = read(utun_sock, buffer, sizeof(buffer));
    if (n <= 0) {
        // 错误处理
        break;
    }

    // 将数据写入 eth0_sock
    int m = write(eth0_sock, buffer, n);
    if (m <= 0) {
        // 错误处理
        break;
    }
}
```

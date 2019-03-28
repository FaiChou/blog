---
title: "Share Files in LAN with My Colleagues"
date: "2017-07-18"
category: "dev"
emoji: "🕸"
---



### 局域网下文件分享



##### 情景

同事a要向同事b传一些文件，在同一局域网内

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1500388518380.png" width="563"/>

##### 解决方案

1. 压缩这些文件，用qq或微信发送给对方（很normal）
2. 压缩这些文件，用airdrop分享给对方（双方apple用户，而且这种方法最快）
3. 同事a共享文件所在目录，搭建一个简单的http服务，同事b访问a的ip地址和端口，获得目录并下载共享文件（geek）



##### 搭建http服务

利用python的SimpleHTTPServer可以快速搭建一个简单http服务，仅需一行命令

```
$ python -m SimpleHTTPServer
```

默认是用8000端口，在浏览器上访问`localhost:8000`就可以看到自己所共享的目录，当然也可以指定端口

```
$ python -m SimpleHTTPServer 8888
```

这样在浏览器上访问`localhost:8888`就可以，不过有些端口并不能成功，比如小于1024的端口号还有一些系统使用的端口号例如6666都是不可以的。



将此命令装配到别名中

```
alias simpleServer='python -m SimpleHTTPServer'
```

以后只需要使用`simpleServer`或`simpleServer 8888`就可以达到开启http服务



##### 同事共享文件目录步骤



1. a同事`cd`到所要共享的目录
2. a同事在该目录下执行` python -m SimpleHTTPServer`
3. a同事执行`ifconfig`命令查看en0的ip地址，例如`192.168.1.104`
4. b同事在浏览器中访问`192.168.1.104:8000`就可以看到a同事共享的目录了~



下图是在我的两台电脑中尝试的截图：在share路径下共享的a/b/c文件，另一台电脑Safari中访问192.168.1.104:8888就可以看到a/b/c三个文件，点击文件就可以下载。

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1500388170510.png" width="600"/>





<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1500388200773.png" width="600"/>



##### 参考

- [SimpleHTTPServer](http://2ality.com/2014/06/simple-http-server.html)



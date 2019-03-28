---
title: "架设一架谷歌小飞机"
date: "2018-10-16"
category: "dev"
emoji: "🍍"
---


### 前提

1. 你能够科学上网
2. 拥有谷歌账号
3. 拥有Visa等国际卡

### 申请免费试用

去[谷歌云](https://cloud.google.com/)找到免费试用链接, 点击免费试用.

填写信息, 姓名电话住址, visa卡信息.

### 创建 Compute Engine 的 VM实例

1. 起一个名字faichou-ss-01
2. zone 选择 asia 台湾机房
3. machine type 选择 micro 微型
4. boot disk 选择 CentOS 7
5. Firewall 全部勾选(allow http/https)
6. Create

### 安装小飞机

1. 刚才的实例, 在浏览器中打开ssh
2. `$ sudo passwd` 设置密码
3. `$ su` 获取root权限
4. 安装 wget : `$ yum install wget`
5. 安装并执行一键脚本:

```bash
$ wget -N --no-check-certificate https://raw.githubusercontent.com/ToyoDAdoubi/doubi/master/ssr.sh && chmod +x ssr.sh && bash ssr.sh
```

参考: [doub.io](https://doub.io/ss-jc42/)

- 填写端口为443
- 密码自己输入一个简单的
- 其他的一路回车 + y

### 配置网络

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/1539701040608.png" width="500" />

##### 外部ip地址

类型修改为静态, 名称自己起一个 ss

##### 防火墙规则

创建2个防火墙规则, 一个**入站**, 另一个**出站**.

来源ip地址是 `0.0.0.0/0`, 协议和端口选择 `全部允许`, 其他选项都是默认就好.


### BBR加速

1. 浏览器中打开ssh
2. 获取root权限: `sudo su`
3. 安装bbr: `wget --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh && chmod +x bbr.sh && ./bbr.sh`
4. 重置vm实例
5. 重复`1`和`2`
6. 输入: `sysctl net.ipv4.tcp_available_congestion_control` 

如果出现:

```
net.ipv4.tcp_available_congestion_control = reno cubic bbr
```

类似含有 `bbr` 字样即成功.



### 一键脚本

1. [teddysun](https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocksR.sh)
2. [doub.io](https://raw.githubusercontent.com/ToyoDAdoubi/doubi/master/ssr.sh)







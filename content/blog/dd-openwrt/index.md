---
title: "在线更新一个OpenWrt设备"
date: "2024-12-16"
category: "dev"
emoji: "🌴"
---

最近家里和办公室的两台 J1900 设备都出了故障，它们都跑了 OpenWrt 做软路由，无缘无故会自动重启。我查不到具体问题，可能是硬件文件，也可能是固件问题。

家里网络拓扑很简单:

光猫 -> OpenWrt -> 路由器。

OpenWrt 负责 PPPoE 拨号，路由器有线中继（AP），负责 Wi-Fi 功能。

为了检测是硬件问题还是固件问题，于是我先更换了一个 N100 来替代其中一台设备，换下来的一台 J1900 刷 Debian。

安装的 OpenWrt 是用的 [ImmortalWrt](https://firmware-selector.immortalwrt.org/), 直接搜索 x86/64 就能直接下载。
也支持在线定制编译，包括启动时运行的一些脚本（配置pppoe拨号上网等功能），后面会用到。

下面几个需要提前编译好:

```
luci-app-diskman
luci-app-ttyd
openclash
openssh-sftp-server 
```

diskman 用来手动分区的， openssh-sftp-server 用来给 scp 用的，否则 scp 上传有问题。

将 `COMBINED-EFI (SQUASHFS-COMBINED-EFI.IMG.GZ)` 下载下来然后解压得到一个 img 镜像文件，然后准备一个 U 盘，使用 dd 命令将这个 img 写入 U 盘: `dd if=COMBINED-EFI.IMG.GZ of=/dev/sdb bs=4M`。

由于 N100 是新安装的 M2 硬盘，里面没有系统，插入 U 盘的时候，开机会自动选择 U 盘里的系统来启动，其中这个镜像文件里包含了文件系统，不再需要向安装 linux 系统一样，进行安装操作，不需要手动分区。当然这个小系统只有300MB大小，剩下的 1T 空间是没有被使用的，需要手动分区和格式化才能继续使用。

对于 squashfs 系统，它有一个 overlay 分区，首先系统 /dev/sda1 是 /boot 用来内核启动用，然后是只读的 /dev/sda2，里面有系统启动后需要的一些文件，如果用户需要修改配置系统的文件，那么会写入到 /overlay 上面，这样原始的 /dev/sda2 和它组成一个合并层，原始文件不会被修改。所以这个系统支持一件重置功能。但是 /overlay 分区只有很小的一部分。如果扩容？

有两个方法，方法一是新建一个分区，然后将其挂载到 /overlay， 这里需要分区+格式化+挂载，然后将 /overlay 里的所有内容拷贝到新的分区，这里如果文件很多，建议使用 rsync，因为 rsync 有进度条显示，。另一个方法是在安装镜像前就直接 dd 进去一大块空间，然后 resize 一下。

```
dd if=/dev/zero bs=1M count=500 >> immortalwrt.img # 500MB

# 分区
parted immortalwrt.img print 
parted immortalwrt.img
(parted) resizepart 2 100%
(parted) print
(parted) quit

pv immortalwrt.img | dd of=/dev/sda bs=4M
```

系统启动后，将网线插到其中一个网口，然后网线插入电脑，根据分配的 ip 地址来判断是否是正确的网口，OpenWrt 默认是 192.168.1.1，如果电脑被分配到 192.168.1.x，那么就是正确的网口，然后在浏览器中输入 192.168.1.1 就可以访问了。第一次登录修改一下 root 密码。将电脑的 ssh 密钥填进去，这样就可以直接 ssh 连接。

然后 scp 将镜像再上传到 U 盘，准备 dd 到硬盘里。这里出现一个问题，由于这个 U 盘的镜像空间只有 300MB，所以 scp 上传时候会失败。所以需要在 U 盘这个系统里分区一个大一点的空间，格式化后挂载到一个位置。再 scp 到这个地方。

最终再执行 dd 命令将镜像写入硬盘。

关于家里的 j1900 也是遇到自动重启问题，于是想着直接在线 dd，不拔网线直接处理。但是 dd 失败了，而且系统也完蛋了。幸好有一个已经 dd 好的 U 盘。直接插入 U 盘，这样默认就从 U 盘启动了。

于是在 U 盘系统中重新 dd 到硬盘。

这里需要注意，镜像文件需要定制一下，将 PPPoE 拨号的账号密码都提前搞进去，并且 `lan_ip_address` 也需要配置成之前默认的，我的而是 192.168.11.1。这样系统启动时候会和之前一样，不需要连接电脑进行手动修改。

另外，有一台闲置的 j1900 我刷了 deiban 系统。由于只有 vga 口，操作起来是真的麻烦，找了五六台显示器，只有一个支持 vga 的。于是插上 KVM 后重装，没插网线，装的时候无法安装 ssh server 和一些默认 utils，导致最后的系统进去后需要很复杂的操作。而且插入网线也无法自动获取 ip，只能手动配置，ip link set xxx up, ip addr add, ip route default ...然后能联网后，还要再手动配置一下 debian 的源，由于没有 ssh 很多东西只能手敲，不能从其他地方复制粘贴。然后装上 ssh 后，开启 root 登录。最终安装一下 nezha agent，这样就可以实时查看设备在线情况。


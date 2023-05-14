---
title: "Fuck Windows"
date: "2023-05-14"
category: "dev"
emoji: "🪟"
---

有一台 NUC 炸了, 导致我这两天专心搞数据恢复与系统重装. 因为很少接触 Windows 系统, 所以踩的坑不少. 一共有 5 台 NUC, 有两台打开应用风扇就会狂转, 已经有一台把硬盘烧坏了.

另一台也有烧坏硬盘的风险, 所以写这篇博客来记录下这两天的折腾过程, 以备下次参考.

首先炸了的 NUC 是最重要的一台, 里面有一个共享文件夹, 全公司都在使用, 大概有 70G 的重要文件. 所以炸了很慌, 数据没了很重要, 也没有备份过.

其次它刚好在周六的中午炸掉, 下午不上班, 周天也不上班, 我折腾好后也不耽误员工周一的使用, 这也是不幸中的万幸了.

首先通过群友的问答了解到, 通过 wepe 进去可以碰碰运气, 硬盘是否能访问. 果然是能访问, 这么说还有的救. 但通过 DiskGenius 发现硬盘损坏严重. 于是不能再重装系统了, 只能买块硬盘插上去再重装系统.

下载 [wepe](https://www.wepe.com.cn/download.html) 到 Windows 电脑上, 然后插上U盘, 打开 wepe 软件, 安装 PE 到 U盘, PE 是一个独立的精简版的 win 系统.

然后将移动硬盘插到电脑上, 将重要的文件复制粘贴到移动硬盘. 这里很坑, 经常复制过程中遇到 Thumbs.db 文件卡住, 然后后面都不能访问了, 重启电脑也不行, 只能关机, 然后重新启动. 这应该和硬盘损坏有关系.

最终经过很长时间的复制, 将文件都复制好了.

接下来就是买一块 m2固态硬插进去, 很简单. 硬盘买的[七彩虹](https://item.m.jd.com/product/100004898713.html?&utm_source=iosapp&utm_medium=appshare&utm_campaign=t_335139774&utm_term=CopyURL&ad_od=share&gx=RnAomTM2bTfeyZ1E_YR2Cc61RbgU3PQ&gxd=RnAow2NYbTXfyZ8S_oAhVb9ySNnfnTcszlrYuuwvjs8d9nFxuk26y6sk7VsaK1I), 很便宜.

插上去之后, 进入 PE(开机按F2), 然后使用 disk genius 将硬盘快速分区, 分区为 GUID(GPT), 只有 500G, 索性只用一个 C 盘, ESP 可以改成 500MB, 对齐分区改成 4096.

![diskgenius](diskgenius.png)

接下来是重装系统, 将下载好的 [win10](https://p.qwq.mx/Aliyundrive/Mirrors) 放到移动硬盘里(或者放进U盘里), 进入 PE 后双击这个 ISO 文件, 让它变成一个虚拟光驱. 

然后打开安装器, 第一选择上一步的虚拟光驱, 里面的 `source/install.wim`. 第二步选择引导驱动器的位置, 官网和群友们都说选C盘就行, 但选了C盘后 EFI 黄色警告, 并且最终重装完成后一直进不去系统, 很坑. 所以应该选择哪个 500MB 的 EFI system(ESP). 第三选择安装驱动器的位置是 C盘. 之后就是安装-确定. 安装完成后重启慢慢的就可以了, 需要多等一会.

![winsetup](winsetup.png)

重装完成后需要安装的软件有:

1. 7z(解压工具)
2. snipaste (f1截图工具)
3. clash for windows + 配置文件
4. tim qq 和微信
5. Office (包括激活Office, 使用e5账号)
6. 浏览器的各种网页账号登录

参考文档: [微PE优盘使用说明书](https://www.wepe.com.cn/ubook/)


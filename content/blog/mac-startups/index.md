---
title: "mac启动项"
date: "2018-10-08"
category: "Dev"
emoji: "👨🏼‍💻"
---

## Login Items

#### ~/Library/Preferences/com.apple.loginitems.plist

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1538991107794.png" width="500"/>

#### app's Contents/Library/LoginItems

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1538992483910.png" width="500"/>



## Launchd

#### ~/Library/LaunchAgents

```
com.adobe.GC.Invoker-1.0.plist
com.github.facebook.watchman.plist
com.macpaw.CleanMyMac4.HealthMonitor.plist
com.qiuyuzhou.shadowsocksX-NG.http.plist
com.qiuyuzhou.shadowsocksX-NG.kcptun.plist
com.qiuyuzhou.shadowsocksX-NG.local.plist
com.yicheng.ShadowsocksX-R.local.plist
homebrew.mxcl.mysql.plist
homebrew.mxcl.polipo.plist
org.freedownloadmanager.fdm5.helper.plist
```

#### /Library/LaunchAgents

```
com.adobe.AAM.Updater-1.0.plist
com.adobe.GC.AGM.plist
com.adobe.GC.Invoker-1.0.plist
com.bjango.istatmenus.agent.plist
com.bjango.istatmenus.status.plist
com.google.keystone.agent.plist
com.oracle.java.Java-Updater.plist
com.teamviewer.teamviewer.plist
com.teamviewer.teamviewer_desktop.plist
org.pqrs.karabiner.karabiner_console_user_server.plist
```

#### /System/Library/LaunchAgents

Too many apple system launch agents


#### /Library/LaunchDaemons

```
com.adobe.adobeupdatedaemon.plist
com.adobe.agsservice.plist
com.adobe.fpsaud.plist
com.bjango.istatmenus.daemon.plist
com.bjango.istatmenus.installerhelper.plist
com.docker.vmnetd.plist
com.google.keystone.daemon.plist
com.intel.haxm.plist
com.macpaw.CleanMyMac4.Agent.plist
com.microsoft.autoupdate.helper.plist
com.microsoft.office.licensingV2.helper.plist
com.nssurge.surge-mac.helper.plist
com.oracle.java.Helper-Tool.plist
com.oracle.oss.mysql.mysqld.plist
com.teamviewer.Helper.plist
com.teamviewer.teamviewer_service.plist
org.pqrs.karabiner.karabiner_grabber.plist
org.virtualbox.startup.plist
```

#### /System/Library/LaunchDaemons

Too many apple system launch daemons



#### Job Definitions: Daemons and Agents

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1538997422057.png" width="600"/>

> Job definitions crucial for the operation of the operating system are stored below `/System/Library`. You should never need to create a daemon or agent in these directories. Third-Party definitions which are relevant for every user are stored below `/Library`. Job definitions for a specific user are stored below the respective user's Library directory.




1. 可以直接对 `plist` 进行 `CRUD`
2. 也可以通过 `launchctl load xxx.plist` 或 `launchctl unload xxx.plist` 进行编辑

详细命令详情可以用 `man launchctl` 查看, 比如很实用的有:

```
launchctl load **
launchctl unload **
launchctl list
launchctl print user/$(id -u)
launchctl print-disabled user/$(id -u)
```


## Startup Items

#### /System/Library/StartupItems
#### /Library/StartupItems

> Earlier versions of OS X relied on two folders — `/Library/StartupItems` and `/System/Library/StartupItems` — to hold items designated to load when you start your Mac. Apple now discourages the use of startup items, but some programs (mostly older apps) still use this mechanism. Normally your `/System/Library/StartupItems` folder should be empty; but if it contains something that you don’t use anymore, you can drag the unwanted item to the Trash to prevent it from loading automatically the next time you start your Mac.




## Reference

- [http://www.launchd.info/](http://www.launchd.info/)
- [Take control of startup and login items
](https://www.macworld.com/article/2047747/take-control-of-startup-and-login-items.html)
- [Adding Login Items Using the Service Management Framework
](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLoginItems.html)
- [Mac开机启动项详解](https://blog.csdn.net/astarring/article/details/69055218)


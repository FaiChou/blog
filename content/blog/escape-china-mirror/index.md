---
title: "Abandon China Shit Sources"
date: "2017-10-10"
category: "dev"
emoji: "😼"
---

yarn, npm, rubygems源都被我更改/添加了淘宝/rubychina源，有些时候，挺方便的。但是考虑到已经将我的terminal代理了，并不需要通过改源来加速。



#### yarn

`yarn config get registry`  查看源

如果不是官方源https://registry.yarnpkg.com，改成官方源

`yarn config set registry 'https://registry.yarnpkg.com'`

当然也可以修改`~/.yarnrc`这个文件，打开它手动改一下。



刚看了下 `yarn config list`，竟然还有disturl也为淘宝的，索性用给删掉了。

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1507615208265.png" width="600"/>



#### npm

`npm config get registry`  查看源

如果不是官方源https://registry.npmjs.org/，改成官方源

`npm config set registry 'https://registry.npmjs.org/'`

当然也可以修改`~/.npmrc`这个文件，打开它手动改一下。



#### rubygems


gem sources -l // 查看所有源

如果没有官方https://rubygems.org/，添加之

`gem sources —add https://rubygems.org/`

删除多余的源：

`gem sources —remove https://gems.ruby-china.org/`

如果有淘宝的也给删了吧。

`gem sources -u `更新下缓存。


---


快乐的写bug吧😆


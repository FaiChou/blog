---
title: "Chrome Extension Tutorial"
date: "2017-08-26"
category: "dev"
emoji: "🐋"
---



#### Announcement

> 原创作者为`FaiChou`。

> 代码放在了[这里](https://github.com/FaiChou/Rettiwt)。

> extension名字叫`Rettiwt`, 是Twitter的反过来写，刚在商店搜到了重名的extension，功能也是一样的（当然比我的丰富多了），先在此做下声明，在我完成这个extension之前，我完全不知道有一个重名的extension。

> 本文仅仅是一个教程，demo并没有上传到商店，而且并没有上传商店的教程，如果想上传商店，请参考官方文档。



####  Before We Start

一直好奇chrome extension是如何开发的，就像Adblock这样的extension好像做起来挺偏僻的，因为没有多少人会靠开发extension赚钱，所以开发extension很多都是希望能够解决上网冲浪遇到的问题，比如屏蔽广告，比如修改网页展示等。再一个造成开发人员少的原因是学习成本，如果我们会python，那么直接可以拿来写一个爬虫，但是你如果会js，想要直接写extension，还是会遇到很多困难，因为你要按照chrome文档上标准来写，还需要学习一套新的`chrome.*API`，万幸的是API写的挺js规范的，so，我们开始吧！



#### Target

清除Twitter两侧dashboard栏，达成Ins效果

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/JSisAwesome.gif" width="700px" />

#### First

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1503729491238.png" width="700px" />



通过开发者工具，可以查到Twitter首页两侧的dashboard栏是通过`class="dashboard"`定位的，所以思路犹如泉涌，只要写个css干掉dashboard就OK了。

1. 通过设置`display: none`
2. 通过设置`visibility: hidden`

实验发现，当设置`display: none`时候，中间的content就会跑到左边，这显然非常糟糕，所以采用第二种，只是隐藏掉它，而dashboard仍然存在于原来的位置，只是显示不出来。



#### Second

建立文件们如下(jquery-3.2.1.min.js不需要)

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1503728741100.png" width="700" />



这里面最重要的是`manifest.json`，它是整个extension的配置文件，整合了所有资源、权限、版本、名称、描述等。我的manifest文件内容是这样的：

```json
{
  "name": "Rettiwt",
  "description": "Clear twitter dashboard",
  "version": "1.0",
  "background": {
    "persistent": false,
    "scripts": ["background.js"]
  },
  "permissions": ["storage", "activeTab"],
  "icons": { "128": "rettiwt.png" },
  "browser_action": {
    "default_icon": "rettiwt.png",
    "default_title": "Rettiwt"
  },
  "content_scripts": [
    {
      "matches": [
        "https://twitter.com/*",
        "http://twitter.com/*"
      ],
      "js": ["jquery-3.2.1.min.js", "content.js"]
    }
  ],
  "manifest_version": 2
}
```

这里的`manifest_version`必须填2，因为1号版本在很久之前chrome就弃用了。

里面的ICON、title、name、description、version照着填就可以，没什么讲究，不满意随便改。

permissions是你的extension需要访问哪些权限

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1503732147147.png" width="700"/>

这里的因为要切换隐藏、展示功能，需要存储它的状态，所以保存在localStorage中。

这里要多说一点，每个web都可以有自己的localStorage

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1503732316931.png" width="700"/>

咱的extension虽然限定在Twitter上使用并存储localStorage，但是它存的地方并不是和Twitter一个，在chrome可视化界面中，我没找到它存在什么地方，但是路径中是有的，一个单独的localStorage。

background是我们很重要的组成部分，默默在后台监视着我们的一举一动，所以我们可以起一个监听，当我们点击我们的extension图标，就会callback：

```javascript
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
});

```



content_scripts是主要的工作者，可以匹配我们的网站，当我们限定它工作网站是推特时候这样写：

```json
"matches": ["https://twitter.com/*","http://twitter.com/*"]
```



background和content_scripts谷歌给了不同的权限，所以就分开工作了，我们在background中监听用户点击，当用户点击我们发一个消息给content_scripts，让它执行一部分代码。

当然也可以在background中直接执行一些代码，比如下面的改变背景颜色：

```javascript
chrome.browserAction.onClicked.addListener(function(tab) {
  // change background color
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="#F9FAFC"'
  });
  // send message to content_scripts
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log(tabs);
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});
```



#### Third

当Twitter网页加载完成之后，content_scripts里的js就会执行一遍，所以可以在这里面设置一些初始化，监听一些事件:

```javascript
initialWork();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      // do something
    }
  }
);
```

`chrome.browserAction.onClicked`、`chrome.runtime.onMessage`这些都是chrome.*API，可以在文档中查阅，没必要都先学习一遍，拿来即用。



整体的思路就是，页面加载完成肯定是有dashboard的，所以初始化时候设置一个为true的变量`dashExist`保存在localStorage中，当点击extension，获取`dashExist`值，true的话，执行`switchDashboard`方法，来隐藏掉dashboard，再将`dashExist`设置为false，反之亦然。



初始化工作:

```javascript
var storage = chrome.storage.local;
const dashExist = true;
pageDidLoad();
function pageDidLoad() {
  storage.set({dashExist}, function() {
    console.log('Settings saved');
  });
}
```



切换工作:

```javascript
function switchDashboard(dashExist) {
  if (dashExist) {
    for (let el of document.querySelectorAll(".dashboard"))
      el.style.visibility = "hidden";
    storage.set({'dashExist': false}, function() {
      console.log('close success!');
    });
  } else {
    for (let el of document.querySelectorAll(".dashboard"))
      el.style.visibility = "visible";
    storage.set({'dashExist': true}, function() {
      console.log('open success!');
    });
  }
}
```



用`document.querySelectorAll(".dashboard")`获取dashboard，返回一个数组，遍历设置每个style.visibility。

`chrome.storage.local`的set和get方法来设置和获取localStorage值，这是一个异步的操作，因为extension并不希望阻塞网页。



监听里的方法：

```javascript
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      storage.get('dashExist', function(items) {
        console.log(items.dashExist);
        switchDashboard(items.dashExist);
      });
    }
  }
);
```



#### Last

最后，所有done了，就可以把它搞到我们的chrome中了！！

首先要在chrome://extensions中打开**开发者模式**，再将我们的文件夹拖到extensions这个页面，也可以通过**加载已解压的扩展程序**按钮来导入。

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1503728756421.png" width="700" />

现在在Twitter刷新下试下，加载完成点按我们的extension，是不是很爽呢？



#### Others

就像Adblock是如何实现插入代码到html呢？这并不困难

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1503734920661.png" width="700"/>



```javascript
function injectScript() {
  var script = document.createElement('script');
  script.textContent = `console.log('shittt!!');`;
  (document.head || document.documentElement).appendChild(script);
  // script.remove();
}
```







#### Reference

- [How to Make a Chrome Extension](https://robots.thoughtbot.com/how-to-make-a-chrome-extension)
- [Official Documentation](https://developer.chrome.com/extensions/overview)







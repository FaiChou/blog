---
title: "SPA放到tomcat刷新404"
date: "2018-11-15"
category: "Dev"
emoji: "👨🏼‍💻"
---

## 起因

使用 react 开发了前端项目, 用到了 react-router 做路由, 而 react-router 使用的是 [history](https://github.com/ReactTraining/history) 来管理网页的路由变化.

history 提供了三种创建 `history object` 的方法:

- `createBrowserHistory` 现代流行的h5路由方案
- `createHashHistory` 用户旧款浏览器, 服务器只会传输 `index.html`, 拼接的#服务器不会管
- `createMemoryHistory` 用在非DOM环境(比如RN)中, 用内存管理 history

简单的例子:

```javascript
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

// Get the current location.
const location = history.location;

// Listen for changes to the current location.
const unlisten = history.listen((location, action) => {
  // location is an object like window.location
  console.log(action, location.pathname, location.state);
});

// Use push, replace, and go to navigate around.
history.push("/home", { some: "state" });

// To stop listening, call the function returned from listen().
unlisten();
```


在使用 `browserRouter` 时候, 访问登录页的链接地址是: `https://example.com/login`, 这样服务器(tomcat)会去找 `login.html`, 找不到就会报404错误, 虽然 js 代码有路由配置, 但是 js 代码都是被 `index.html` 加载, 遇到 `https://example.com/login` 服务器根本不会去加载 `index.html`.

其实静态页面适合放到 nginx 下, 这样问题全都解决了, nginx 只会返回 index.html.

但是由于一些原因, 只好放到 tomcat 下, 所以只要不是在根目录下(`https://example.com/`)访问都会404.


## 解决

#### .htaccess if Apache Web Server

```
RewriteEngine on
# Don't rewrite files or directories
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
# Rewrite everything else to index.html to allow html5 state links
RewriteRule ^ index.html [L]

```

#### WEB-INF web.xml if Apache Tomcat

```
  <error-page>
	  <error-code>404</error-code>
	  <location>/index.html</location>
  </error-page>
```

> Apache Tomcat's WEB-INF directory is rather like Apache httpd's ".htxxxxx" files - they both contain data which is within the document directories, but is configuration data that's not directly visible to the web.

> WEB-INF/web.xml (Tomcat) contains the extra configuration information for the current directory / application that's needed in addition to the web.xml file in the main configuration file, and that can be directly compared to the .htaccess files under httpd, which contain additional configuration data, per directory, in addition to what's in the httpd.conf file.

## 参考


- [react-router-urls-dont-work](https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writting-manually)
- [react-router-browserhistory-404](http://blog.codingplayboy.com/2017/12/26/react-router-browserhistory-404/)
- [React-Router做路由，打包出来的静态文件丢到Tomcat里](https://blog.csdn.net/dknightl/article/details/79282093)
- [tomcat 与 nginx，apache的区别是什么](https://www.zhihu.com/question/32212996)
- [ReactTraining/history](https://github.com/ReactTraining/history#usage)
- [react-router V4中三种router区别](https://www.zhihu.com/question/63662664)
- [juejin.im](https://juejin.im/post/5ac6f4a7f265da237314b08c)
- [tomcat-server-change-default-http-404](https://stackoverflow.com/questions/27859626/tomcat-server-change-default-http-404)


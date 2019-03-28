---
title: "碰了一个formdata的壁"
date: "2018-11-13"
category: "dev"
emoji: "❄️"
---

## 问题

之前有个登录接口, 在手机上使用`fetch+multipart/formdata`没出现过任何问题, 但是使用此接口在开发react项目时候, 后台就会报参数取不到.


```javascript
const _d  = new FormData(); _d.append('mobile', '17511111111'); _d.append('verifycode', '1234');
const loginUrl = 'https://****.com/api/v1/login';

// with x-www-form-urlencoded
const formUrlencodedHeader = { 'Content-Type': 'application/x-www-form-urlencoded' };
fetch(loginUrl, {method: 'POST', headers: formUrlencodedHeader, body: _d}).then(r => r.json()).then(r=>console.log(r));
// 参数取不到

// with multipart/form-data
const multipartHeader = { 'Content-Type': 'multipart/form-data' };
fetch(loginUrl, {method: 'POST', headers: multipartHeader, body: _d}).then(r => r.json()).then(r=>console.log(r));
// 参数取不到

// with default header
fetch(loginUrl, {method: 'POST', body: _d}).then(r => r.json()).then(r=>console.log(r));
// 登录成功
```

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/1542121399093.png" width="500" />



## 解析

**application/x-www-form-urlencoded** 会将表单内的数据转换为键值对，比如`name=java&age=23 . 他是默认的MIME内容编码类型，一般可以用于所有的情况。但是他在传输比较大的二进制或者文本数据时效率极低。

这种情况应该使用"multipart/form-data"。如上传文件或者二进制数据和非ASCII数据。**multipart/form-data** 会将表单的数据处理为一条消息，以标签为单元，用分隔符分开。既可以上传键值对，也可以上传文件。每条数据由 `boundary` 隔离，所以 **multipart/form-data** 既可以上传文件，也可以上传键值对，它采用了键值对的方式，所以可以上传多个文件。

当使用RN的 fetch 进行网络请求, 虽然写的`Content-Type`是`multipart/form-data`, 但系统还会将 `boundary` 添加到后面:

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/1542120732933.png" width="600" />

但是使用前端的 fetch 进行网路请求时候, 执行环境是浏览器, 浏览器并不会替换你的 `Content-Type` 字段, 所以默认的 `multipart/form-data; boundary=-R-blabla..` 被你的 headers 给替换掉了, 后台得不到 `boundary` 字段, 无法分割 form-data.

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/1542121217972.png" width="500" />


当指定为 `application/x-www-form-urlencoded` 时, 由于此格式`k=v&k2=v2`形式, 但是发送的 `formdata` 没有指定 `boundary`, 故后台也无法解析.

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/1542121514843.png" width="500" />


默认情况, 浏览器会自动加上 `boundary`, 并且浏览器优化好样式.

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/1542121279676.png" width="500" />


所以, 使用 formdata 不要写 `Content-Type`.


## 参考

- [how-do-i-post-form-data-with-fetch-api](https://stackoverflow.com/questions/46640024/how-do-i-post-form-data-with-fetch-api)
- [fetch-post-with-multipart-form-data](https://stackoverflow.com/questions/35192841/fetch-post-with-multipart-form-data)
- [what-is-the-difference-between-form-data-](https://stackoverflow.com/questions/26723467/what-is-the-difference-between-form-data-x-www-form-urlencoded-and-raw-in-the-p)
- [fetch-missing-boundary-in-multipart-form-data-post](https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post)



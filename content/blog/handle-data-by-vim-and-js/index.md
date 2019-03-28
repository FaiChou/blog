---
title: "记一次数据处理"
date: "2018-07-02"
category: "Dev"
emoji: "👨🏼‍💻"
---

一批[这样的数据](https://github.com/williambao/cities/blob/master/cities.json)

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1530540635405.png" width="600"/>

要对其进行处理:

- 删除拼音字段和值

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1530540716994.png" width="552"/>

- 将其按省(province)分组

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1530540761262.png" width="408"/>

#### 使用vim替换所有拼音字段

```bash
:%s/,\s"pinyin":..\w*"//
```

以上是正确的替换方式, 并且进行了好多次错误的尝试:

```bash
s/"pinyin"[^,]*,/ # 错误
s/"pinyin"...[a-z]+"/ # 错误
```

这些正则表达式有些可以在[在线正则网站](https://regexr.com/)上测试通过,
可放到vim(sed)中却不能使用, 原因是:

> On OSX, sed by default uses basic REs. You should use sed -E if you want to use modern REs, including the "+" one-or-more operator.

> in old, obsolete re `+` is an ordinary character (as well as `|`, `?`)



#### 使用node将去除pinyin字段的数据再组合封装

封装代码如下:

```javascript
function trans() {
  const newCities = [];
  cities.forEach(c => {
    const id = newCities.findIndex(nc => nc.province === c.province);
    if (id === -1) {
      newCities.push({
        province: c.province,
        cities: [{code: c.code, city: c.city}],
      });
    } else {
      newCities[id].cities.push({
        code: c.code,
        city: c.city,
      });
    }
  });
  return newCities;
}
```

其中使用`console.log`的形式再配合pipe将输出导入到`after.js`中的结果是这样的:

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1530541245978.png" width="600"/>

所以只好用`fs`导入到json中:

```javascript
const fs = require('fs');
const after = trans();
fs.writeFile('./after.json', JSON.stringify(after) , 'utf-8');
```

## 参考链接

- [sed](https://coolshell.cn/articles/9104.html)
- [regex](https://github.com/zeeshanu/learn-regex/blob/master/README-cn.md)
- [regexQ&A](https://stackoverflow.com/questions/1227174/sed-on-os-x-cant-seem-to-use-in-regexps)
- [regexQ&A](https://stackoverflow.com/questions/4453760/how-to-escape-plus-sign-on-mac-os-x-bsd-sed/4453890)


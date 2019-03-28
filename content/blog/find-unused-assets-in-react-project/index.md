---
title: "Find Unused Assets in Project"
date: "2018-10-22"
category: "dev"
emoji: "⚙️"
---


## 步骤

找出 RN 项目中所有没有使用到的资源文件:

1. 找出资源文件夹下所有资源
2. 找出所有代码文件中引用资源地方
3. 格式化 [1]() 和 [2]()
4. diff [1]() 和 [2]()

## 找出资源文件

最好将图片放到统一的文件夹下(`src/img`)

```bash
$ find PROJECT_ROOT/src/img -type f > ~/Downloads/org
```

## 找出所有代码资源引用

最好使用 `require` 代替图片 `import`

```bash
$ find . -type f -name "*.ts" -or -name "*.tsx" -or -name "*.js" -not -path "*node_modules*" | xargs grep "require(" > ~/Downloads/key
```

- 代码有 ts, tsx 和 js
- 使用 `grep` 获取包含 `requre(` 的行

## 格式化 [1]() 和 [2]()

#### 格式化 [1]()

org:

```
./t.png
./b/bb.png
./a.jpg
./c/cc.mp4
```

去掉头:

```bash
$ gsed -i "s/\.\///g" org
```

排序:

```bash
$ sort org -u > org.sorted
```

#### 格式化 [2]()

key:

```
file1.ts   blablarequire('../img/a.png')adlak
file2.tsx   blablarequire('../img/b.jpg') blabla
file3.js   blablarequire('../img/c/c.png') blabla require('../img/c/a.mp4')
```

获取关键字符(`img/abc.png`):

```bash
$ grep -oE "img\/.*?\.(png|jpg|mp4)" key > key2
```

key2:

```
img/a.png
img/b.jpg
img/c/c.png
img/c/a.mp4
```

删掉前缀:

```bash
$ gsed -i "s/img\///g" key2
```

排序:

```bash
$ sort key2 -u > key2.sorted
```

## diff

```bash
$ diff org.sorted key2.sorted > unused.file
```

unused.file

```
1d0
< .DS_Store
8d6
< arrow_up.png
14d11
< ask_icon.png
20d16
< bang.png
25d20
< billing_normal.png
27d21
< bindphone.png
31d24
< cancel-gray.png
34,35d26
< chat.png
< company/.DS_Store
37d27
< company/call.png
39d28
< company/friendCircle.png
41d29
< company/link.png
52d39
< company/share.png
54d40
< company/wechat.png
61,63d46
< cpy_call.png
< cpy_gz.png
< cpy_more.png
```


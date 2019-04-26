---
title: "gitignore递归排除某类文件夹"
date: "2018-05-10"
category: "dev"
emoji: "⛱"
---

#### 问题描述

[xcode-git-cant-ignore-all-xcodeproj-xcuserdata-folders](https://stackoverflow.com/questions/50264876/xcode-git-cant-ignore-all-xcodeproj-xcuserdata-folders)

在一个rn项目中, 每次打开Xcode就会自动**生成/修改**一些`xcuserdata/`下文件, 将这些类型文件添加到ignore中也无效, 清除git缓存还是不行. 最终才发现是gitignore配置有问题.

Git支持:

- 匹配 `node_modules` 目录下但除去 `node_modules/foo/` 的内容

```
node_modules/
!node_modules/foo/
```
- 匹配所有json文件(递归的!)

```
*.json
```

- 匹配当前目录下的json文件(子目录下无效)

```
/*.json
```

Git不支持这种类型的匹配规则: `*.xcodeproj/xcuserdata/`.

> - If the pattern does not contain a slash /, Git treats it as a shell glob pattern and checks for a match against the pathname relative to the location of the .gitignore file (relative to the toplevel of the work tree if not from a .gitignore file).

> - Otherwise, Git treats the pattern as a shell glob: "*" matches anything except "/", "?" matches any one character except "/" and "[]" matches one character in a selected range. See fnmatch(3) and the FNM_PATHNAME flag for a more detailed description.

> - A leading slash matches the beginning of the pathname. For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".

> Two consecutive asterisks ("**") in patterns matched against full pathname may have special meaning:

> - A leading "**" followed by a slash means match in all directories. For example, "**/foo" matches file or directory "foo" anywhere, the same as pattern "foo". "**/foo/bar" matches file or directory "bar" anywhere that is directly under directory "foo".

> - A trailing "/**" matches everything inside. For example, "abc/**" matches all files inside directory "abc", relative to the location of the .gitignore file, with infinite depth.

> - A slash followed by two consecutive asterisks then a slash matches zero or more directories. For example, "a/**/b" matches "a/b", "a/x/b", "a/x/y/b" and so on.

> - Other consecutive asterisks are considered invalid.

那么如果有很深的目录结构, 有许多要排除的`xcuserdata/`文件夹, 比如下面这个图, 如何处理呢?
(要排除红色的文件夹下文件)


#### 项目结构

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1525927066535.png" width="632"/>

#### Solution1

对每个路径下文件夹都添加各自的配置

```
ios/ECDeviceFile/Project/AddressBook/AddressBook/AddressBook.xcodeproj/xcuserdata/
```

#### Solution2

使用规则: `MyPrject/WebApp/Scripts/special/**/*.js`:

```
ios/**/*.xcodeproj/xcuserdata/
```

或者这样:

```
**/xcuserdata/
```

#### Solution3

在每个要排除`.xcodeproj`路径下一级添加独立.gitignore :

```
# in ios/ECDeviceFile/Project/AddressBook/AddressBook/AddressBook.xcodeproj/
xcuserdata/
```



#### .gitignore旧配置(关于Xcode部分)

```
### Xcode Patch ###
*.xcodeproj/*
!*.xcodeproj/project.pbxproj
!*.xcodeproj/xcshareddata/
!*.xcworkspace/contents.xcworkspacedata
/*.gcno

*.xcodeproj/xcuserdata/

```

#### .gitignore新配置(关于Xcode部分)

```
### Xcode Patch ###
*.xcodeproj/*
!*.xcodeproj/project.pbxproj
!*.xcodeproj/xcshareddata/
!*.xcworkspace/contents.xcworkspacedata
/*.gcno

*.xcodeproj/xcuserdata/

ios/ECDeviceFile/Project/AddressBook/AddressBook/AddressBook.xcodeproj/xcuserdata/
ios/ECDeviceFile/Project/AppModel/AppModel/AppModel.xcodeproj/xcuserdata/
ios/ECDeviceFile/Project/AppModel/CoreModel/CoreModel.xcodeproj/xcuserdata/
ios/ECDeviceFile/Project/BaseComponent/BaseComponent/BaseComponent.xcodeproj/xcuserdata/
ios/ECDeviceFile/Project/Board/Board/Board.xcodeproj/xcuserdata/
ios/ECDeviceFile/Project/Common/Common/Common.xcodeproj/xcuserdata/
ios/ECDeviceFile/Project/Dialing/Dialing/Dialing.xcodeproj/xcuserdata/
ios/ECDeviceFile/Project/FriendsCircle/FriendsCircle/FriendsCircle.xcodeproj/xcuserdata/
ios/ECDeviceFile/Project/FusionMeeting/FusionMeeting/FusionMeeting.xcodeproj/xcuserdata/
ios/ECDeviceFile/Project/Rest/Rest/Rest.xcodeproj/xcuserdata/
ios/ECDeviceFile/Project/UserCenter/UserCenter/UserCenter.xcodeproj/xcuserdata/

```

#### 参考链接

- [how-to-gitignore-files-recursively](https://stackoverflow.com/questions/16550688/how-to-gitignore-files-recursively)
- [cant-ignore-userinterfacestate-xcuserstate](https://stackoverflow.com/questions/6564257/cant-ignore-userinterfacestate-xcuserstate)
- [ignore-files-that-have-already-been-committed-to-a-git-repository](https://stackoverflow.com/questions/1139762/ignore-files-that-have-already-been-committed-to-a-git-repository)
- [correctly-ignore-all-files-recursively-under-a-specific-folder-except-for-a-spec](https://stackoverflow.com/questions/17812717/correctly-ignore-all-files-recursively-under-a-specific-folder-except-for-a-spec)
- [what-pattern-does-gitignore-follow](https://stackoverflow.com/questions/34901807/what-pattern-does-gitignore-follow/34960504#34960504)
- [regex-like-shell-glob-patterns-for-gitignore](https://stackoverflow.com/questions/19391327/regex-like-shell-glob-patterns-for-gitignore)

#### PS.

> `*` matches anything except `/`

为何官网说`*`可以匹配除`/`外所有字符, 但是`*.json`却能递归匹配?比如`/a/b/c.json`?

git遵循[fnmatch](http://unixhelp.ed.ac.uk/CGI/man-cgi?fnmatch%203).

用python验证通过的都可以匹配:

```python
from fnmatch import fnmatch
pattern = "*.json"
files = ["a.json", "abc/.json", "a/b/c.json", "d/a.json"]

for file in files:
    print(file, fnmatch(file, pattern))

```

```
a.json True
abc/.json True
a/b/c.json True
d/a.json True
[Finished in 0.1s]
```


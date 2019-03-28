---
title: "Create Alfred Workflow"
date: "2017-09-24"
category: "Dev"
description: "alfred workflow"
emoji: "👨🏼‍💻"
---



### 简介

[Alfred](https://www.alfredapp.com/)是macOS下提升效率最高的工具。

常用的功能有：

1. 历史粘贴板（文字都是默认无格式的）

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1506179496530.png" width="600"/>



2. 有道快速翻译workflow:

   <img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1506179687942.png" width="600"/>

3. 股票查询workflow：

   <img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1506179787946.png" width="600"/>

4. markdown图片自动上传七牛workflow：复制任意一张图片，通过组合快捷键`control+command+v`自动上传到绑定的七牛存储空间，上传成功后粘贴板为图片七牛链接。



### 做一个workflow

首先workflow是Alfred的高级版功能，通过`option+space`呼出alfred后就可以对mac为所欲为了。这么神奇的技巧必须掌握！

那么就做一个简单的随机密码生成器。不要计较随机生成的天文密码如何记住，有些网站密码真的不必记住，只需要浏览器或者1password帮你记住就ok。

设计的最终效果是：

1. `option+space`呼出Alfred
2. 键入pg(即password generator)随机生成6个密码，长度6，8，10...16
3. 选择任一个密码，回车，复制密码到当前窗口输入框

密码生成用python实现，当然任何脚本都可以辅助alfred，包括shell，php，python，ruby，js等。随机生成的高强度密码字符集包括数字，字母大小写，字符。



### 第一步

点击下方加号，创建一个空白的workflow，输入基本信息。

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1506181345549.png" width="600"/>

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1506181631614.png" width="600"/>

### 第二步



<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1506181752514.png" width="400"/>

在空白板上右键，actions->run script：

输入如下：

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1506181658677.png" width="600"/>



1： 基本信息，keyword就是召唤出你的神兽的快捷键。本project不需要参数。

2：选择在bash下执行命令，执行的命令就是3

3：运行我们的python代码

4：密码左侧的图标

5：打开当前workflow文件夹



### 第三步



去[这里](https://github.com/deanishe/alfred-workflow/releases/tag/v1.24)下载workflow代码包，移动到workflow文件夹下。

创建一个version文件，内容是1.0。

把选择好的icon.png移动到workflow文件夹下。

将代码文件password_gen.py移动到文件夹下。

看起来是这样的：

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1506182216078.png" width="539"/>



### 第四步



写代码，无非就是生成6个密码，密码要同时包含数字字符和大小写字母，并且按照workflow方式导出来。代码如下，很easy，无需再解释。

```python
# -*- coding:utf-8 -*-

import sys
from os import urandom
from random import choice
from workflow import Workflow, web

reload(sys)
sys.setdefaultencoding('utf-8')

char_set = {
            'small': 'abcdefghijklmnopqrstuvwxyz',
            'nums': '0123456789',
            'big': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            'special': '^!\$%&/()=?{[]}+~#-_.:,;<>|\\'
            }

def generate_pass(length=21):
    """Function to generate a password"""
    password = []
    while len(password) < length:
        key = choice(char_set.keys())
        a_char = urandom(1)
        if a_char in char_set[key]:
            if check_prev_char(password, char_set[key]):
                continue
            else:
                password.append(a_char)
    return ''.join(password)

def check_prev_char(password, current_char_set):
    """Function to ensure that there are no consecutive
    UPPERCASE/lowercase/numbers/special-characters."""
    index = len(password)
    if index == 0:
        return False
    else:
        prev_char = password[index - 1]
        if prev_char in current_char_set:
            return True
        else:
            return False

def main(wf):
    for n in range(6):
        x = 2 * n + 6
        p = generate_pass(x)
        arg = '$%'.join([p])
        wf.add_item(
            title=p,
            subtitle='length:' + str(x),
            valid=True,
            arg=arg)
    wf.send_feedback()
if __name__ == '__main__':
    wf = Workflow()
    sys.exit(wf.run(main))

```



注意一点，这里的wf.add_item()的参数，title就是要显示的密码，subtitle可以随便写，这里我就解释密码的程度，valid是否有效，arg是一个很重要的参数，当我们回车操作时候，会捕捉到这个参数。下一步就是建立一个回车拷贝的操作，用到的就是这个参数。



### 第五步



继续右键选择建立一个拷贝到剪切板的输出，建完后是下面这个样子，再将两个模块用线连起来。

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1506182525847.png" width="600"/>

这样就大功告成了！！🎉🎉🎉🎉



### 最后



<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1506182678991.png" width="600"/>

点击这个长得像bug的东西进行调试，一切正常！！🎉🎉🎉🎉

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1506182782835.png" width="700"/>



如果想要导出给同事用，点击这个按钮：

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1506182871970.png" width="600"/>



可以在[这里](https://github.com/FaiChou/PasswordGen_Alfred)找到我上传的workflow安装使用。



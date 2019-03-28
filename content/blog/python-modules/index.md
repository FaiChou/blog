---
title: "python模块/包"
date: "2017-11-24"
category: "Dev"
emoji: "👨🏼‍💻"
---

**关键字**: `python3`, `import`, `module vs package`, `sys.path`, `relative/absolute import`.


## 模块 vs 包

python项目中，一个.py文件就是一个模块，模块可以被其他模块导入，模块里的所有方法、类、变量等都会被引用到新模块，python语言没有好的方法可以限制模块成员私有。习惯上模块里以单/双下划线开始的变量或方法称为私有变量，而类似`__name__`这样又以双下划线结尾的变量属于特殊变量，有特殊用途，比如`__dict__`用作展示类或实例的所有属性, `__file__`是当前脚本的路径。

```python3
# ~/a.py
print('Hello world!')

# ~/b.py
import a
```

结果会打印`Hello world!`，可以认为import模块就相当于将模块里代码复制到新模块里。


包含`__init__.py`文件夹称为包，包的名字就是文件夹的名字。


## 模块的搜索路径

当我们import某一模块，python解释器会根据以下搜索此模块路径：

1. 当前目录
2. 内置模块目录
3. 第三方模块安装路径

这些路径都可以通过sys.path来看到。

```python3
import sys
print(sys.path)

/usr/local/Cellar/python3/3.6.3/Frameworks/Python.framework/Versions/3.6/lib/python36.zip
/usr/local/Cellar/python3/3.6.3/Frameworks/Python.framework/Versions/3.6/lib/python3.6
/usr/local/Cellar/python3/3.6.3/Frameworks/Python.framework/Versions/3.6/lib/python3.6/lib-dynload
/usr/local/lib/python3.6/site-packages
```

我们可以通过两种方法添加自己的搜索路径：

- 直接修改sys.path

```python3
>>> import sys
>>> sys.path.append('~/Package')
```

这种方法只是在运行时修改，新开一个python解释器或者运行其他py程序这个路径就会失效。

- 设置环境变量PYTHONPATH

```
在~/.zshrc中添加如下
export PYTHONPATH=${PYTHONPATH}:${HOME}/foo 
```

当然也可以将自己的~/foo软连接到site-packages目录下

```
ln -s ~/foo /usr/local/lib/python3.6/site-packages
```


## absolute/relative import

import有好多用法，比如：

```python
import a
from a import *
from a import func_a, var_a, class_a
from pkg_a import a
from pkg_a.a import * # 确保pkg_a在PYTHONPATH
from ..pkg_a import b
```

这里有相对导入和绝对导入。
python解释器在执行文件时，会将当前文件添加一些特殊变量，比如`__name__`，当执行本文件时候，`__name__`就被赋值为`__main__`，当被导入时，`__name__`就是它包的名字。
在relative导入中，如果pkg_a不在PYTHONPATH下，就会报`Attempted relative import in non-package`错误。这里就是因为相对导入会将导入模块的`__name__`赋值为`__main__`，而不是本身文件名。

总体来所不要使用相对导入，用绝对导入吧。


## __init__.py

空的`__init__.py`就可以让文件夹成为包。如果包有多级目录，想通过导入包，就可以直接引用某一目录下某一模块的变量、方法、类，那么就需要给`__init__.py`配置。

比如[这个库](https://github.com/kennethreitz/envoy)。

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/markdown/1511594759317.png" width="600"/>

在`__init__.py`中import了core模块的某些方法，比如`run`方法，那么当我们用时候直接:

```
import envoy
envoy.run(*argv)
```

即可食用。






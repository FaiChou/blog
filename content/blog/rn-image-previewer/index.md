---
title: "create a react native image previewer"
date: "2018-05-05"
category: "dev"
emoji: "🎯"
---

## [ImagePreviewer](https://github.com/FaiChou/ImagePreviewer) -- `A react native image previewer !`

![image-previewer-demo](https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/qiniu/image-previewer-demo.gif)


#### 安装

```
npm install --save rc-image-previewer

# or

yarn add rc-image-previewer
```

#### 使用

```
import ImagePreviewer from 'rc-image-previewer';

const { width } = Dimensions.get('window');

export default class App extends React.Component {
  render() {
    const ImgWidth = width;
    const ImgHeight = ImgWidth * 0.6;
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <ImagePreviewer
          source={MountHuang}
          style={{
            width: ImgWidth,
            height: ImgHeight,
          }}
          resizeMode="stretch"
        />
      </View>
    );
  }
}
```

#### API

API name       | Usage
---------------|----------------------------------------
style          | The style of element.(Optional)
source         | The image source, same as <Image /> source.
resizeMode     | The image resize mode, default is contain.(Optional)


## 发布流程

1. 清理项目, 将主要文件放到根目录下export出去
2. 将项目托管到GitHub
3. 在[npm官网](https://www.npmjs.com/)注册账号
4. 在项目目录下登录npm账号: `$ npm adduser`
5. 发布项目: `$ npm publish`
6. 确保`~/.npmrc`文件是官方源: `registry=https://registry.npmjs.org/`
7. 更新代码时需要先提交到GitHub, 再 `$ npm version minor`, 最后再 `$ npm publish`
8. 1.2.3: `major minor patch`分别为1, 2, 3, 更新会自动更新相对应的版本
9. 规范: 大的API改动需要更新major, 小的bug修复需要更新minor, 更新图标文件/readme等需要更新patch
10. 到[Shields](http://shields.io/)里找几个比如npm版本/MIT协议的徽章
11. travis持续集成配置
12. 使用.npmignore排除Example文件夹 (和.gitignore相同)


## TODO

1. 双指放大缩小图片([困住的问题](https://github.com/facebook/react-native/issues/14295))
2. ~~改用`Coroutine Event Loops`~~


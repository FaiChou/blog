---
title: "Why Not RN"
date: "2018-09-19"
category: "dev"
emoji: "👣"
---

RN的使用已经到了瓶颈, 劣势愈发明显.

## RN的短处

1. RN可以使用热更新来快速更新app内容, 但是使用 `codepush` 不能上架 store, 只适合企业使用
2. 分包机制不明显, 业务上的分包与开发上的分包混乱, 开发上的jsbundle包可以分成工具包/业务包/第三方包等, 配合热更新减少更新包的大小. 但是业务上经常会滥用分包来达到app融合的功能.
3. 一个合格的RN开发人员必须对iOS和安卓都比较熟悉, 一个安卓开发人员使用RN, 需要了解iOS的打包, Xcode配置等一系列知识, 一个iOS开发人员使用RN也需要了解一些安卓配置.

## 记录RN的坑

#### 1 [issues/11813](https://github.com/facebook/react-native/issues/11813)

Xcode新建打包配置(Staging), 编译时候会报错, 原因是Xcode编译React时候会将React的headers拷贝到Release编译目录下, 导致找不到头文件, 其实按常理应该被拷贝到Staging目录下, 但是Xcode的特性(or bug)编译子模块时候只有Debug和Release两种模式, 找不到第三种就会使用Release模式.
解决方案也很简单: 

> changed Staging Build Products Path value from `$(BUILD_DIR)/$(CONFIGURATION)$(EFFECTIVE_PLATFORM_NAME)` to `$(BUILD_DIR)/Release$(EFFECTIVE_PLATFORM_NAME)`


#### 2. 升级RN困难

旧项目一直保留在0.50版本, 升级rn, 加上pod上的错误, 使之困难重重.

#### 3. 各种 `RCT*.h` 找不到

会经常遇到[这种问题](https://github.com/facebook/react-native/issues/20762), 要么添加一个`header search path`, 要么就需要动手写 `podspec` 来搞 `node_modules` 里的私有库. 不管怎么搞, 都是对第三方库的一个更改, 一般不会将第三方库放到git上, 所以就需要在重要的文件中记录下操作, 比如 `README.md`, 以后每次 `yarn` 或者打包都需要检查下, 费劲~

#### 4. 'config.h' file not found

https://github.com/facebook/react-native/issues/14382

进入 `node_modules/third-party/glog-0.3.4` 下执行 `../../scripts/ios-configure-glog.sh` , 重新编译glog

#### 5. libfishhook.a cannot be found

https://github.com/facebook/react-native/issues/19569

在Xcode找到 `/Libraries` 下 `RCTWebSocket.xcodeproj` , 删掉 `Build Phases` 下 `Link Binary With Libraries` 中的 `libfishhook.a`, 然后再次添加上 `libfishhook.a`

#### 6. dva项目中升级react-navigation困难

目前项目中使用react-navigation版本是2.2.0, 依赖于0.8.0的react-native-safe-area-view, react-navigation又依赖于0.5.0的react-navigation-tabs, 而react-navigation-tabs又依赖于0.7.0的react-native-safe-area-view.

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/1541403481333.png" width="500" />

所以在node_modules里是这样的结构:

```
node_modules:
  react-native-safe-area-view@0.8.0
  react-navigation@2.2.0
  react-navigation-tabs@0.5.0
    node_modules:
      react-native-safe-area-view@0.7.0
```

问题出在适配iPhone新设备, X和Xs都没问题, 但是Xr和XsMax会有适配问题, 所以有~~三~~两个方案解决:

##### [一] 升级react-native-safe-area-view到最新版本0.11.0 (失败)

在根目录下的package.json添加`react-native-safe-area-view: 0.11.0`. 证实了这个方法是无用的, 因为这样做node_modules下会存在3个版本的safe-area了, 并且react-navigation与react-navigation-tabs都不会引用最新的.


##### [二] 升级react-navigation (失败)

这是一个煎熬的过程, 因为项目使用了dva框架, 并且管理了react-navigation的state, 每一次路由更新会dispatch自定义的action, 算得上是redux中的middleware, 但仅仅使用react-navigation-redux-helper来协助完成此操作.

```
  const navigationPropConstructor = createNavigationPropConstructor('root');
    const navigation = navigationPropConstructor(
      (action) => {
        if (actions.indexOf(action.type) !== -1) {
          this.props.dispatch({ type: 'nav/apply', payload: action });
        } /* and so on. */
      },
      this.props.nav,
    );
    return (
      <AppNavigator navigation={navigation} />
    );
```

使用了1.x helper版本的api: `createNavigationPropConstructor` 与 `initializeListeners`.

进行navigation升级时, 它不支持1.x版本, 所以只能强行升级helper, 但是在2.x版本的helper中 `initializeListeners` 与 `createNavigationPropConstructor` 被遗弃了, 新的api只提供了 `createReactNavigationReduxMiddleware` 与 `reduxifyNavigator`, 在目前情况下, 这俩api不满足要求.

##### 手动更改 safe-area 的代码

每次 yarn, 都要更改safe-area的源码, 并且是两处. 很糟糕的办法, 而且很无奈. 可以用sed写个脚本, 每次yarn后都执行一遍, 自动更改safe-area源码.





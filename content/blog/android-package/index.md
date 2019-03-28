---
title: "安卓打包"
date: "2018-11-28"
category: "dev"
description: "android package summary"
emoji: "📱"
---

## 命令

使用命令 `gradlew` 进行编译/clean/打包等操作, `gradlew` 是 `gradle + wrapper`, 构建脚本采用了 `Groovy`.

RN 项目中, `android/gradle/wrapper/gralde-wrapper.properties` 中声明了它指向的目录和版本. 只要下载成功即可用 `grdlew wrapper` 的命令代替全局的 gradle 命令.

- `./gradlew -v` 查看版本

- `./gradlew clean` 清除build文件夹

- `./gradlew build` 打包(所有variant)

- `./gradlew assemble` 打包(所有variant)

- `./gradlew assembleDebug` 编译并打包debug

- `./gradlew assembleRelease` 编译并打包release


```bash
# assemble|**ProductFlavour**|**BuildType**
$ ./gradlew assembleBetaRelease
```

```bash
#--variant=<productFlavour><BuildType>
$ react-native run-android --variant=devDebug
```

```bash
$ ./gradlew assembleDebug -Pcustom=true
```

可以在 build.gradle 中判断自定义参数:

```javascript
if (project.hasProperty('custom')){

}
```

执行编译会去执行各个 gradle 中的脚本, 比如说 `app` 下的 `build.gradle` 又回依赖 rn 的 gradle:

```
apply from: "../../node_modules/react-native/react.gradle"
```

gradle 可以配置打包参数, 构建编译类型, 配置 flavors, 新建 task.


可以使用 `./gradlew tasks` 查看所有支持的的 tasks:

```
Android tasks
androidDependencies
signingReport
sourceSets

Build tasks
assemble - Assembles all variants of all applications and secondary packages.
assembleAndroidTest - Assembles all the Test applications.
assembleDebug - Assembles all Debug builds.
assembleRelease - Assembles all Release builds.
build - Assembles and tests this project.
buildDependents - Assembles and tests this project and all projects that depend on it.
buildNeeded - Assembles and tests this project and all projects it depends on.
clean - Deletes the build directory.
cleanBuildCache - Deletes the build cache directory.
compileDebugAndroidTestSources
compileDebugSources
compileDebugUnitTestSources
compileReleaseSources
compileReleaseUnitTestSources
mockableAndroidJar

Build Setup tasks
init - Initializes a new Gradle build.

Help tasks
buildEnvironment - Displays all buildscript dependencies declared in root project 'demo2'.
components
dependencies - Displays all dependencies declared in root project 'demo2'.
dependencyInsight - Displays the insight into a specific dependency in root project 'demo2'.
dependentComponents - Displays the dependent components of components in root project 'demo2'. [incubating]
help - Displays a help message.
model
projects - Displays the sub-projects of root project 'demo2'.
properties - Displays the properties of root project 'demo2'.
tasks - Displays the tasks runnable from root project 'demo2' (some of the displayed tasks may belong to subprojects).


Install tasks
installDebug - Installs the Debug build.
installDebugAndroidTest - Installs the android (on device) tests for the Debug build.
uninstallAll - Uninstall all applications.
uninstallDebug - Uninstalls the Debug build.
uninstallDebugAndroidTest - Uninstalls the android (on device) tests for the Debug build.
uninstallRelease - Uninstalls the Release build.

React tasks
bundleDebugJsAndAssets - bundle JS and assets for Debug.
bundleReleaseJsAndAssets - bundle JS and assets for Release.
copyDebugBundledJs - copy bundled JS into Debug.
copyReleaseBundledJs - copy bundled JS into Release.


Verification tasks
check - Runs all checks.
connectedAndroidTest
connectedCheck - Runs all device checks on currently connected devices.
connectedDebugAndroidTest
deviceAndroidTest
deviceCheck - Runs all device checks using Device Providers and Test Servers.
lint - Runs lint on all variants.
lintDebug - Runs lint on the Debug build.
lintRelease - Runs lint on the Release build.
lintVitalRelease - Runs lint on just the fatal issues in the release build.
test - Run unit tests for all variants.
testDebugUnitTest - Run unit tests for the debug build.
testReleaseUnitTest - Run unit tests for the release build.

```



使用 `./gradlew build --dry-run` 来查看编译会执行哪些tasks(会skip,并不会真正执行)

```
➜  android ./gradlew build --dry-run
:app:preBuild SKIPPED
:app:preDebugBuild SKIPPED
:app:compileDebugAidl SKIPPED
:app:compileDebugRenderscript SKIPPED
:app:checkDebugManifest SKIPPED
:app:generateDebugBuildConfig SKIPPED
:app:prepareLintJar SKIPPED
:app:mainApkListPersistenceDebug SKIPPED
:app:bundleDebugJsAndAssets SKIPPED
:app:generateDebugResValues SKIPPED
:app:generateDebugResources SKIPPED
:app:mergeDebugResources SKIPPED
:app:createDebugCompatibleScreenManifests SKIPPED
:app:processDebugManifest SKIPPED
:app:splitsDiscoveryTaskDebug SKIPPED
:app:processDebugResources SKIPPED
:app:generateDebugSources SKIPPED
:app:javaPreCompileDebug SKIPPED
:app:compileDebugJavaWithJavac SKIPPED
:app:compileDebugNdk SKIPPED
:app:compileDebugSources SKIPPED
:app:mergeDebugShaders SKIPPED
:app:compileDebugShaders SKIPPED
:app:generateDebugAssets SKIPPED
:app:mergeDebugAssets SKIPPED
:app:copyDebugBundledJs SKIPPED
:app:transformClassesWithDexBuilderForDebug SKIPPED
:app:transformDexArchiveWithExternalLibsDexMergerForDebug SKIPPED
:app:transformDexArchiveWithDexMergerForDebug SKIPPED
:app:mergeDebugJniLibFolders SKIPPED
:app:transformNativeLibsWithMergeJniLibsForDebug SKIPPED
:app:processDebugJavaRes SKIPPED
:app:transformResourcesWithMergeJavaResForDebug SKIPPED
:app:validateSigningDebug SKIPPED
:app:packageDebug SKIPPED
:app:assembleDebug SKIPPED
:app:preReleaseBuild SKIPPED
:app:compileReleaseAidl SKIPPED
:app:compileReleaseRenderscript SKIPPED
:app:checkReleaseManifest SKIPPED
:app:generateReleaseBuildConfig SKIPPED
:app:mainApkListPersistenceRelease SKIPPED
:app:bundleReleaseJsAndAssets SKIPPED
:app:generateReleaseResValues SKIPPED
:app:generateReleaseResources SKIPPED
:app:mergeReleaseResources SKIPPED
:app:createReleaseCompatibleScreenManifests SKIPPED
:app:processReleaseManifest SKIPPED
:app:splitsDiscoveryTaskRelease SKIPPED
:app:processReleaseResources SKIPPED
:app:generateReleaseSources SKIPPED
:app:javaPreCompileRelease SKIPPED
:app:compileReleaseJavaWithJavac SKIPPED
:app:compileReleaseNdk SKIPPED
:app:compileReleaseSources SKIPPED
:app:lintVitalRelease SKIPPED
:app:mergeReleaseShaders SKIPPED
:app:compileReleaseShaders SKIPPED
:app:generateReleaseAssets SKIPPED
:app:mergeReleaseAssets SKIPPED
:app:copyReleaseBundledJs SKIPPED
:app:transformClassesWithDexBuilderForRelease SKIPPED
:app:transformDexArchiveWithExternalLibsDexMergerForRelease SKIPPED
:app:transformDexArchiveWithDexMergerForRelease SKIPPED
:app:mergeReleaseJniLibFolders SKIPPED
:app:transformNativeLibsWithMergeJniLibsForRelease SKIPPED
:app:processReleaseJavaRes SKIPPED
:app:transformResourcesWithMergeJavaResForRelease SKIPPED
:app:packageRelease SKIPPED
:app:assembleRelease SKIPPED
:app:assemble SKIPPED
:app:lint SKIPPED
:app:preDebugUnitTestBuild SKIPPED
:app:javaPreCompileDebugUnitTest SKIPPED
:app:compileDebugUnitTestJavaWithJavac SKIPPED
:app:mockableAndroidJar SKIPPED
:app:processDebugUnitTestJavaRes SKIPPED
:app:testDebugUnitTest SKIPPED
:app:preReleaseUnitTestBuild SKIPPED
:app:javaPreCompileReleaseUnitTest SKIPPED
:app:compileReleaseUnitTestJavaWithJavac SKIPPED
:app:processReleaseUnitTestJavaRes SKIPPED
:app:testReleaseUnitTest SKIPPED
:app:test SKIPPED
:app:check SKIPPED
:app:build SKIPPED
```


## Android Studio

Android Studio 本质上其实还是 Intellij IDEA.

> 点击Run按钮对于IDEA来说，其实是执行一个事先配置好的 [ Run/Debug Configuration ]，对于Android项目来说，往往是一个名为 [ Android App ] 的 Configuration。按照IntellIJ SDK约定，一个Configuration的执行包括俩个过程：RunState 的创建 和 执行。

> 点击 Run 按钮，就相当于执行了一次 Gradle Task，一般来说，是assembleDebug或者assembleRelease。


> - 将代码打包成APK，这里面涉及到编译、打包、签名、混淆等；
> - 安装APK到设备；
> - 在设备上运行APK。


> 如果单元测试的代码有问题，直接Run是不会检查的。但是Make Project会。因为Run的时候仅执行了assembleDebug，但是跑单元测试时需要执行 assembleDebug和assembleDebugAndroidTest。



#### **varient = flavors ✖️ buildTypes**

##### Build Type

分为 debug 和 release

##### Product Flavor

这个概念主要是为了满足如下需求：同一份代码要打多个包，例如收费 pay 和免费 free，逻辑上有一些小区别，又不想通过逻辑判断这种丑陋的方式。或者你要实现所谓多渠道打包。

- gradle 变动就需要重新 sync 下. 

- make 是指在上次编译的基础上, 对修改过的文件进行编译

- clean 是指清理编译缓存

- rebuild 清理缓存, 重新编译

- build apks 生成debug apk

- generate signed apk 生成签名的release apk

只要是编译就会生成 debug apk, 不信删掉 `app-debug.apk` 点击 make, 完成再去 `android/app/build/outputs/apk/debug` 看下.



## RN

在 `react.gradle` 中定义了几个 task

- bundleDebugJsAndAssets
- bundleReleaseJsAndAssets
- copyDebugBundledJs
- copyReleaseBundledJs

打包js和图片资源, 拷贝至apk指定目录.

其实运行debug时候, 并不会去执行打包js, 只会当app启动时候再打包, 通过数据线传输到手机, 或者传输到chrome执行, 执行结果再代理到手机.

有个未知问题:

项目中(RN 0.55)使用android studio打release包, 必须先手动打js包, 再打apk包, 否则打出的apk会找不到jsbundle.

但是新建的demo中, 直接打apk包, 就会执行打js包, 拷贝到apk.

## 配置安卓环境



```
buildTypes {
        release {
            signingConfig signingConfigs.release
            aaptOptions.cruncherEnabled = false
            aaptOptions.useNewCruncher = false
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
            buildConfigField "String", "CODEPUSH_KEY", '"abc"'
            manifestPlaceholders = [
                APP_NAME: 'app',
                APP_ICON: '@mipmap/logo'
            ]
        }
        betaRelease {
            signingConfig signingConfigs.release
            aaptOptions.cruncherEnabled = false
            aaptOptions.useNewCruncher = false
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
            buildConfigField "String", "CODEPUSH_KEY", '"def"'
            manifestPlaceholders = [
                APP_NAME: 'app-beta',
                APP_ICON: '@mipmap/logo_beta'
            ]
        }
        debug {
            buildConfigField "String", "CODEPUSH_KEY", '""'
            applicationIdSuffix ".debug"
            manifestPlaceholders = [
                APP_NAME: 'app-debug',
                APP_ICON: '@mipmap/logo_debug'
            ]
        }
    }
```

在代码中可以使用变量 `buildConfigField`:

```
new CodePush(BuildConfig.CODEPUSH_KEY,getApplicationContext(),BuildConfig.DEBUG)
```

在 `AndroidManifest.xml` 使用 `manifestPlaceholders`:

```
<application
        tools:replace="android:label"
        android:name=".MainApplication"
        android:allowBackup="false"
        android:icon="${APP_ICON}"
        android:label="${APP_NAME}"
        android:theme="@style/AppTheme">
        
        <activity
            android:name=".MainActivity"
            android:configChanges="keyboard|keyboardHidden|orientation|screenSize"
            android:label="${APP_NAME}"
            
        <meta-data
            android:name="JPUSH_APPKEY"
            android:value="${JPUSH_APPKEY}" />
        <meta-data
            android:name="JPUSH_CHANNEL"
            android:value="${APP_CHANNEL}" />
```


## 打包不同 flavor

```
android {
  productFlavors {
    xiaomi {
      applicationId "com.demo2.xiaomi"
      signingConfig signingConfigs.release
    }
    huawei {
      applicationId "com.demo2.huawei"
      signingConfig signingConfigs.release
    }
    meilan {
      applicationId "com.demo2.meilan"
      signingConfig signingConfigs.release
    }
  }
}
```

使用 `./gradlew assembleRelease` 会打出来三个包不同的 `applicationId`.

这里是我的 [demo](https://github.com/FaiChou/AndroidChannalAssembleDemo), demo 中暴露出安卓的 flavor 名给 RN:

```javascript
console.log(AppInfo.flavorName); // huawei meilan xiaomi
```


## RN 打包之坑

项目中打包apk之前需要提前手动打包js, 在 app 下 `build.gradle` 中:

```
apply from: "../../node_modules/react-native/react.gradle"
```

`react.gradle` 中有一个 `"bundle${targetName}JsAndAssets"` 的任务, 使用 `./gradlew build --dry-run | grep bundle`:

```
:app:bundleBetaReleaseJsAndAssets SKIPPED
:app:bundleDebugJsAndAssets SKIPPED
:app:bundleReleaseJsAndAssets SKIPPED
:jcore-react-native:bundleDebug SKIPPED
:jcore-react-native:bundleRelease SKIPPED
:jpush-react-native:bundleDebug SKIPPED
:jpush-react-native:bundleRelease SKIPPED
:react-native-camera:bundleDebug SKIPPED
:react-native-camera:bundleRelease SKIPPED
:react-native-code-push:bundleDebug SKIPPED
:react-native-code-push:bundleRelease SKIPPED
:react-native-device-info:bundleDebug SKIPPED
:react-native-device-info:bundleRelease SKIPPED
:react-native-image-crop-picker:bundleDebug SKIPPED
:react-native-image-crop-picker:bundleRelease SKIPPED
:react-native-prompt-android:bundleDebug SKIPPED
:react-native-prompt-android:bundleRelease SKIPPED
:react-native-video:bundleDebug SKIPPED
:react-native-video:bundleRelease SKIPPED
:react-native-webview:bundleDebug SKIPPED
:react-native-webview:bundleRelease SKIPPED
:react-native-wechat:bundleDebug SKIPPED
:react-native-wechat:bundleRelease SKIPPED
:rn-fetch-blob:bundleDebug SKIPPED
:rn-fetch-blob:bundleRelease SKIPPED
```

可以看到会执行 `bundle*JsAndAssets` 这个 task, 但是为何使用 *Android studio* 就不会执行呢?

官方文档有这一句话:

> Note: Make sure gradle.properties does not include org.gradle.configureondemand=true as that will make the release build skip bundling JS and assets into the APK.


在项目的 `gradle.properties` 找不到 `org.gradle.configureondemand`, 以为不是这个原因, 但其实就是这个原因: Android Studio 中的 Preference - Build,Execution,Deployment - Compiler - Configure on Demand 默认被勾选上了.

所以取消勾选就可以使用 Android Studio 自动打js包了.





## 参考

- [Make, Clean, Rebuild, Build APK, Generate Signed APK 区别](https://www.cnblogs.com/bluestorm/p/6688414.html)
- [gradlew build vs assembleRelease](https://stackoverflow.com/questions/40219917/what-is-the-difference-between-gradlew-build-and-gradlew-assemblerelease/40222702)
- [在 AndroidStudio 工程点击 Run 按钮， 实际上做了什么操作](https://www.zhihu.com/question/65289196)
- [Android Studio 与 Gradle](http://blog.bugtags.com/2015/12/17/embrace-android-studio-indepth/)
- [RN Generating Signed APK](https://facebook.github.io/react-native/docs/0.40/signed-apk-android)
- [Build your app from the command line](https://developer.android.com/studio/build/building-cmdline)
- [diff in gradlew build and assemble](https://stackoverflow.com/questions/44185165/which-are-the-differences-between-gradle-assemble-and-gradle-build-taks)
- [Android Studio Gradle命令和配置](https://www.jianshu.com/p/0d4e79aa850c)
- [Building multiple versions of a React Native app](https://medium.com/@ywongcode/building-multiple-versions-of-a-react-native-app-4361252ddde5)
- [multi-deployment-testing-android](https://github.com/Microsoft/react-native-code-push/blob/master/docs/multi-deployment-testing-android.md)
- [why android studio skip bundle js](https://github.com/facebook/react-native/issues/9612#issuecomment-284431070)


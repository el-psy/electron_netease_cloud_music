# 概述

electron+react之类，构建的网易云音乐的页面。
当前还称不上播放器。

后端使用了[Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)，并且做了修改。
代码位于``` ./electron/ ``` 下的 ``` module/ ``` 、 ``` plugins/ ``` 、 ``` util/ ``` 、 ``` music_api.js ```。

构建工具使用了vite，插件使用了vite-electron-plugin。
vite-electron-plugin已经能正常dev了。。还没试过build。。。
声明：这个插件不是我写的。

react的三件套，react，react-router已经使用了，mobx只是安装了，还没到发挥作用的时候。。。

# 页面
- 主页推荐页
- 搜索页
- 专辑页
- 歌单页
- 歌手页
是的，还没有登录页。。。
不知道后端的代码修改之后能不能登录上呢。。。

# 微弱的可能
增加播放功能  
增加收藏功能
构建将每个页面之间的链接，并优化title（就是鼠标悬停时显示的提示文字）

# 更微弱的可能
构建一个滚动条组件
毕竟初试的滚动条太丑了。。

# 最后
或许看到这个的面试官可以出这样一道前端题
构建一个表格，如同网易云音乐PC客户端一样
其中表格某几列显示不定长度的文字，要求文字为单行，长度不足时末尾会显示省略号
表格宽度随窗口变化，并不会导致窗口出现水平滚动条

不知道写网易云音乐PC客户端的大神是怎么写出来的，或许根本没用前端？
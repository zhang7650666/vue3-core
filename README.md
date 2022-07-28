# vue3-core
vue3 源码分析

### （runtime-dom) Vue中为了结构，将逻辑分成了两个模块
     运行时 核心 （不在于什么平台 browser、test、小程序、 APP、...）靠的是虚拟dom, 针对不同平台运行时，vue会采用不同的渲染器

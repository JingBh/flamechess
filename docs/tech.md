# 用到的技术

## 后端

 - 使用 PHP 语言
 - 使用 MySQL 数据库存储数据
 - 使用 Laravel 框架搭建应用
 - 实现了一套 API，方便其它人机对弈程序使用

## 前端

 - 使用 TypeScript 和 JavaScript 语言
 - 使用 Xterm.js 模拟终端
 - 介绍页用了 Bootstrap 框架和 jQuery 库编写
 - 使用基于 Webpack 的 Laravel Mix 打包资源
 - 使用 Babel 编译器兼容部分旧浏览器

## 双向实时通信

使用 Socket.io 实现服务器与浏览器之间的双向实时通信，同步棋盘信息；服务器部分使用了 Node.js 作为运行环境，用到了 Express、Axios 等库，还使用了 Supervisor 服务来保证服务器进程的持续运行。

## 工作流

 - 使用 Git 以及 GitHub 管理代码
 - 使用 Laravel 官方提供的 Homestead 虚拟机作为本地运行环境，开发测试时使用
 - 每个版本开发完成后，Push 到 GitHub，服务器再通过 Git Pull 更新代码，这样的流程可以防止在开发影响到线上代码的稳定性

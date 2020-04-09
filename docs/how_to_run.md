# 使用指南

因为架构复杂，您可能需要阅读本文来了解如何让本项目正常运行。

## 依赖软件

 - **PHP** >= `7.2`
 - **MySQL** >= `5.7`
 - **Node.js** with **Yarn**
 - **Composer**

### 可选软件

 - **Redis**

## 安装步骤

```bash
# 克隆项目
git clone https://github.com/JingBh/flamechess.git
cd flamechess

# 安装依赖
composer install --no-dev  # 开发时去掉 --no-dev
yarn install

# 配置环境
cp .env.example .env
nano .env  # 或者其它编辑器

# 生成一个 Laravel 秘钥
php artisan key:generate

# 创建数据库结构
php artisan migrate

# 运行 Laravel Mix 打包前端资源
yarn production

# 运行 ChessTerm 后端服务器
node chess_server/app  # 或 yarn run chess-server
```

### `.env`文件主要项说明

其它项可以参见 [Laravel 官方文档](https://learnku.com/docs/laravel/7.x/configuration)，若没有特殊需求，留默认值即可。

#### APP_ENV
应用环境，有 3 种值：
 - `local`：推荐用于在本地服务器开发的场景。
 - `staging`：推荐用于在远程服务器上测试的场景。
 - `production`：推荐用于生产环境。
 
#### APP_DEBUG
是否开启 debug 模式。
 
#### DB_*
数据库设置，从键名即可看出用途。

#### FLAMECHESS_PASSWORD
`boards` API 的管理密码。

#### FLAMECHESS_TERM_SERVER
`ChessTerm` 后端服务器 URL，如 `http://localhost:11512`。

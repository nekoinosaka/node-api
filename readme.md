一、项目初始化
1. npm初始化 
```
npm init -y
```
生成package.json文件，记录项目的依赖
2. git初始化
git init 
生成git本地仓库

二、 搭建项目
1. 安装koa2框架
npm i koa 
2. 编写最基础的app
创建src/main.js
3. 测试
在终端使用 node src/main.js 

三、项目的基本优化
1. 自动重启服务
安装nodemon 
```BASH
npm i nodemon
```
编写package.json文件
```json
  "scripts": {
    "dev": "nodemon ./src/main.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
```
2. 读取配置文件
	安装`dotenv`, 读取根目录的`.env`文件, 将配置写入`process.env`里面
   ```bash
   npm i dotenv
   ```
   创建`.env`文件
   ```
   APP_PORT = 8000
   ```
   创建`src/config/config.default.js`
   ```js
   const dotenv = require('dotenv')
	dotenv.config()
	// console.log(process.env.APP_PORT)
	module.exports = process.env
   ```
   改写main.js
   ```js
   const Koa = require("koa")
const { APP_PORT } = require('./config/config.default')
const app = new Koa()
app.use((ctx, next) => {
    ctx.body = 'hello api'
})
app.listen(APP_PORT, () => {
    console.log(`server is running at HTTP://LOCALHOST:${APP_PORT}`)
})
   ```
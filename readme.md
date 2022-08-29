一、 项目初始化
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
npm i nodemon -D
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
   

   四、 添加路由
   路由：根据不同的url调用对应的处理函数
   1. 安装koa-router
   ```
   npm install koa-router
   ```
   koa-router使用
       1. 导入包
       2. 实例化对象
       3. 编写路由
       4. 注册中间件
   2. 编写路由
   创建 `src/router`目录，编写`user.route.js`
   ```js
   	const Router = require('koa-router')
	const router = new Router({ prefix: '/users' })
	// GET /users/
	router.get('/',(ctx,next)=>{
    ctx.body = 'hello users'
	})
	module.exports = router
   ```
   3. 改写main.js
   
   ```js
    const Koa = require("koa")
    const { APP_PORT } = require('./config/config.default')
    const userRouter = require("./router/user.route")
    const app = new Koa()
    app.use(userRouter.routes()) 
    app.listen(APP_PORT, () => {
     console.log(`server is running at HTTP://LOCALHOST:${APP_PORT}`)
    })
   ```

五、目录结构优化
1. 将http服务和app业务拆分

	创建`src/app/index.js`

    ```js
    const Koa = require("koa")
	const userRouter = require("../router/user.route")
	const app = new Koa()
	app.use(userRouter.routes())
	module.exports = app
	```
    改写main.js

    ```js
    const { APP_PORT } = require('./config/config.default')
    const app = require("./app")
    app.listen(APP_PORT, () => {
        console.log(`server is running at HTTP://LOCALHOST:${APP_PORT}`)
    })
    ```

   2. 将路由和控制器拆分
	路由：解析URL，分发给controller对应的方法
    控制器: 处理不同的业务
    改写`user.route.js`

    ```js
        const Router = require('koa-router')
        const {register, login} = require("../controller/user.controller")
        const router = new Router({ prefix: '/users' })
        //  注册接口
        router.post('/register',register)
        router.post('/login',login)

        module.exports = router
        ```
        创建`controller/userController`
        ```js
                class UserController {
                async register(ctx,next){
                   ctx.body = '用户注册成功'
                }
                async login(ctx,next){
                     ctx.body = '登陆成功'
                }
                    }
                 module.exports = new UserController()
    	```


六、解析body
1. 安装koa-body
```bash
npm i koa-body
```
2. 注册中间件
改写`app/index.js`

    ```js
    app.use(KoaBody())
    app.use(userRouter.routes())
    ```
3. 解析请求的数据
	改写usercontroller
	```js
    const { createUser } = require('../service/user.service')
	class UserController {
    async register(ctx, next) {
        console.log(ctx.request.body)
        // 1. 获取数据
        console.log(ctx.request.body)
        const user_name = ctx.request.body.user_name
        const password = ctx.request.body.password
        // 2. 操作数据库
        const res = await createUser(user_name, password)
        console.log(res)
        // 3. 返回结果
        ctx.body = ctx.request.body
    }
    async login(ctx, next) {
        ctx.body = '登陆成功'
    }
}
module.exports = new UserController()
    ```

4. 拆分service层
创建`src/service/user.service.js`

```js
class UserService {
    async createUser(user_name, password){
        // todo:写入数据库
        return "写入数据库成功"
    }
}
module.exports = new UserService()
```
七、 数据库操作
sequelize ORM数据库工具
ORM：对象关系映射
 ·数据表映射（对应）一个类
 ·数据表中的数据行（记录）对应一个对象
 ·数据表字段对应对象的属性
 ·数据表的操作对应对象的方法
 1. 安装sequelize 和 mysql2
 `npm i sequelize mysql2`
 2. 连接数据库
 `src/db/seq.js`
 ```js
 const {Sequelize} = require('sequelize')
const {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PWD,
    MYSQL_DB} = require('../config/config.default')
const seq = new Sequelize(MYSQL_DB,MYSQL_USER,MYSQL_PWD,{
    host:MYSQL_HOST,
    dialect:'mysql'
})
seq.authenticate().then(()=>{
    console.log("数据库连接成功")
}).catch((err)=>{
    console.log("数据库连接失败",err)
})
module.exports = seq
 ```
 12. 加密
 1. 安装bcryptjs
 `npm i bcryptjs`
 
 14.用户认证与授权
 登陆成功后给用户颁发令牌（token）
 用户在以后的每一次请求中携带这个令牌
 使用jwt (json web token)
 header:头部
 payload:载荷
 signature:保证安全性和有效性
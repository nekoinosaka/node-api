const { createUser, getUserInfo} = require('../service/user.service')
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
        ctx.body = {
            code:0,
            message:"用户注册成功",
            result:{
                id:res.id,
                user_name:res.user_name
            }
        }
    }
    async login(ctx, next) {
        ctx.body = '登陆成功'
    }
}
module.exports = new UserController()
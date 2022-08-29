const jwt = require('jsonwebtoken')
const { userRegisterError } = require('../constant/error.type')
const { createUser, getUserInfo } = require('../service/user.service')
const {JWT_SECRET} = require('../config/config.default')
class UserController {
    async register(ctx, next) {
        console.log(ctx.request.body)
        // 1. 获取数据
        console.log(ctx.request.body)
        const user_name = ctx.request.body.user_name
        const password = ctx.request.body.password
        // 2. 操作数据库

        try {
            const res = await createUser(user_name, password)
            console.log(res)
            // 3. 返回结果
            ctx.body = {
                code: 0,
                message: "用户注册成功",
                result: {
                    id: res.id,
                    user_name: res.user_name
                }
            }
        } catch (err) {
            console.log(err)
            ctx.app.emit("error", userRegisterError,ctx)
        }

    }
    async login(ctx, next) {
        const {user_name}  = ctx.request.body
        ctx.body = `欢迎,${user_name}`
        // 1. 获取用户信息（在token的payload中要记录id,user_name,isAdmin）
        try{
            // 剔除从返回结果对象中password，
            // 将剩下的属性放到一个新的对象res
            const {password, ...res} = await getUserInfo({user_name})
            ctx.body = {
                code:0,
                message:"登陆成功",
                result:{
                    token:jwt.sign(res,JWT_SECRET,{expiresIn:"1d"})
                }
            }
        }catch(err){
            console.error("用户登录失败",err)
        }

    }
}
module.exports = new UserController()
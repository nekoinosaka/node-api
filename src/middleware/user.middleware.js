const { getUserInfo } = require("../service/user.service")
const { userAlreadyExisted, userFormatError, userRegisterError } = require('../constant/error.type')
const userValidator = async (ctx, next) => {
    const { user_name, password } = ctx.request.body

    if (!user_name || !password) {
        console.error("用户名或密码为空", ctx.request.body)
        ctx.app.emit('error', userFormatError, ctx)
        return
    }

    await next()
}
const verifyUser = async (ctx, next) => {
    const { user_name } = ctx.request.body
    //  if(await getUserInfo({user_name})){
    //         console.error("用户存在",ctx.request.body)
    //         ctx.app.emit("error",userAlreadyExisted,ctx)
    //         return
    //     }
    try {
        const res = await getUserInfo({ user_name })
        if (res) {
            console.error("用户存在", {user_name})
            ctx.app.emit("error", userAlreadyExisted, ctx)
            return
        }
    } catch (err) {
        console.error("获取用户信息错误", {user_name})
        ctx.app.emit("error", userRegisterError, ctx)
        return
    }
    await next()
}

module.exports = {
    userValidator,
    verifyUser
}
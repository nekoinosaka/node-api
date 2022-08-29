const bcrypt = require('bcryptjs')
const { getUserInfo } = require("../service/user.service")
const { invalidPassword, userLoginError, userNotExist, userAlreadyExisted, userFormatError, userRegisterError } = require('../constant/error.type')
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
        if (!res) {
            console.error("用户存在", { user_name })
            ctx.app.emit("error", userAlreadyExisted, ctx)
            return
        }
    } catch (err) {
        console.error("获取用户信息错误", { user_name })
        ctx.app.emit("error", userRegisterError, ctx)
        return
    }
    await next()
}
const crpytPassword = async (ctx, next) => {
    try {
        const { password } = ctx.request.body
        const salt = bcrypt.genSaltSync(10)
        // hash保存的是 密文
        const hash = bcrypt.hashSync(password, salt)
        ctx.request.body.password = hash
    } catch (err) {
        console.log(err,"errerrerr")
    }

    await next()
}
const verifyLogin = async (ctx, next) => {
    // 1.根据用户名判断用户是否存在（不存在就报错）

    const { user_name, password } = ctx.request.body
    try {
        const res = await getUserInfo({ user_name })

        if (!res) {
            console.error("用户名不存在", { user_name })
            ctx.app.emit("error", userNotExist, ctx)
            return
        }
        // 2.比对密码是否正确（不匹配报错）
        if (!bcrypt.compareSync(password, res.password)) {
            ctx.app.emit("error", invalidPassword, ctx)
            return
        }
    } catch (err) {
        console.error(err)
        return ctx.app.emit("error", userLoginError, ctx)
    }



    await next()
}

module.exports = {
    userValidator,
    verifyUser,
    crpytPassword,
    verifyLogin
}
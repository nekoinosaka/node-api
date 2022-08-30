const jwt = require("jsonwebtoken")
const { tokenExpiredError, invalidToken,noPermissionError } = require('../constant/error.type')
const { JWT_SECRET } = require('../config/config.default')
const auth = async (ctx, next) => {
    const { authorization } = ctx.request.header
    const token = authorization.replace("Bearer ", "")
    try {
        // user中包括payload的信息（id,username,isadmin）
        const user = jwt.verify(token, JWT_SECRET)
        ctx.state.user = user
    } catch (err) {

        switch (err.name) {
            case "TokenExpiredError":
                console.error("token过期", err)
                return ctx.app.emit("error", tokenExpiredError, ctx)
            case "JsonWebTokenError":
                console.error("无效的token", err)
                return ctx.app.emit("error", invalidToken, ctx)
        }
    }
    await next()
}
const hadAdminPermission = async (ctx,next)=>{
    const {isAdmin} = ctx.state.user
    if(!isAdmin){
        console.error("该用户没有管理员权限",ctx.state.user)
        try{
        return ctx.app.emit("error",noPermissionError,ctx)
        }catch(err){
            console.log(err)
        }
    }
    await next()
}

module.exports = {
    auth,
    hadAdminPermission
}
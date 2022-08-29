const Router = require('koa-router')
const { auth } = require("../middleware/auth.middleware")
const { userValidator, verifyUser, cryptPassword, verifyLogin } = require("../middleware/user.middleware")
const { register, login } = require("../controller/user.controller")

const router = new Router({ prefix: '/users' })
//  注册接口
router.post('/register', userValidator, verifyUser, cryptPassword, register)
router.post('/login', userValidator, verifyLogin, login)
// 修改密码
router.patch('/', auth, (ctx, next) => {

    // console.log(token)

    ctx.body = '修改密码成功'
})
module.exports = router
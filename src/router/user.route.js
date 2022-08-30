const Router = require('koa-router')
const { auth } = require("../middleware/auth.middleware")
const { userValidator, verifyUser, crpytPassword, verifyLogin } = require("../middleware/user.middleware")
const { changePassword, register, login } = require("../controller/user.controller")

const router = new Router({ prefix: '/users' })
//  注册接口
router.post('/register', userValidator, verifyUser, crpytPassword, register)
router.post('/login', userValidator, verifyLogin, login)
// 修改密码
router.patch('/', auth, crpytPassword, changePassword)
module.exports = router
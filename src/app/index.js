const Koa = require("koa")
const cors = require('koa2-cors')
const KoaBody = require('koa-body')
const errHandler = require('./errorHandler')
const router = require("../router")
const app = new Koa()
app.use(KoaBody())
app.use(cors())
app.use(router.routes())
app.use(router.allowedMethods())
// 统一的错误处理
app.on("error", errHandler)
module.exports = app
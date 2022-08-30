const path = require('path')
const Koa = require("koa")
const parameter = require("koa-parameter")
const cors = require('koa2-cors')
const KoaBody = require('koa-body')
const KoaStatic = require("koa-static")
const errHandler = require('./errorHandler')
const router = require("../router")
const app = new Koa()
app.use(KoaBody({
    multipart:true,
    formidable:{
        // 不能配置选项option中使用相对路径,这里不是相对的当前路径，而是相对的process.cwd()
        uploadDir:path.join(__dirname,'../upload'),
        keepExtensions:true
    }
}))
app.use(parameter(app))
app.use(KoaStatic(path.join(__dirname,'../upload')))
app.use(cors())
app.use(router.routes())
app.use(router.allowedMethods())
// 统一的错误处理
app.on("error", errHandler)
module.exports = app
const {fileUploadError, unSupportedFileType} = require('../constant/error.type')
const path = require('path')
class GoodsController{
    async upload(ctx,next){
        // console.log(ctx.request.files.file)
        const {file} = ctx.request.files
        const fileTypes  = ['image/jpeg',"image/png"]
        if(file){
            if(!fileTypes.includes(file.mimetype)){
                console.log(file)
                return  ctx.app.emit("error",unSupportedFileType,ctx)
               
            }
            ctx.body  = {
                code:0,
                message:"图片上传成功",
                result:{
                    goods_img:path.basename(file.filepath)
                }
            }
        }else{
            return ctx.app.emit("error",fileUploadError,ctx)
        }
        // ctx.body = "图片上传成功"
    }
}
module.exports = new GoodsController()
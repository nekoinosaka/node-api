const {DataType, DataTypes} = require('sequelize')
const seq = require("../db/seq")
// 创建模型model (zd_user -> zd_users)
const User = seq.define('zd_user',{
    // id会被sequelize自动管理
    user_name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        comment:'用户名，唯一'
    },
    password:{
        type:DataTypes.CHAR(64),
        allowNull:false,
        comment:"密码"
    },
    isAdmin:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:0,
        comment:"是否管理员，0为否1为是"
    }
})
// 强制同步数据库（创建数据表）
// User.sync({force:true})
module.exports = User
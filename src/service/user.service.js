const User = require("../model/user.model")
class UserService {
    async createUser(user_name, password) {
        // todo:写入数据库
        //  插入数据库
        // await表达式 ：promise对象的值
        const res = await User.create({
            user_name,
            password
        })
        console.log(res)
        return res.dataValues
    }
    async getUserInfo({ id, user_name, password, isAdmin }) {
        const whereOpt = {}
        id && Object.assign(whereOpt, { id })
        user_name && Object.assign(whereOpt, { user_name })
        password && Object.assign(whereOpt, { password })
        isAdmin && Object.assign(whereOpt, { isAdmin })

        const res = await User.findOne({
            attributes: ['id', 'user_name', "password", "isAdmin"],
            where: whereOpt
        })
        return res ? res.dataValues : null
    }
    async updateById({ id, user_name, password, isAdmin }) {
        try {
            const whereOpt = { id }
            const newUser = {}
            user_name && Object.assign(newUser, { user_name })
            password && Object.assign(newUser, { password })
            isAdmin && Object.assign(newUser, { isAdmin })

            const res = await User.update(newUser, { where: whereOpt })
            // console.log(res)
            return res[0] > 0 ? true : false
        } catch (err) {
            console.log(err, "err")
        }
    }
}
module.exports = new UserService()
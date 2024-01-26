import User from "../models/UserModels.js";

export const verifyUser = async (req, res, next) => {
    if(!req.session.userId) {
        res.status(401).json({ message: "Mohon login ke akun anda"})
    }
    const user = await User.findOne({
        where: {
            uuid: req.session.userId
        }
    })
    if(!user) return res.status(403).json({msg: "user tidak ditemukan"})
    req.userId =user.id
    req.role = user.role
    next()
}

export const adminOnly = async (req, res, next) => {
    const user = await User.findOne({
        where:{
            uuid: req.params.id
        }
    })
    if(!user) return res.status(403).json({message: "user tidak ditemukan"})
    if(user.role === "admin") return res.status(403).json({message: "akses denied"})
    next()
}
import User from "../models/UserModels.js";
import argon from "argon2"

export const Login = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    })
    if(!user) return res.status(403).json({message: "data tidak dapat ditemukan"})
    const match = await argon.verify(user.password, req.body.password)
    if(!match) return res.status(403).json({message: "wrong strong password"})
    req.session.userId = user.uuid
    const uuid = user.uuid
    const name = user.name
    const email = user.email
    const role = user.role
    res.status({uuid, name, email, role})
}

export const Me = async (req, res) => {
    if(!req.session.userId) {
        return res.status(401).json({message: 'mohon masuk ke akun anda'})
    }

    const user = await User.findOne({
        attributes: ['uuid', 'name', 'email', 'role'],
        where: {
            uuid: req.session.userId
        }
    })
    if(!user) return res.status(404).json({message: "User tidak ditemukan"})
    res.status(200).json(user)
}

export const LogOut = async (req, res) =>{
    req.session.destroy((err) => {
        if(err) return res.status(404).json({message: "Tidak dapat logout"})
        res.status(200).json({message: "anda berhasil logout"})
    })
}
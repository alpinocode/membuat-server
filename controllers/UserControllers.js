import User from "../models/UserModels.js";
import argon2  from "argon2";

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['uuid', 'name', 'email', 'role']
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ message: error.message})   
    }
}

export const getUserById = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: {
                uuid: req.params.id
            }
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }   
}

export const createUser = async (req,res) => {
    const {
        name,
        email,
        password,
        confPassword,
        role
    } = req.body

    if(password !== confPassword) return res.status(403).json({ message: "password dan conf password tidak cocok"})
    const hashPassword = await argon2.hash(password)
    
    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        })
        res.status(200).json({
            message: "User create success"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const updateUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    })

    if(!user) return res.status(403).json({message: "User tidak dapat ditemukan"})

    const {
        name,
        email,
        password,
        confPassword,
        role
    } = req.body

    let hashPassword

    if( password === "" || password === null) {
        hashPassword = user.password
    } else {
        hashPassword = await argon2.hash(password)
    }

    if(password !== confPassword) return res.status(403).json({message: "password dan confpassword tidak cocok"})

    try {
        await User.update({
            name: name,
            email: email,
            password: confPassword,
            role: role
        },{
            where: {
                id: user.id
            }
        })
        res.status(200).json({
            message: "update user success"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    })

    if(!user) return res.status(400).json({ message: "user tidak di temukan"})

    try {
        await User.destroy({
            where: {
                id: user.id
            }
        })
        res.status(200).json({ message: "User delete success"})
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
import DataKost from "../models/DataKostmodel.js"
import User from "../models/UserModels.js"
import {Op} from 'sequelize'

export const getDataKost = async (req, res) => {
   try {
    let response
    if(req.role === "admin") {
        response = await DataKost.findAll({
            attributes: ['name','alamat', 'desckripsi', 'noHp', 'harga'],
            include: {
                model: User,
                attributes: ['name', 'email']
            }
        })
    } else {
        response = await DataKost.findAll({
            attributes: ['name', 'alamat', 'desckripsi', 'noHp', 'harga'],
            where: {
                userId: req.userId
            },
            include: {
                model: User,
                attributes: ['name', 'email']
            }
        })
    }
    res.status(200).json(response)
   } catch (error) {
    res.status(500).json({
        message: error.message
    })
   }
}

export const getDataKostById = async (req, res) => {
    try {
        const datakost = await DataKost.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if(!datakost) return res.status(403).json({ message: "User tidak ditemukan"})
        let response;
        if(req.role === "admin") {
            response = await DataKost.findAll({
                attributes: ['name', 'alamat', 'desckripsi', 'noHp', 'harga'],
                where: {
                    id: datakost.id
                },
                include: {
                    model: User,
                    attributes: ['name', 'email']
                }
            })
        } else {
            response = await DataKost.findAll({
                attributes: ['name', 'alamat', 'desckripsi', 'noHp', 'harga'],
                where: {
                    [Op.and]: [{id: datakost.id}, {userId: req.userId}]
                },
                include: {
                    model: User,
                    attributes: ['name', 'email']
                }
            })   
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const createDataKost = async (req, res) => {
    const {nama, alamat, nohp, deskripsi, harga} =req.body

    try {
        await DataKost.create({
            name: nama,
            alamat: alamat,
            noHp: nohp,
            desckripsi: deskripsi,
            harga: harga
        })
        res.status(200).json({message: "Create datakost success"})
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const updateDataKost = async( req,res ) => {
    try {
        const datakost = await DataKost.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if(!datakost) return res.status(403).json({message: "data kost tidak ditemukan"})
        const {nama, alamat, nohp, deskripsi, harga} =req.body
        if(req.role === "admin") {
            await DataKost.update({
                name: nama,
                alamat: alamat,
                noHp: nohp,
                desckripsi: deskripsi,
                harga: harga
            },{
                where: {
                    id: datakost.id
                }
            })
        } else {
            if(req.userId !== datakost.userId) return res.status(403).json({ message: "akses terlarang"})
            await DataKost.update({
                name: nama,
                alamat: alamat,
                noHp: nohp,
                desckripsi: deskripsi,
                harga: harga
            },{
                where: {
                    [Op.and]: [{id: datakost.id}, {userId: req.userId}]
                }
            })
        }
    } catch (error) {
        
    }
}
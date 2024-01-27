import Perbaikan from "../models/PerbaikanModel.js"
import User from "../models/UserModels.js"
import {Op} from "sequelize"
import DataKost from "../models/DataKostmodel.js"

export const getPerbaikan = async (req, res) => {
    try {
        let response 
        if(!req.role === "admin") {
            response = await Perbaikan.findAll({
                attributes: ['uuid', 'tempat', 'keterangan', 'image_1', 'image_2', 'image_3', 'image_4'],
                order: ['tempat', 'keterangan'],
                include: {
                    model: User,
                    attributes: ['name', 'email'],
                    include: {
                        model: DataKost,
                        attributes: ['name', 'alamat', 'desckripsi', 'noHp', 'harga']
                    }
                }
            })
        } else {
            response = await Perbaikan.findAll({
                attributes: ['uuid', 'tempat','keterangan', 'image_1','image_2', 'image_3', 'image_4'],
                order: ['tempat', 'keterangan'],
                include: {
                    model: User,
                    attributes: ['name', 'email'],
                    include: {
                        model: DataKost,
                        attributes: ['name', 'alamat','desckripsi', 'noHp', 'harga' ]
                    }
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

export const getPerbaikanById = async(req, res) => {
    try {
        const perbaikan = await Perbaikan.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if(!perbaikan) return res.status(403).json({message: "Perbaikan tidak dapat ditemukan"})
        let response;
        if(req.role === "admin") {
            response = await Perbaikan.findAll({
                attributes: ['uuid', 'tempat', 'keterangan', 'validasiper', 'descper'],
                where: {
                    id: perbaikan.id
                },
                include: {
                    model: User,
                    attributes: ['name', 'email'],
                    include: {
                        model: DataKost,
                        attributes: ['name', 'alamat', 'desckripsi', 'noHp', 'harga']
                    }
                }
            })
        } else {
            response = await Perbaikan.findAll({
                attributes: ['uuid', 'tempat', 'keterangan','validasiper', 'descper'],
                where: {
                    [Op.and]: [{id: perbaikan.id}, {userId: req.userId}]
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


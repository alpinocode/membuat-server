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
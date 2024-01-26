import DataKost from "../models/DataKostmodel.js"
import User from "../models/UserModels.js"
import {Op} from 'sequelize'

export const getDataKost = async (req, res) => {
   try {
    let response
    if(req.role === "admin") {
        response = await DataKost.findAll({
            attributes: ['nama','alamat', 'desckripsi', 'noHp', 'harga'],
            include: {
                model: User,
                attributes: ['name', 'email']
            }
        })
    } else {
        response = await DataKost.findAll({
            attributes: ['nama', 'alamat', 'desckripsi', 'noHp', 'harga'],
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

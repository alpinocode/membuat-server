import Kerusakan from "../models/KerusakanModel.js";
import User from "../models/UserModels.js";
import DataKost from "../models/DataKostmodel.js";
import {Op} from "sequelize"

export const GetValidasi = async (req, res) => {
    try {
        let response;
        if(req.role === "admin") {
            response = await Kerusakan.findAll({
                attributes: ['uuid', 'judul', 'tempat', 'keterangan', 'image_1', 'image_2', 'image_3', 'image_4', 'url_1', 'url_2', 'url_3', 'url_4'],
                order: ['judul', 'tempat', 'keterangan'],
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
            response = await Kerusakan.findAll({
                attributes: ['uuid', 'tempat', 'keterangan', 'image_1', 'image_2', 'image_3', 'image_4', 'url_1', 'url_2', 'url_3', 'url_4'],
                order: ['judul', 'tempat', 'keterangan'],
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

export const GetValidasiById = async (req,res) => {
    try {
        const validasi = await Kerusakan.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if(!validasi) return res.status(403).json({message: "User Tidak dapat ditemukan"})
        let response;
        if(req.role === "admin"){
            response = await Kerusakan.findAll({
                attributes: ['uuid', 'judul', 'tempat', 'keterangan', 'image_1', 'image_2', 'image_3', 'image_4', 'url_1', 'url_2', 'url_3', 'url_4'],
                where: {
                    id: validasi.id
                },
                include: {
                    model: User,
                    attributes: ['name', 'tempat']
                }
            })
        } else {
            response = await Kerusakan.findAll({
                attributes: ['uuid', 'judul', 'tempat', 'keterangan', 'image_1', 'image_2', 'image_3', 'image_4', 'url_1', 'url_2', 'url_3', 'url_4'],
                where: {
                    [Op.and]: [{id: validasi.id}, {userId: req.userId}]
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
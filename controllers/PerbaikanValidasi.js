import Perbaikan from "../models/PerbaikanModel.js";
import User from "../models/UserModels.js";
import DataKost from "../models/DataKostmodel.js";
import {Op} from "sequelize"
import Kerusakan from "../models/KerusakanModel.js";

export const GetPerbaikanValidasi = async (req, res) => {
    try {
        let response
        if(req.role === "admin"){
            response = await Perbaikan.findAll({
                attributes: ['uuid', 'keterangan', 'validasiper', 'descper'],
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
            await Perbaikan.findAll({
                attributes: ['uuid', 'keterangan', 'validasiper', 'descper'],
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

export const GetPerbaikanValidasiById = async (req,res) => {
    try {
        const validasi = await Perbaikan.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if(!validasi) return res.status(403).json({message: "Data tidak dapat ditemukan"})
        let response;
        if(req.role === "admin") {
            response = await Perbaikan.findAll({
                attributes: ['uuid', 'keterangan', 'validasiper', 'descper'],
                where: {
                    id: validasi.id
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
                attributes: ['uuid', 'keterangan', 'validasiper', 'descper'],
                where: {
                    [Op.and]: [{id: validasi.id}, {userId: req.userId}]
                },
                include: {
                    model: User,
                    attributes: ['name', 'email'],
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

export const UpdatePerbaikanValidasi = async (req, res) => {
    try {
        const validasi = await Perbaikan.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if(!validasi) return res.status(403).json({message : "Data tidak dapat ditemukan"})
        const {valid, ktr} = req.body

        if(req.role === "admin") {
            await Perbaikan.update({
                validasiper: valid,
                keteranganper: ktr
            }, {
                where: {
                    id: validasi.id
                }
            })
        } else {
            await Perbaikan.update({
                validasiper: valid,
                keteranganper: ktr
            },{
                where: {
                    [Op]: [{id: validasi.id}, {userId: req.userId}]
                }
            })
        }
        res.status(200).json({ message: "update data success"})
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
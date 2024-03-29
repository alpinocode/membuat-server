import User from "../models/UserModels.js";
import DataKost from "../models/DataKostmodel.js"
import {Op} from 'sequelize'
import path from "path"
import fs from "fs"
import Kerusakan from "../models/KerusakanModel.js";


export const getKerusakan = async (req, res) => {
    try {
        let response;
        if(req.role === "admin") {
            response = await Kerusakan.findAll({
                attributes: ['uuid', 'name', 'tempat', 'keterangan', 'image_1', 'image_2', 'image_3', 'image_4'],
                order: ['name', 'tempat'],
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
                attributes: ['uuid', 'name', 'tempat', 'keterangan', 'image_1', 'image_2', 'image_3', 'image_4'],
                where: {
                    uuid: req.params.id
                },
                include: {
                    model : User,
                    attributes: ['name', 'email'],
                    include: {
                        model: DataKost,
                        attributes: ['name', 'alamat', 'desckripsi', 'noHp', 'harga']
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


export const getKerusakanById = async (req, res) => {
    try {
        const kerusakan = await Kerusakan.findOne({
            where: {
                uuid: req.params.id
            }
        }) 
        if(!kerusakan) return res.status(200).json({ message : "Kerusakan data tidak ditemukan"})
        let response;
        if(req.role === "admin") {
            response = await Kerusakan.findAll({
                attributes: ['name', 'alamat', 'tempat', 'keterangan', 'image_1', 'image_2', 'image_3', 'image_4'],
                where: {
                    id: kerusakan.id
                },
                include: {
                    model: User,
                    attributes: ['name', 'email'],
                }
            })
        } else {
            response = await Kerusakan.findAll({
                attributes: ['name', 'alamat', 'tempat', 'keterangan', 'image_1', 'image_2', 'image_3', 'image_4'],
                where: {
                    [Op.and]: [{id: kerusakan.id}, {userId: req.userId}]
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

export const saveKerusakan = async (req, res) => {
    // random images
    let nameString = 'ABCDEFGHIJKLMabcdefghijklmn';
    let textKosong1 = "";
    let textKosong2 = "";
    let textKosong3 = "";
    let textKosong4= "";
    for(let i = 0 ; i < 10; i++) {
        textKosong1 += nameString.charAt(Math.floor(Math.random() * nameString.length))
        textKosong2 += nameString.charAt(Math.floor(Math.random() * nameString.length))
        textKosong3 += nameString.charAt(Math.floor(Math.random() * nameString.length))
        textKosong4 += nameString.charAt(Math.floor(Math.random() * nameString.length))
    }
    if(req.files === null) return res.status(403).json({ message: "No file uploded"})
    const name = req.body.title;    
    const desc = req.body.desckripsi;
    const file1 = req.files.file1
    const file2 = req.files.file1
    const file3 = req.files.file1
    const file4 = req.files.file1
    const fileSize1 = file1.data.length
    const fileSize2 = file2.data.length
    const fileSize3 = file3.data.length
    const fileSize4 = file4.data.length
    const ext1 = path.extname(file1.name)
    const ext2 = path.extname(file2.name)
    const ext3 = path.extname(file3.name)
    const ext4 = path.extname(file4.name)
    const fileName1 = "images-"+textKosong1+ext1;
    const fileName2 = "images-"+textKosong2+ext2;
    const fileName3 = "images-"+textKosong3+ext3;
    const fileName4 = "images-"+textKosong4+ext4;
    const url1 = `${req.protocol}://${req.get('host')}/images/${fileName1}`
    const url2 = `${req.protocol}://${req.get('host')}/images/${fileName2}`
    const url3 = `${req.protocol}://${req.get('host')}/images/${fileName3}`
    const url4 = `${req.protocol}://${req.get('host')}/images/${fileName4}`
    const allowType = ['.png', '.jpg', '.jpeg']

    // mengecek jika user mengirimkan images tidak ada format di allowType maka blok ini akan di eksekusi
    if(!allowType.include(ext1.toLowerCase())) return res.status(402).json({message: "invalid format images"})
    if(!allowType.include(ext2.toLowerCase())) return res.status(402).json({message: "invalid format images"})
    if(!allowType.include(ext3.toLowerCase())) return res.status(402).json({ message: "invalid format images"})
    if(!allowType.include(ext4.toLowerCase())) return res.status(402).json({message: "invalid format images"})

    // jika file lebih dari 5mb maka blok ini dijalankan
    if(fileSize1 > 500000) return res.status(403).json({message: "file melebihi kapasitas"})
    if(fileSize2 > 500000) return res.status(403).json({message: "file melebihi kapasitas"})
    if(fileSize3 > 500000) return res.status(403).json({message: "file melebihi kapasitas"})
    if(fileSize4 > 500000) return res.status(403).json({message: "file melebihi kapasitas"})

    file1.mv(`./public/images/${fileName1}`, async (err) => {
        if(err) return res.status(500).json({message: err.message})
    })
    file2.mv(`./public/images/${fileName2}`, async (err) => {
        if(err) return res.status(500).json({message: err.message})
    })
    file3.mv(`./public/images/${fileName3}`, async(err) =>{
        if(err) return res.status(500).json({ message: err.message})
    })
    file4.mv(`./public/images/${fileName4}`, async (err) => {
        if(err) return res.status(500).json({message: err.message})
    })    
    try {
        await Kerusakan.create({
            judul: name, 
            desc: desc, 
            image_1: fileName1, 
            url_1: url1,
            image_2: fileName2, 
            url_2: url2,
            image_3: fileName3, 
            url_3: url3,
            image_4: fileName4, 
            url_4: url4,
            userId: req.userId
        }) 
        res.status(200).json({
            message: "Save successfull"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


export const updateKerusakan = async (req,res) => {
    const kerusakan = await Kerusakan.findOne(
        {
            where:{
                uuid : req.params.id
        }
    });
    if(!kerusakan) return res.status(404).json({msg: " No Data Found"});
    let fileName1 = "";
    let fileName2 = "";
    let fileName3 = "";
    let fileName4 = "";
    // file berisi tidak ada/belum diunggah
    if(req.files === null){
        // jika file diunggah
        fileName1 = Kerusakan.image_1;
        fileName2 = Kerusakan.image_2;
        fileName3 = Kerusakan.image_3;
        fileName4 = Kerusakan.image_4;
    } else {
        // random name image 
        let nameString = "ABCDEFGHIJKLMabcdefghijklmn";
        let tektKosong1 = "";
        let tektKosong2 = "";
        let tektKosong3 = "";
        let tektKosong4 = "";
        for(let i = 0; i<= 10; i++){
            tektKosong1 += nameString.charAt(Math.floor(Math.random() * nameString.length));
            tektKosong2 += nameString.charAt(Math.floor(Math.random() * nameString.length));
            tektKosong3 += nameString.charAt(Math.floor(Math.random() * nameString.length));
            tektKosong4 += nameString.charAt(Math.floor(Math.random() * nameString.length));
        } 
        
        // create name
        const file1 = req.files.file1;
        const file2 = req.files.file2;
        const file3 = req.files.file3;
        const file4 = req.files.file4;
        const fileSize1 = file1.data.length;
        const fileSize2 = file2.data.length;
        const fileSize3 = file3.data.length;
        const fileSize4 = file4.data.length;
        const ext1 = path.extname(file1.name);
        const ext2 = path.extname(file2.name);
        const ext3 = path.extname(file3.name);
        const ext4 = path.extname(file4.name);
        fileName1 = "images-"+tektKosong1 + ext1;
        fileName2 = "images-"+tektKosong2 + ext2;
        fileName3 = "images-"+tektKosong3 + ext3;
        fileName4 = "images-"+tektKosong4 + ext4;
        const allowedType = ['.png','.jpg','.jpeg'];

        if(!allowedType.includes(ext1.toLowerCase())) return res.status(422).json({msg: 
            "Invalid Images"});
        if(!allowedType.includes(ext2.toLowerCase())) return res.status(422).json({msg: 
            "Invalid Images"});
        if(!allowedType.includes(ext3.toLowerCase())) return res.status(422).json({msg: 
            "Invalid Images"});
        if(!allowedType.includes(ext4.toLowerCase())) return res.status(422).json({msg: 
            "Invalid Images"});
        if(fileSize1 > 5000000) return res.status(422).json({msg: 
            "Image must be less than 5MB"});
        if(fileSize2 > 5000000) return res.status(422).json({msg: 
            "Image must be less than 5MB"});
        if(fileSize3 > 5000000) return res.status(422).json({msg: 
            "Image must be less than 5MB"});
        if(fileSize4 > 5000000) return res.status(422).json({msg: 
            "Image must be less than 5MB"});

        const filepath1 = `./public/images/${kerusakan.image_1}`;
        const filepath2 = `./public/images/${kerusakan.image_2}`;
        const filepath3 = `./public/images/${kerusakan.image_3}`;
        const filepath4 = `./public/images/${kerusakan.image_4}`;
        fs.unlinkSync(filepath1);
        fs.unlinkSync(filepath2);
        fs.unlinkSync(filepath3);
        fs.unlinkSync(filepath4);

        file1.mv(`./public/images/${fileName1}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
        });
        file2.mv(`./public/images/${fileName2}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
        });
        file3.mv(`./public/images/${fileName3}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
        });
        file4.mv(`./public/images/${fileName4}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
        });
    }
    const name = req.body.title;
    const desc = req.body.deskripsi;
    const url1 = `${req.protocol}://${req.get("host")}/images/${fileName1}`;
    const url2 = `${req.protocol}://${req.get("host")}/images/${fileName2}`;
    const url3 = `${req.protocol}://${req.get("host")}/images/${fileName3}`;
    const url4 = `${req.protocol}://${req.get("host")}/images/${fileName4}`;
    try {
        if(req.role === "admin"){
            await Kerusakan.update({
            judul: name, 
            desc: desc, 
            image_1: fileName1, 
            image_2: fileName2, 
            image_3: fileName3, 
            image_4: fileName4, 
            url_1: url1, 
            url_2: url2, 
            url_3: url3, 
            url_4: url4, 
        },{
            where: {
                id: kerusakan.id
            }
        });
        } else {
            if (req.userId !== kerusakan.userId) return res.status(403).json({ msg: "Akses Terlarang" });
                await Kerusakan.update({
                judul: name, 
                desc: desc, 
                image_1: fileName1, 
                image_2: fileName2, 
                image_3: fileName3, 
                image_4: fileName4, 
                url_1: url1, 
                url_2: url2, 
                url_3: url3, 
                url_4: url4, 
            },{
                where: {
                    id: kerusakan.id
                }
            });  
        }
       
        res.status(200).json({msg: "Kerusakan Updated successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteKerusakan = async(req,res) => {
    const kerusakan = await Kerusakan.findOne(
        {
            where:{
                uuid : req.params.id
        }
    });
    if (!kerusakan) return res.status(404).json({ msg: "Data Kerusakan tidak ditemukan!" });
    try {
        const filepath1 = `./public/images/${kerusakan.image_1}`;
            const filepath2 = `./public/images/${kerusakan.image_2}`;
            const filepath3 = `./public/images/${kerusakan.image_3}`;
            const filepath4 = `./public/images/${kerusakan.image_4}`;
            fs.unlinkSync(filepath1);
            fs.unlinkSync(filepath2);
            fs.unlinkSync(filepath3);
            fs.unlinkSync(filepath4);
        
        // const { namescholl, pengelola, tingkatan, alamat, nohp, kepsek } = req.body;
        if (req.role === "admin") {
            await Kerusakan.destroy({
                where: {
                    id: kerusakan.id
                }
            });
        } else {
            if (req.userId !== kerusakan.userId) return res.status(403).json({ msg: "Akses Terlarang" });
            await Kerusakan.destroy({
                where: {
                    [Op.and]: [{ id: kerusakan.id }, { userId: req.userId }]
                },
            });
        }
        res.status(200).json({ msg: "Data Kerusakan delete successfuly" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
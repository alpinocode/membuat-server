import express from "express"
import {
    GetPerbaikanValidasi,
    GetPerbaikanValidasiById,
    UpdatePerbaikanValidasi
} from "../controllers/PerbaikanValidasi.js"
import { verifyUser, adminOnly } from "../middleware/Auth.js"

const router = express.Router()

router.get('/perbaikan/validasi', verifyUser, GetPerbaikanValidasi)
router.get('/perbaikan/validasi/:id', verifyUser, GetPerbaikanValidasiById)
router.patch('/perbaikan/validasi/:id', verifyUser, adminOnly, UpdatePerbaikanValidasi)

export default router

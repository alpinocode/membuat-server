import express from "express"
import {
    GetValidasi,
    GetValidasiById,
    UpdateValidasi
} from "../controllers/KerusakanValidasi.js"
import { verifyUser, adminOnly } from "../middleware/Auth.js"

const router = express.Router()

router.get('/validasi', verifyUser, GetValidasi)
router.get('/validasi/:id', verifyUser, GetValidasiById)
router.patch('/validasi/:id', verifyUser, adminOnly, UpdateValidasi)

export default router
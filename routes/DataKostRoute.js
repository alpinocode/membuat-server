import express from "express"
import {
    getDataKost,
    getDataKostById,
    createDataKost,
    updateDataKost,
    deleteDataKost
} from "../controllers/DataKostControllers.js"
import { verifyUser } from "../middleware/Auth.js"

const router = express.Router()

router.get('/tempatkost', verifyUser,getDataKost )
router.get('/tempatkost/:id', verifyUser, getDataKostById)
router.post('/tempatkost', verifyUser, createDataKost)
router.patch('/tempatkost/:id', verifyUser, updateDataKost)
router.delete('/tempatkost/:id', verifyUser, deleteDataKost)

export default router
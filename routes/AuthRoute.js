import express from "express"
import {Login, Me, LogOut} from "../controllers/AuthController.js"

const router = express.Router()

router.get('/Me', Me)
router.post('/Login', Login)
router.delete('/LogOut', LogOut)

export default router

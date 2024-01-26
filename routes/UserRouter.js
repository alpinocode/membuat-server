import express from "express"
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}from "../controllers/UserControllers.js"
import { verifyUser, adminOnly } from "../middleware/Auth.js"

const router = express.Router()

router.get('/user',getUsers)
router.get('/user/:id', verifyUser, adminOnly, getUserById)
router.post('/user', createUser)
router.patch('/user/:id', verifyUser, adminOnly, updateUser)
router.delete('/user/:id', verifyUser, adminOnly, deleteUser)

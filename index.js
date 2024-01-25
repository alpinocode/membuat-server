import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import session from "express-session"

dotenv.config()

const app = express()

app.use(express.json())

app.listen(process.env.PORT, () => {
    console.log('Server up and running')
})

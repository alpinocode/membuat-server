import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
// route
import UserRoute from "./routes/UserRouter.js";


// global
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import fileUpload from "express-fileupload";

dotenv.config();

const app = express();


// 
(async() => {
    await db.sync();
})();


app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    // store: store,
    cookie: {
        secure: 'auto',
    }
}))

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));
app.use(UserRoute);


app.listen(process.env.APP_PORT, () => {
    console.log('Server Up and Running...');
});
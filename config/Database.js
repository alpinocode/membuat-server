import { Sequelize } from "sequelize";

// connection mysql
const db = new Sequelize( '', 'root', '', {
    host: process.env.DB_HOST,
    dialect: "mysql"
})

export default db
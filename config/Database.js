import { Sequelize } from "sequelize";

// connection mysql
const db = new Sequelize( 'server_kost', 'root', '', {
    host: process.env.DB_HOST,
    dialect: "mysql"
})

export default db
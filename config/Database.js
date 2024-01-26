import { Sequelize } from "sequelize";

// connection mysql
const db = new Sequelize( 'server_kost', 'root', '', {
    host: process.env.DB_HOST,
    port: 8111,
    dialect: "mysql",

})

export default db
const Sequelize = require("sequelize")

const sequelize = new Sequelize('postgres://mbiscidf:TQOOPNU-0ZE0GM6X4rufw43Y-iIXMhFC@john.db.elephantsql.com/mbiscidf')

// const sequelize = new Sequelize(
//     "mypost",
//     "root",
//     "pass",
//     {
//         host: "localhost",
//         dialect: "mysql",
//     })

module.exports = sequelize
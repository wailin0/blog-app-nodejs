const Sequelize = require("sequelize")

//elephant sql free
// const sequelize = new Sequelize('postgres://mbiscidf:TQOOPNU-0ZE0GM6X4rufw43Y-iIXMhFC@john.db.elephantsql.com/mbiscidf')

//  mysql
const sequelize = new Sequelize(
    "mypost",
    "wailinhtet",
    "wailinhtet",
    {
        host: "db4free.net",
        dialect: "mysql",
    })

//  mysql
// const sequelize = new Sequelize(
//     "mypost",
//     "root",
//     "pass",
//     {
//         host: "localhost",
//         dialect: "mysql",
//     })

module.exports = sequelize
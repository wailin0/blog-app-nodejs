const Sequelize = require("sequelize")

const sequelize = new Sequelize(
    "blog_app",
    "root",
    "pass",
    {
        host: "localhost",
        dialect: "mysql",
    })

module.exports = sequelize
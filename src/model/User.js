const Sequelize = require("sequelize")
const sequelize = require("../database")

const User = sequelize.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    aboutMe: {
        type: Sequelize.STRING,
    },
    headline: {
        type: Sequelize.STRING,
    },
    fame: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    photo: {
        type: Sequelize.STRING,
        defaultValue: "https://"
    }
})

module.exports = User
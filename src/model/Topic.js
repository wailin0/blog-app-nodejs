const Sequelize = require("sequelize")
const sequelize = require("../database")

const Topic = sequelize.define('topic', {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    image_url: {
        type: Sequelize.STRING,
        allowNull: false
    },
})

module.exports = Topic
const Sequelize = require("sequelize")
const sequelize = require("../database")
const Article = require("./Article");

const Topic = sequelize.define('topic', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image_url: {
        type: Sequelize.STRING,
        allowNull: false
    },
})

module.exports = Topic
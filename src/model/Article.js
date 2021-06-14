const Sequelize = require("sequelize")
const sequelize = require("../database")
const User = require("./User")

const Article = sequelize.define('article', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false
    },
    topic: {
        type: Sequelize.STRING,
        allowNull: false
    },
    photo: {
        type: Sequelize.STRING
    }
})

Article.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})

module.exports = Article
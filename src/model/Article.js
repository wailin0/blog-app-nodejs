const Sequelize = require("sequelize")
const sequelize = require("../database")
const User = require("./User")
const Topic = require("./Topic");

const Article = sequelize.define('article', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false
    },
    photo: {
        type: Sequelize.STRING
    }
})

Article.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})
Article.belongsTo(Topic, {constraints: true, onDelete: 'CASCADE'})

module.exports = Article
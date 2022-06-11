const Sequelize = require("sequelize")
const sequelize = require("../database")
const User = require("./User")
const Topic = require("./Topic");
const Like = require("./Like");

const Article = sequelize.define('article', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    disabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    photo: {
        type: Sequelize.STRING
    }
})

Article.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})
Article.belongsTo(Topic, {constraints: true, onDelete: 'CASCADE'})
Article.hasMany(Like)

module.exports = Article
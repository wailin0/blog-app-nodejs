const Sequelize = require("sequelize")
const sequelize = require("../database")
const Article = require("./Article");
const User = require("./User");

const Like = sequelize.define('like', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
})

Like.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})


module.exports = Like
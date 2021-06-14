const Sequelize = require("sequelize")
const sequelize = require("../database")
const User = require("../model/User")

const Follow = sequelize.define('follow', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
})

Follow.belongsTo(User, {as: 'following', foreignKey: 'followedId'});
Follow.belongsTo(User, {as: 'follower', foreignKey: 'followerId'});

module.exports = Follow
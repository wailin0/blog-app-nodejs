const Sequelize = require("sequelize")
const sequelize = require("../database")

const Code = sequelize.define('code', {
    code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    used: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    expiredAt: {
        type: Sequelize.DATE,
        allowNull: false,
    },

})

module.exports = Code
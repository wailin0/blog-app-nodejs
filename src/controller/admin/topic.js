const router = require("express").Router()
const Article = require("../model/Article")
const User = require("../model/User")
const jwt = require("jsonwebtoken")
const config = require("../config/config")
const Topic = require("../model/Topic");
const {authenticateUserToken} = require("../utils/userAuthMiddleware");
const {Op} = require("sequelize")
const {topics} = require("../config/topics.js")

router.get("", (req, res) => {
    Topic.findAll({
        order: [['createdAt', 'DESC']]
    })
        .then(topics => {
            return res.json(topics)
        })
        .catch(err => {
            return res.json(err)
        })
})

module.exports = router
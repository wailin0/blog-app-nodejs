const router = require("express").Router()
const Article = require("../model/Article")
const User = require("../model/User")
const jwt = require("jsonwebtoken")
const config = require("../config/config")
const {authenticateUserToken} = require("../utils/userAuthMiddleware");
const {Op} = require("sequelize")
const {topics} = require("../config/topics.js")

router.get("", (req, res) => {
    return res.json(topics)
})

module.exports = router
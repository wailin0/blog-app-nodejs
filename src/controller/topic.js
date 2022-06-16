const router = require("express").Router()
const Topic = require("../model/Topic");
const {authenticateUserToken} = require("../utils/userAuthMiddleware");

router.get("",  authenticateUserToken,(req, res) => {
    Topic.findAll({
        order: [['title', 'asc']]
    })
        .then(topics => {
            return res.json(topics)
        })
        .catch(err => {
            return res.json(err)
        })
})

module.exports = router
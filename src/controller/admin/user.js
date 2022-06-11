const User = require("../../model/User");
const router = require("express").Router()

router.get("",  (req, res) => {

    User.findAll({
        order: [['createdAt', 'DESC']]
    })
        .then(user => {
            return res.json(user)
        })
        .catch(err => {
            return res.json(err)
        })
})

module.exports = router
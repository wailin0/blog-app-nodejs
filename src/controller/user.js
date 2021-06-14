const router = require("express").Router()
const User = require("../model/User")
const jwt = require("jsonwebtoken")
const Article = require("../model/Article")
const Follow = require("../model/Follow")



router.put("", (req, res) => {
    const token = req.headers.authorization
    const decoded = jwt.verify(token, JWT_SECRET)

    User.update(req.body, {where: {id: decoded.id}})
        .then(updatedUser => {
            User.findByPk(decoded.id)
                .then(user => {
                    return res.json(user)
                })
        })
        .catch(err => {
            res.json(err)
        })
})

router.delete("/:id", (req, res) => {
    const articleId = req.params.id

    Article.destroy({where: {id: articleId}})
        .then(() => {
            res.json({"message": "delete success"})
        })
        .catch(err => {
            res.json(err)
        })
})




router.post("/checkemail", (req, res) => {
    const {email} = req.body
    User.findOne({
        where: {email}
    })
        .then(user => {
            if (user) {
                return res.json({"error": "email already in used"})
            } else return res.json({"message": "email not in used"})
        })
        .catch(err => {
            return res.json(err)
        })
})

router.get("/topten-users", (req, res) => {
    User.findAll({
        limit: 10,
        order: [['fame', 'DESC']]
    })
        .then(users => {
            return res.json(users)
        })
        .catch(err => {
            console.log(err)
        })
})

router.post("/follow", (req, res) => {
    const {followedId} = req.body
    const token = req.headers.authorization
    const decoded = jwt.verify(token, JWT_SECRET)

    const following = new Follow({
        followedId,
        followerId: decoded.id
    })

    following.save()
        .then(user => {
            return res.json(user)
        })
        .catch(err => {
            console.log(err)
        })
})

router.get("/:id/following", (req, res) => {
    const followerId = req.params.id

    Follow.findAll({
            where: {followerId},
            include: [{
                model: User,
                as: 'following'
            }]
        }
    )
        .then(users => {
            return res.json(users)
        })
        .catch(err => {
            console.log(err)
        })
})

router.get("/:id/follower", (req, res) => {
    const followedId = req.params.id

    Follow.findAll({
            where: {followedId},
            include: [{
                model: User,
                as: 'follower'
            }]
        }
    )
        .then(users => {
            return res.json(users)
        })
        .catch(err => {
            console.log(err)
        })
})

router.get("/:id/article", (req, res) => {
    const userId = req.params.id
    Article.findAll({
        where: {userId}
    })
        .then(articles => {
            return res.json(articles)
        })
        .catch(err => {
            console.log(err)
        })
})


router.get("/:id", (req, res) => {
    const userId = req.params.id

    User.findByPk(userId)
        .then(user => {
            res.json(user)
        })
        .catch(err => {
            res.json(err)
        })
})


router.get("", (req, res) => {
    const token = req.headers.authorization
    const decoded = jwt.verify(token, JWT_SECRET)
    User.findByPk(decoded.id)
        .then(user => {
            return res.json(user)
        })
        .catch(err => {
            return res.json(err)
        })
})


router.post("/signup", (req, res) => {
    const {name, email, password, headline, aboutMe} = req.body

    console.log(req.body)

    const newUser = new User({
        name,
        email,
        password,
        headline,
        aboutMe
    })

    User.findOne({where: {email: email}})
        .then(user => {
            if (user) {
                return res.status(500).json({"error": "email already in used"})
            } else {
                newUser.save()
                    .then(user => {
                        const token = jwt.sign({id: user.id}, JWT_SECRET)
                        return res.json({token})
                    })
                    .catch(err => {
                        return res.status(500).json(err)
                    })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})


const JWT_SECRET = "secret"

router.post("/signin", (req, res) => {
    const {email, password} = req.body

    User.findOne({where: {email: email}})
        .then(user => {
            if (!user) {
                return res.status(404).json({"message": "Email not found"})
            } else {
                if (user.password === password) {
                    const token = jwt.sign({id: user.id}, JWT_SECRET)
                    res.json({token})
                } else {
                    res.status(401).json({"message": "Invalid email or password"})
                }
            }
        })

})

module.exports = router
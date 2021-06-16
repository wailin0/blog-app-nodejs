const router = require("express").Router()
const User = require("../model/User")
const jwt = require("jsonwebtoken")
const Article = require("../model/Article")
const Follow = require("../model/Follow")

router.get("/:id/checkfollow", (req, res) => {
    const followedId = req.params.id
    const token = req.headers.authorization
    const decoded = jwt.verify(token, JWT_SECRET)

    Follow.findOne({
        where: {
            followerId: decoded.id,
            followedId
        }
    })
        .then(user => {
            if (user) {
                return res.json(true)
            } else return res.json(false)
        })
        .catch(err => {
            return res.json(err)
        })
})


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
            Follow.findOne({
                where: {id: user.id},
                include: {
                    model: User,
                    as: 'following'
                }
            })
                .then(u => {
                    return res.json(u)
                })
                .catch(err => {
                    console.log(err)
                })
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
        where: {userId},
        order: [['createdAt', 'DESC']]
    })
        .then(articles => {
            return res.json(articles)
        })
        .catch(err => {
            console.log(err)
        })
})

router.get("/:id/count", async (req, res) => {
    const userId = req.params.id

    const userArticleCount = await Article.count({where: {userId: userId}})
    const userFollowerCount = await Follow.count({where: {followedId: userId}})
    const userFollowingCount = await Follow.count({where: {followerId: userId}})

    console.log(userFollowingCount)


})


router.get("/:id", async (req, res) => {
    const userId = req.params.id

    const articleCount = await Article.count({where: {userId: userId}})
    const followerCount = await Follow.count({where: {followedId: userId}})
    const followingCount = await Follow.count({where: {followerId: userId}})

    User.findByPk(userId)
        .then(user => {
            const updatedObject = {
                ...user.dataValues,
                articleCount,
                followingCount,
                followerCount
            }
            res.json(updatedObject)
        })
        .catch(err => {
            res.json(err)
        })
})


router.get("", async (req, res) => {
    const token = req.headers.authorization
    const decoded = jwt.verify(token, JWT_SECRET)


    const articleCount = await Article.count({where: {userId: decoded.id}})
    const followerCount = await Follow.count({where: {followedId: decoded.id}})
    const followingCount = await Follow.count({where: {followerId: decoded.id}})

    User.findByPk(decoded.id)
        .then(user => {
            const updatedObject = {
                ...user.dataValues,
                articleCount,
                followingCount,
                followerCount
            }
            return res.json(updatedObject)
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
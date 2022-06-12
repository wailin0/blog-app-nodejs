const router = require("express").Router()
const User = require("../model/User")
const jwt = require("jsonwebtoken")
const Article = require("../model/Article")
const Follow = require("../model/Follow")
const {JWT_SECRET} = require("../config/config");
const {authenticateUserToken} = require("../utils/userAuthMiddleware");

router.get("/:id/checkfollow", authenticateUserToken, (req, res) => {
    const followedId = req.params.id
    const userId = req.user.id

    Follow.findOne({
        where: {
            followerId: userId,
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


router.put("", authenticateUserToken, (req, res) => {
    const userId = req.user.id

    User.update(req.body, {where: {id: userId}})
        .then(updatedUser => {
            User.findByPk(userId)
                .then(user => {
                    return res.json(user)
                })
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
                return res.json(true)
            } else return res.json(false)
        })
        .catch(err => {
            return res.json(err)
        })
})

router.get("/topten-users", authenticateUserToken, (req, res) => {
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

router.post("/follow", authenticateUserToken, (req, res) => {
    const {followedId} = req.body
    const userId = req.user.id

    const following = new Follow({
        followedId,
        followerId: userId
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

router.get("/:id/following", authenticateUserToken, (req, res) => {
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


router.get("/:id", authenticateUserToken, async (req, res) => {
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

router.get("", authenticateUserToken, async (req, res) => {
    const userId = req.user.id

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

router.post("/signup", (req, res) => {
    const {name, email, password, headline, aboutMe} = req.body

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
                        const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '10d'});
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

router.post("/signin", (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        return res.status(400).json({"message": "fields missing"})
    }

    User.findOne({where: {email: email}})
        .then(user => {
            if (!user) {
                return res.status(400).json({"message": "Email not found"})
            } else {
                if (user.password === password) {
                    const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '10d'});
                    res.json({token})
                } else {
                    res.status(400).json({"message": "Invalid email or password"})
                }
            }
        })
})

module.exports = router
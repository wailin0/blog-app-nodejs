const router = require("express").Router()
const User = require("../model/User")
const Article = require("../model/Article")
const Follow = require("../model/Follow")
const Topic = require("../model/Topic");
const Like = require("../model/Like");
const {Sequelize} = require("sequelize");
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

router.post("/follow", authenticateUserToken, async (req, res) => {
    const {followedId} = req.body
    const userId = req.user.id

    try {
        const alreadyFollowed = await Follow.findOne({
            where: {
                followedId,
                followerId: userId
            }
        })
        if (userId === followedId) {
            return res.status(400).json({message: "cannot follow yourself"})
        } else if (alreadyFollowed) {
            return res.status(400).json({message: "already followed"})
        }
        const following = new Follow({
            followedId,
            followerId: userId
        })
        const saved = await following.save()
        const resp = await Follow.findOne({
            where: {id: saved.id},
            include: {
                model: User,
                as: 'following'
            }
        })
        return res.json(resp)
    } catch (e) {
        return res.status(500).json(e)
    }
})

router.post("/unfollow", authenticateUserToken, async (req, res) => {
    const {followedId} = req.body
    const userId = req.user.id

    try {
        const alreadyFollowed = await Follow.findOne({
            where: {
                followedId,
                followerId: userId
            }
        })
        if (!alreadyFollowed) {
            return res.status(400).json({message: "not followed"})
        }
        const response = await Follow.destroy({
            where: {
                followedId,
                followerId: userId
            }
        })
        if (res)
            return res.json(response)
    } catch (e) {
        return res.status(500).json(e)
    }
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

router.get("/:id/article", authenticateUserToken, async (req, res) => {
    const userId = req.params.id
    const authUserId = req.user.id

    const query = {}

    if (userId !== authUserId) {
        query.disabled = false
    }

    Article.findAll({
        where: {
            userId,
            ...query
        },
        order: [['updatedAt', 'DESC']],
        attributes: {
            include: [[Sequelize.fn("COUNT", Sequelize.col("likes.id")), "likeCount"]]
        },
        include: [
            {
                model: Topic
            },
            {
                model: Like,
                attributes: []
            }
        ],
        group: 'article.id'
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

module.exports = router
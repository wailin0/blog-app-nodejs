const router = require("express").Router()
const Article = require("../model/Article")
const User = require("../model/User")
const Topic = require("../model/Topic");
const Like = require("../model/Like");
const sequelize = require("../database");
const {Model} = require("sequelize");
const {Sequelize} = require("sequelize");
const {authenticateUserToken} = require("../utils/userAuthMiddleware");
const {Op} = require("sequelize")

// get popular articles
router.get("/popular-articles", authenticateUserToken, (req, res) => {
    Article.findAll({
        where: {disabled: false},
        order: [['createdAt', 'DESC']]
    })
        .then(articles => {
            return res.json(articles)
        })
        .catch(err => {
            return res.json(err)
        })
})

// create article
router.post("", authenticateUserToken, (req, res) => {
    const userId = req.user.id
    const {title, content, topicId, photo} = req.body

    const article = new Article({
        title,
        content,
        photo,
        topicId,
        userId
    })
    article.save()
        .then(article => {
            Article.findOne({
                where: {id: article.id},
                include: {
                    model: User
                }
            })
                .then(article => {
                    return res.json(article)
                })
                .catch(err => {
                    return res.json(err)
                })
        })
        .catch(err => {
            res.json(err)
        })
})

// update single article
router.put("/:id", authenticateUserToken, (req, res) => {
    const articleId = req.params.id

    Article.update(req.body, {where: {id: articleId}})
        .then(updatedArticle => {
            Article.findOne({
                where: {id: articleId},
                include: {
                    model: User
                }
            })
                .then(article => {
                    return res.json(article)
                })
                .catch(err => {
                    return res.json(err)
                })
        })
        .catch(err => {
            res.json(err)
        })
})

// search article
router.get("", authenticateUserToken, (req, res) => {
    const title = req.query.title
    const topic = req.query.topic
    const limit = req.query.limit

    const query = {}

    if (title) {
        query.title = {
            [Op.like]: `%${title}%`
        }
    }
    if (topic) {
        query.topic = topic
    }

    Article.findAll({
        limit: Number(limit),
        where: {
            ...query,
            disabled: false
        },
        include: {
            model: Topic
        },
        order: [['createdAt', 'DESC']]
    })
        .then(articles => {
            return res.json(articles)
        })
        .catch(err => {
            return res.status(500).json(err)
        })
})

// get single article
router.get("/:id", authenticateUserToken, (req, res) => {
    const articleId = req.params.id

    Article.findOne({
        where: {id: articleId},
        include: {
            model: User
        }
    })
        .then(article => {
            return res.json(article)
        })
        .catch(err => {
            return res.status(500).json(err)
        })
})


// delete article
router.delete("/:id", authenticateUserToken, (req, res) => {
    const articleId = req.params.id

    Article.destroy({where: {id: articleId}})
        .then(() => {
            return res.json({"message": "delete success"})
        })
        .catch(err => {
            return res.status(500).json(err)
        })
})

// like a article
router.post("/:id/like", authenticateUserToken, async (req, res) => {
    const articleId = req.params.id
    const userId = req.user.id
    try {

        const alreadyLiked = await Like.findOne({
            where: {userId, articleId}
        })
        if (alreadyLiked) {
            return res.status(400).json({message: "already liked this article"})
        }
        const createdLike = await Like.create({
            ...req.body,
            articleId,
            userId
        })
        return res.status(201).json(createdLike)
    } catch (e) {
        return res.status(500).json(e)
    }
})

// unlike a article
router.delete("/:id/unlike", authenticateUserToken, async (req, res) => {
    const articleId = req.params.id
    const userId = req.user.id
    try {
        await Like.destroy({
            where: {
                userId,
                articleId
            }
        })
        return res.sendStatus(200)
    } catch (e) {
        return res.status(500).json(e)
    }
})

// unlike a article
router.post("/:id/unlike", authenticateUserToken, async (req, res) => {
    const articleId = req.params.id
    const userId = req.user.id
    try {
        await Like.destroy({
            where: {
                userId,
                articleId
            }
        })
        return res.sendStatus(200)
    } catch (e) {
        return res.status(500).json(e)
    }
})

// check if already liked article or not
router.post("/:id/checklike", authenticateUserToken, async (req, res) => {
    const articleId = req.params.id
    const userId = req.user.id
    try {
        const liked = await Like.findOne({
            where: {
                userId,
                articleId
            }
        })
        if (liked) {
            return res.json(true)
        }
        return res.json(false)
    } catch (e) {
        return res.status(500).json(e)
    }
})


module.exports = router
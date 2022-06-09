const router = require("express").Router()
const Article = require("../model/Article")
const User = require("../model/User")
const jwt = require("jsonwebtoken")
const config = require("../config/config")
const Topic = require("../model/Topic");
const {authenticateUserToken} = require("../utils/userAuthMiddleware");
const {Op} = require("sequelize")
const {topics} = require("../config/topics.js")


router.get("/popular-articles", authenticateUserToken, (req, res) => {
    Article.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']]
    })
        .then(articles => {
            return res.json(articles)
        })
        .catch(err => {
            return res.json(err)
        })
})

router.post("", authenticateUserToken, (req, res) => {
    const userId = req.user.id
    const {title, content, topicId, photo} = req.body

    const article = new Article({
        title,
        content,
        topicId,
        photo,
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


router.get("", authenticateUserToken, (req, res) => {
    const title = req.query.title
    const topic = req.query.topic
    const offset = req.query.page

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
        where: query,
        include: {
            model: Topic
        },
        order: [['createdAt', 'DESC']]
    })
        .then(articles => {
            res.json(articles)
        })
        .catch(err => {
            res.json(err)
        })
})

router.get("/:id", authenticateUserToken, (req, res) => {
    const articleId = req.params.id

    Article.findOne({
        where: {id: articleId},
        include: {
            model: User
        }
    })
        .then(article => {
            res.json(article)
        })
        .catch(err => {
            res.json(err)
        })
})

router.delete("/:id", authenticateUserToken, (req, res) => {
    const articleId = req.params.id

    Article.destroy({where: {id: articleId}})
        .then(() => {
            res.json({"message": "delete success"})
        })
        .catch(err => {
            res.json(err)
        })
})

module.exports = router
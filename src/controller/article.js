const router = require("express").Router()
const Article = require("../model/Article")
const User = require("../model/User")
const jwt = require("jsonwebtoken")
const config = require("../config/config")
const {Op} = require("sequelize")
const {topics} = require("../config/topics.js")

router.get("/topic", (req, res) => {
    return res.json(topics)
})

router.get("/popular-articles", (req, res) => {
    Article.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']]
    })
        .then(articles => {
            res.json(articles)
        })
        .catch(err => {
            res.json(err)
        })
})

router.post("", (req, res) => {
    const token = req.headers.authorization
    const decoded = jwt.verify(token, config.JWT_SECRET)
    const {title, content, topic, photo} = req.body

    const article = new Article({
        title,
        content,
        topic,
        photo,
        userId: decoded.id
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

router.get("", (req, res) => {
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
        order: [['createdAt', 'DESC']]
    })
        .then(articles => {
            res.json(articles)
        })
        .catch(err => {
            res.json(err)
        })
})

router.get("/:id", (req, res) => {
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


router.put("/:id", (req, res) => {
    const articleId = req.params.id

    Article.update(req.body, {where: {id: articleId}})
        .then(updatedArticle => {
            Article.findByPk(articleId)
                .then(article => {
                    return res.json(article)
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

module.exports = router
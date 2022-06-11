const router = require("express").Router()
const Article = require("../../model/Article");

router.get("", (req, res) => {
    Article.findAll({
        order: [['createdAt', 'DESC']]
    })
        .then(articles => {
            return res.json(articles)
        })
        .catch(err => {
            return res.json(err)
        })
})

router.put("/:id", async (req, res) => {
    const articleId = req.params.id

    Article.update(req.body, {where: {id: articleId}})
        .then(updatedTopic => {
            Article.findOne({
                where: {id: articleId}
            })
                .then(topic => {
                    return res.json(topic)
                })
                .catch(err => {
                    return res.status(500).json(err)
                })
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

module.exports = router
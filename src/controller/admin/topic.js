const Topic = require("../../model/Topic");
const router = require("express").Router()


router.get("", (req, res) => {
    Topic.findAll({
        order: [['createdAt', 'DESC']]
    })
        .then(topics => {
            return res.json(topics)
        })
        .catch(err => {
            return res.json(err)
        })
})


router.post("", (req, res) => {
    const {title, image_url} = req.body

    const topic = new Topic({
        title,
        image_url
    })
    topic.save()
        .then(topic => {
            Topic.findOne({
                where: {id: topic.id},
            })
                .then(topic => {
                    return res.json(topic)
                })
                .catch(err => {
                    return res.json(err)
                })
        })
        .catch(err => {
            res.json(err)
        })
})

router.put("/:id", (req, res) => {
    const topicId = req.params.id

    Topic.update(req.body, {where: {id: topicId}})
        .then(updatedTopic => {
            Topic.findOne({
                where: {id: topicId}
            })
                .then(topic => {
                    return res.json(topic)
                })
                .catch(err => {
                    return res.json(err)
                })
        })
        .catch(err => {
            res.json(err)
        })
})

router.delete("/:id", (req, res) => {
    const topicId = req.params.id

    Topic.destroy({where: {id: topicId}})
        .then(() => {
            res.json({"message": "delete success"})
        })
        .catch(err => {
            res.json(err)
        })
})


module.exports = router
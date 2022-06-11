const express = require("express")
const cors = require('cors')
const sequelize = require("./database")
const userController = require("./controller/user")
const articleController = require("../src/controller/article")
const topicController = require("../src/controller/topic")
const adminTopicController = require("../src/controller/admin/topic")
const adminArticleController = require("../src/controller/admin/article")
const adminUserController = require("../src/controller/admin/user")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/user", userController)
app.use("/api/article", articleController)
app.use("/api/topic", topicController)

// admin routes
app.use("/admin/api/topic", adminTopicController)
app.use("/admin/api/user", adminUserController)
app.use("/admin/api/article", adminArticleController)

const port = process.env.PORT || 3000;


sequelize
    .sync({force: false})
    .then(result => {
        console.log(result)
        app.listen(port)
    })
    .catch(err => {
        console.log(err)
    })
const express = require("express")
const cors = require('cors')
const sequelize = require("./database")
const userController = require("./controller/user")
const articleController = require("../src/controller/article")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/user", userController)
app.use("/api/article", articleController)


const port = process.env.PORT || 3000;


sequelize
    .sync({force: true})
    .then(result => {
        console.log(result)
        app.listen(port)
    })
    .catch(err => {
        console.log(err)
    })
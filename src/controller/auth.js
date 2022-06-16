const router = require("express").Router()
const User = require("../model/User")
const jwt = require("jsonwebtoken")
const Article = require("../model/Article")
const Follow = require("../model/Follow")
const Code = require("../model/Code");
const {Op} = require("sequelize");
const {sendMail} = require("../utils/mail");
const {JWT_SECRET} = require("../config/config");
const {authenticateUserToken} = require("../utils/userAuthMiddleware");

router.get("/user", authenticateUserToken, async (req, res) => {
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

    const newUser = new User(req.body)

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
                return res.status(400).json({"message": "invalid email or password"})
            } else {
                if (user.password === password) {
                    const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '10d'});
                    res.json({token})
                } else {
                    res.status(400).json({"message": "invalid email or password"})
                }
            }
        })
})

router.post("/recover", async (req, res) => {
    const {email} = req.body

    if (!email) {
        return res.status(400).json({"message": "email missing"})
    }

    try {
        const user = await User.findOne({where: {email}})
        if (!user) {
            return res.status(400).json({"message": "email doesn't exists"})
        } else {
            const code = (Math.random() + 1).toString(36).substring(3);

            const date = new Date();
            date.setDate(date.getDate() + 1);

            await Code.create({
                code,
                email,
                expiredAt: date
            })
            const subject = "account recover"

            const htmlBody = `<h3>Code to reset your password</h3>
            <h1 style="text-align: center;">${code}</h1>`

            await sendMail(email, subject, htmlBody)
            return res.json({"message": `recovery email sent to ${email}`})
        }
    } catch (e) {
        res.status(500).json(e)
    }
})

router.post("/verify", async (req, res) => {
    const {email, code} = req.body

    if (!email || !code) {
        return res.status(400).json({"message": "fields missing"})
    }
    try {
        const response = await Code.findOne({
            where: {
                email, code, used: false,
                expiredAt: {
                    [Op.gt]: new Date(Date.now()),
                }
            }
        })
        if (response) {
            return res.json({"message": "code verification success"})
        } else {
            return res.status(400).json({"message": "code verification failed"})
        }
    } catch (e) {
        return res.status(500).json(e)
    }
})

router.post("/reset", async (req, res) => {
    const {email, code, newPassword} = req.body

    if (!email || !code || !newPassword) {
        return res.status(400).json({"message": "fields missing"})
    }
    try {
        const response = await Code.findOne({
            where: {
                email, code, used: false,
                expiredAt: {
                    [Op.gt]: new Date(Date.now()),
                }
            }
        })
        if (response) {
            await User.update({password: newPassword}, {where: {email}})
            await Code.update({used: true}, {where: {code, email}})
            return res.json({"message": "password reset successful"})
        } else {
            return res.status(400).json({"message": "error resetting password"})
        }
    } catch (e) {
        return res.status(500).json(e)
    }
})

module.exports = router
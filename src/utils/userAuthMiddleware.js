const jwt = require("jsonwebtoken");
const User = require("../model/User");
const {JWT_SECRET} = require("../config/config");

const authenticateUserToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const accessToken = authHeader && authHeader.split(' ')[1]
    if (!accessToken) {
        return res.status(401).send("you need user token to access this resource")
    }
    try {
        const validatedUser = jwt.verify(accessToken, JWT_SECRET);
        const user = await User.findByPk(validatedUser.id)
        if (!user) {
            return res.status(401).send("no account found")
        }
        if (user.disabled) {
            return res.status(403).send("your account is disabled")
        }

        req.user = validatedUser;
        if (validatedUser) {
            return next();
        }
    } catch (err) {
        return res.status(401).json(err);
    }
};

module.exports = {authenticateUserToken};
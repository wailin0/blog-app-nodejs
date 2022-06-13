const nodemailer = require("nodemailer");


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "axratechnology@gmail.com",
        pass: "bdujdgqeimzfwxhl",
    },
});

const sendMail = async (to, subject, html) => {
    let mailOptions = {
        from: "axratechnology@gmail.com",
        to,
        subject,
        html,
    };
    try {
        return await transporter.sendMail(mailOptions)
    } catch (e) {
        return e
    }
}

module.exports = {sendMail}
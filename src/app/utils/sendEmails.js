const nodemailer = require("nodemailer")

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            // service: process.env.SERVICE,
            port: 587,
            secure: false,
            auth: {
                user:"hiepnmhh.hh@gmail.com",
                pass: "auvqcwgvyeafcpeg"
            },
        });

        const response = await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully", response);
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;
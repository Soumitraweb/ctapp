const config = require('../../config/config');
const nodemailer = require('nodemailer');

exports.sendEmail = async (email, subject, body) => {
    const transporter = nodemailer.createTransport({
        host: config.email.smtpHost, 
        port: config.email.smtpPort,
        secure: false,
        auth: {
            user: config.email.user, // Your email
            pass: config.email.pass, // Your email password
        },
    });
    const mailOptions = {
        from: config.email.fromEmail,
        to: email,
        subject: subject,
        html: body,
    };
    await transporter.sendMail(mailOptions);
};

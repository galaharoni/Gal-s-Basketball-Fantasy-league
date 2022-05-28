const nodemailer = require('nodemailer');
const config = require('config.json');

module.exports = sendEmail;
/**
 * sendEmail:
 * @param  {} {to
 * @param  {} subject
 * @param  {} html
 * @param  {} from=config.emailFrom}
 */
async function sendEmail({ to, subject, html, from = config.emailFrom }) {
    const transporter = nodemailer.createTransport(config.smtpOptions);
    await transporter.sendMail({ from, to, subject, html });
}
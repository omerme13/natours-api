const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Omer Menachem <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'development') {
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
        }

        return nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD,
            }
        })
    }

    async send(template, subject) {
        const html = pug.renderFile(
            `${__dirname}/../views/email/${template}.pug`,
            {
                subject,
                firstName: this.firstName,
                url: this.url
            }
        );

        const mailOptions = {
            subject,
            html,
            from: this.from,
            to: this.to,
            text: htmlToText.fromString(html)
        };

        const transport = this.newTransport();
        await transport.sendMail(mailOptions);

    }
    
    async sendWelcome() {
        await this.send('welcome', 'Welcome to the natours family');
    }
        
    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token (valid for 10 minutes)'
        );
    }
}

module.exports = Email;

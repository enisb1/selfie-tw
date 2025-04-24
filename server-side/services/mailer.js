import nodemailer from "nodemailer";
import User from "../models/User.js";

export class Mailer {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'noreply.selfie.tw@gmail.com',
                pass: 'bwus ttnm brvh caqr',

            }
        });
    }

    async sendMail(message, receiver, subject = 'New Notification') {
        const mailOptions = {
            from: 'noreply.selfie.tw@gmail.com',
            to: receiver,
            subject: subject,
            text: message
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Failed to send email:', error);
        }
    }

    async sendMailWithAttachments(to, subject, text, attachments) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text,
            attachments: attachments,
        };
    
        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Failed to send email:', error);
        }
    }

    async getEmailFromUsername(username){
        const user = await User.findOne({username: username});

        if (user) {
            return user.email;
        }
    }

    async getEmailFromUserId(userID){
        const user = await User.findById(userID);
        if (user) {
            return user.email;
        }
    }
}
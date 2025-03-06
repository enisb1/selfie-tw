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

    async sendMail(message, receiver, subject = 'Nuova Notifica') {
        const mailOptions = {
            from: 'noreply.selfie.tw@gmail.com',
            to: receiver,
            subject: subject,
            text: message
        };
        try {
            //TODO: disattivato per debug
            //const info = await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Errore invio della mail:', error);
        }
    }

    async getEmailFromUsername(username){
        const user = await User.findOne({username: username});

        if (user) {
            return user.email;
        }else return "";
    }

    async getEmailFromUserId(userID){
        const user = await User.findById(userID);
        if (user) {
            return user.email;
        }else return "";
    }
}
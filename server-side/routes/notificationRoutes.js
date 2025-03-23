import Router from 'express';
import Notification from "../models/Notification.js";
import {Message} from "../services/wsHandler.js";
import {mailer, wsConnectionHandler} from "../server-deploy.js";
import Activity from "../models/Activity.js";
import Event from '../models/Event.js'
import Project from "../models/Project.js";

const router = Router();

router.post("/addNotification", async (req, res) => {
    try {
        const message = new Notification({
            sender: req.body.sender,
            receiver: req.body.receiver,
            time: req.body.time,
            read: req.body.read,
            title: req.body.title,
            text: req.body.text,
            type: req.body.type
        });
        await message.save();
        await wsConnectionHandler.sendPushNotification(new Message('server', req.body.receiver, 'notification', message));
        await mailer.sendMail(message.text, await mailer.getEmailFromUsername(req.body.receiver), message.title);
        res.status(201).json({ message: 'Notification sent' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post("/getNotifications", async (req, res) => {
    try {
        const notifications = await Notification.find({ receiver : req.query.receiver });
        res.status(200).json({ message: 'Notifications found', data: notifications});
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post("/getNewNotifications", async (req, res) => {
    try {
        const notifications = await Notification.find({ receiver: req.body.receiver, read: false }).sort({ time: -1 });
        res.status(200).json({ message: 'New notifications found', data: notifications});
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post("/readNotification", async (req, res) => {
    try {
        await Notification.updateOne({ _id: req.body._id },{read:true});
        res.status(200).json({ message: 'Notification read' });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


/**
 * Send an invite to a user
 * @param {String} sender - the user sending the invite
 * @param {String} receiver - the user receiving the invite
 * @param {Object} event - the event being invited to
 */

// TODO: questo non viene usato
router.post("/sendEventInvite", async (req, res) => {
    try {
        const message = new Notification({
            sender: req.body.sender,
            receiver: req.body.receiver,
            time: new Date(),
            read: false,
            title: req.body.event.title,
            text: `You have been invited to the event: ${req.body.event.title}`,
            type: 'invite',
            data: {
                type: "event",
                id: req.body.event._id,
                status: "pending"
            }
        });
        await message.save();
        await wsConnectionHandler.sendPushNotification(new Message('server', req.body.receiver, 'notification', message));
        await mailer.sendMail(`You have been invited to the event: ${req.body.event.title}`, await mailer.getEmailFromUsername(req.body.receiver),req.body.event.title);
        res.status(201).json({ message: 'Notification sent' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * Accept an invite
 * @param {String} id - the id of the event or activity
 * @param {String} userId - the user accepting the invite
 * @param {String} notificationId - the id of the notification
 * @param {String} type - the type of the invite
 */
router.post("/acceptInvite", async (req, res) => {
    try {
        if (req.body.type === 'event'){
            await Event.updateOne({ _id: req.body.id },{ $push: { users: req.body.userId } });
            await Notification.updateOne({ _id: req.body.notificationId },{ $set: { "data.status": "accepted" } });
        } else if (req.body.type === 'activity'){
            await Activity.updateOne({ _id: req.body.id },{ $push: { users: req.body.userId } });
            await Notification.updateOne({ _id: req.body.notificationId },{ $set: { "data.status": "accepted" } });
        } else if (req.body.type === 'project'){
            await Project.updateOne({ _id: req.body.id },{ $push: { members: req.body.userId } });
            await Notification.updateOne({ _id: req.body.notificationId },{ $set: { "data.status": "accepted" } });
        }

    }catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * Decline an invite
 * @param {String} notificationId - the id of the notification
 */
router.post("/declineInvite", async (req, res) => {
    try {
        await Notification.updateOne({ _id: req.id },{ $set: { "data.status": "declined" } });
    }catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * Share pomodoro config
 * @param {String} sender - the user sending the invite
 * @param {String} receiver - the user receiving the invite
 * @param {Number} minuteStudy - the minutes of study
 * @param {Number} minuteRelax - the minutes of relax
 * @param {Number} numCycles - the number of cycles
 */

router.post("/sharePomodoroConfig", async (req, res) => {
    try {
        const message = new Notification({
            sender: req.body.sender,
            receiver: req.body.receiver,
            time: new Date(),
            read: false,
            title: "Pomodoro Config",
            text: `You have received a Pomodoro configuration from ${req.body.sender}`,
            type: 'pomodoro',
            data: {
                minuteStudy: req.body.minuteStudy,
                minuteRelax: req.body.minuteRelax,
                numCycles: req.body.numCycles
            }
        });
        await message.save();
        await wsConnectionHandler.sendPushNotification(new Message(req.body.sender, req.body.receiver, 'notification', message));
        res.status(201).json({ message: 'Pomodoro config sent' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;



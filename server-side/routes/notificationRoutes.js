import Router from 'express';
import Notification from "../models/Notification.js";
import {Message} from "../ws/wsHandler.js";
import {wsConnectionHandler} from "../server-deploy.js";

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
        wsConnectionHandler.sendPushNotification(new Message('server', req.body.receiver, 'notification', message));
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
        const notifications = await Notification.find({ receiver : req.body.receiver , read: false});
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

export default router;



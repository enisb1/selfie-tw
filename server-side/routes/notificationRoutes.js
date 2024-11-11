import Router from 'express';
import Notification from "../models/Notification.js";

const router = Router();

router.post("/addNotification", async (req, res) => {
    try {
        const message = new Notification({
            sender: req.body.sender,
            receiver: req.body.receiver,
            time: req.body.time,
            read: req.body.read,
            text: req.body.text
        });
        await message.save();
        res.status(201).json({ message: 'Notification sent' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get("/getMessages", async (req, res) => {
    try {
        const messages = await Notification.find({ receiver : req.query.receiver });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;



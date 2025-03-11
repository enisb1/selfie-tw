import Router from 'express';
import ChatMessage from "../models/ChatMessage.js";
import {Message} from "../services/wsHandler.js";
import {wsConnectionHandler} from "../server-deploy.js";

const router = Router();

router.get('/messages', async (req, res) => {
    try {
        const messages = await ChatMessage.find();
        res.json({message: 'Chat messages found', data: messages});
    } catch (err) {
        res.json({message: err});
    }
});

router.post('/postMessage', async (req, res) => {
    const message = new ChatMessage({
        sender: req.body.sender,
        time: new Date(),
        message: req.body.message
    });

    try {
        const savedMessage = await message.save();
        wsConnectionHandler.broadcast(new Message('server', 'broadcast','chat', savedMessage));
        res.json({message: 'Chat message sent', data: savedMessage});
    } catch (err) {
        res.json({message: err});
    }
});

export default router;
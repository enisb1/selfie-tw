import Router from 'express';
import {agendaHandler, timeMachineController} from '../server-deploy.js';

const router = Router();

router.post("/setNewGlobalTime", async (req, res) => {
    try {
        await agendaHandler.disablePastScheduledNotifications(new Date(req.body.date))
        await timeMachineController.setNewGlobalTime(new Date(req.body.date));
        await agendaHandler.enableFutureScheduledNotifications(new Date(req.body.date));
        res.status(201).json({ message: 'Time set' });
    } catch (error) {
        console.error('Error setting time:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post("/rollBackTime", async (req, res) => {
    try {
        await timeMachineController.rollBackTime();
        await agendaHandler.enableFutureScheduledNotifications(new Date());
        res.status(201).json({ message: 'Time rolled back' , data: new Date()});
    } catch (error) {
        console.error('Error rolling back time:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get("/serverTime", async (req, res) => {
    try {
        res.status(200).json({ message: 'Server time', data: new Date()});
    } catch (error) {
        console.error('Error getting server time:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
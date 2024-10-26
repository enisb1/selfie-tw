import Router from 'express';
import Event from '../models/Event.js'

const router = Router();

router.post("/addEvent", async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json({ message: 'Data saved successfully' });
    }catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get("/getEvents", async (req, res) => {
    try {
        const events = await Event.find(); // retrieve all events from the database
        console.log('here');
        console.log(events);
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving events', error });
    }
});

export default router;
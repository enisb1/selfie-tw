import Router from 'express';
import Event from '../models/Event.js'

const router = Router();

//TODO: check if it's best to put the code inside each api call in a separate file

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

// '/api/calendar/events?start=(..)&end=(..)'
router.get("/events", async (req,res) => {
    const { start, end } = req.query;
    // convert received string dates to Dates
    const sDate = new Date(start);
    const eDate = new Date(end);
    try {
        const events = await Event.find({
        startDate: { $gte: sDate },
        endDate: {$lte: eDate }
        });
        
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
})

export default router;
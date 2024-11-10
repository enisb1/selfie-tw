import Router from 'express';
import Event from '../models/Event.js'
import Activity from '../models/Activity.js'

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

router.post("/addActivity", async (req, res) => {
    try {
        const activity = new Activity(req.body);
        await activity.save();
        res.status(201).json({ message: 'Data saved successfully' });
    }catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// retrieve all events from db (//TODO: if not used delete this)
router.get("/getEvents", async (req, res) => {
    try {
        const events = await Event.find(); // retrieve all events from the database
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving events', error });
    }
});

// '/api/calendar/activities?start=(..)&end=(..)'
router.get("/activities", async (req,res) => {
    // start: start date string in UTC TIME!
    // end: end date string in UTC TIME!
    // dates are stored in UTC time on mongodb, and sent back to client in local time
    const { start, end } = req.query;
    const sDate = new Date(start);
    const eDate = new Date(end);
    try {
        // get events that start in the range, or finish in range, or start before and finish after range
        // the render function for the calendar is going to truncate the dates accordingly
        const activities = await Activity.find({
            deadline: {$gte: sDate, $lte: eDate}
        });
        
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
})

// delete activity given id
router.delete("/activities/:id", async (req, res) => {
    const activityId = req.params.id;
    try {
        const result = await Activity.findByIdAndDelete(activityId);

        if (result) {
            res.status(200).json({ message: 'Activity deleted successfully', activity: result });
        } else {
            res.status(404).json({ message: 'Activity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting activity', error: error.message });
    }
})

// '/api/calendar/events?start=(..)&end=(..)'
router.get("/events", async (req,res) => {
    // start: start date string in UTC TIME!
    // end: end date string in UTC TIME!
    // dates are stored in UTC time on mongodb, and sent back to client in local time
    const { start, end } = req.query;
    const sDate = new Date(start);
    const eDate = new Date(end);
    try {
        // get events that start in the range, or finish in range, or start before and finish after range
        // the render function for the calendar is going to truncate the dates accordingly
        const events = await Event.find({
            $or: [
                { endDate: { $gte: sDate, $lte: eDate } },  // end in range
                { startDate: { $gte: sDate, $lte: eDate } }, // start in range
                { startDate: { $lte: sDate }, endDate: { $gte: eDate } } // (spanning the entire range)
            ]
        });
        
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
})

// delete event given id
router.delete("/events/:id", async (req, res) => {
    const eventId = req.params.id;
    try {
        const result = await Event.findByIdAndDelete(eventId);

        if (result) {
            res.status(200).json({ message: 'Event deleted successfully', event: result });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
})

export default router;
import Router from 'express';
import Event from '../models/Event.js'

const router = Router();

router.post("/addEvent", async (req, res) => {
    try {
        console.log("received data: ", req.body)
        const formData = new Event(req.body);
        await formData.save()
        res.status(201).json({ message: 'Data saved successfully' })
    }catch (error) {
        console.error('Error saving data:', error)
        res.status(500).json({ message: 'Server error' })
    }
});

export default router;
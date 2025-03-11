import Router from "express";
import Pomodoro from '../models/Pomodoro.js';



const router = Router()

router.post('/addSettingsPom', async (req, res) => {
    try {
        const pomSettings = new Pomodoro(req.body);
        await pomSettings.save();
        res.status(201).json({ message: 'Pomodoro settings saved successfully' });
    }catch (error) {
        console.error('Error saving Pomodoro settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/getUserSettingsPom', async(req, res) => {
    const username = req.query.user
    try{
        const settingPom = await Pomodoro.find({user: username})
        res.json(settingPom)
    }catch(error){
        console.error("Error retrieving settings pom: ", error)
        res.status(500).json({message: 'Server error'})
    }
})

export default router;
import Router from 'express';
import Project from '../models/Project.js';

const router = Router();

// Create a new project
router.post('/createProject', async (req, res) => {
    try {
        const newProject = new Project(req.body);
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
});

export default router;
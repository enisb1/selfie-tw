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

// Get all projects in which the user participates
router.get('/projectsByUser/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const projects = await Project.find({
            $or: [
                { owner: userId },
                { members: userId }
            ]
        });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
});

// Add a new activity to a project's activities field
router.put('/addActivityToProject/:projectId', async (req, res) => {
    const { projectId } = req.params;
    const { activityId } = req.body;

    try {
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $push: { activities: activityId } },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
});

export default router;
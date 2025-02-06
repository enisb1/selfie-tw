import Router from 'express';
import Project from '../models/Project.js';
import Activity from '../models/Activity.js';

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

// Get all activities by project ID
router.get('/activitiesByProject/:projectId', async (req, res) => {
    const { projectId } = req.params;
  
    try {
        const activities = await Activity.find({ 'projectData.projectId': projectId });
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities', error: error.message });
    }
  });

// Update activity startDate by activity ID
router.put('/editStartDate/:activityId', async (req, res) => {
    const { activityId } = req.params;
    const { startDate } = req.body;
    try {
        const updatedActivity = await Activity.findOneAndUpdate(
            { 'projectData._id': activityId },
            { 'projectData.startDate': new Date(startDate) },
            { new: true }
        );
        
        if (!updatedActivity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.status(200).json(updatedActivity);
    } catch (error) {
        res.status(500).json({ message: 'Error updating activity', error: error.message });
    }
});

// Update activity deadline by activity ID
router.put('/editDeadline/:activityId', async (req, res) => {
    const { activityId } = req.params;
    const { deadline } = req.body;
    try {
        const updatedActivity = await Activity.findOneAndUpdate(
            { 'projectData._id': activityId },
            { 'deadline': new Date(deadline) },
            { new: true }
        );
        
        if (!updatedActivity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.status(200).json(updatedActivity);
    } catch (error) {
        res.status(500).json({ message: 'Error updating activity', error: error.message });
    }
});

export default router;
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

// Update activities with previous activity equal to activityId and status 'waitingActivable'
router.put("/updateWaitingActivable/:id", async (req, res) => {
    const activityId = req.params.id;
    const { output } = req.body; // Get the output from the request body
    
    try {
        const result = await Activity.updateMany(
            { 'projectData.previous': activityId, 'projectData.status': 'waitingActivable' },
            { $set: { 'projectData.status': 'activable', 'projectData.input': output } }
        );

        res.status(200).json({
            message: 'Activities updated successfully',
            updatedCount: result.nModified
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating activities', error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    const projectId = req.params.id;
    const { name, description, start, end, users } = req.body;

    try {
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { name, description, start, end, users },
            { new: true }
        );

        if (updatedProject) {
            res.status(200).json({
                message: 'Project updated successfully',
                project: updatedProject
            });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
});

export default router;
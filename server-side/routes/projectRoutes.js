import Router from 'express';
import Project from '../models/Project.js';
import Activity from '../models/Activity.js';
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import {wsConnectionHandler} from "../server-deploy.js";
import {Message} from "../services/wsHandler.js";

const router = Router();

// Create a new project
router.post('/createProject', async (req, res) => {
    try {

        const newProject =
            new Project({
                name: req.body.name,
                description: req.body.description,
                start: req.body.start,
                end: req.body.end,
                owner: req.body.owner,
                members: req.body.owner,
                activities: []
            });
        const savedProject = await newProject.save();
        await sendProjectInviteNotifications(savedProject, req.body.members, req.body.owner);
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
});

async function sendProjectInviteNotifications(project, memberIDs, creatorID) {
    const creator = await User.findOne({_id: creatorID});

    for (const memberID of memberIDs) {
        const member = await User.findOne({_id: memberID});
        const notification = new Notification({
            sender: creator.username,
            receiver: member.username,
            time: new Date(),
            read: false,
            title: 'Project invitation',
            text: `You have been invited to join project ${project.name}, created by ${creator.username}.`,
            type: 'invite',
            data: {
                type: "project",
                id: project._id,
                status: "pending"
            }
        });
        await notification.save();
        await wsConnectionHandler.sendPushNotification(new Message('server', member.username, 'notification', notification));
    }
}

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
    const { compressedStartDate } = req.body;
    try {
        const updatedActivity = await Activity.findOneAndUpdate(
            { 'projectData._id': activityId },
            { 'projectData.compressedStartDate': new Date(compressedStartDate) },
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
    }})
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
    const { name, description, start, end, owner, members } = req.body;

    try {

        const project = await Project.findById(projectId);
        const newMembers = members.filter(member => !project.members.includes(member));
        const oldMembers = project.members.filter(member => members.includes(member));

        console.log("membri arrivati dalla put",members);
        console.log("membri del progetto sul db",project.members);

        console.log("nuovi membri",newMembers);
        console.log("vecchi membri",oldMembers);

        await sendProjectInviteNotifications(project, newMembers, owner);

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { name, description, start, end, owner, members: oldMembers },
            { new: true }
        );

        console.log("progetto aggiornato",updatedProject);

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

router.get('/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete project and its activities by project ID
router.delete('/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        // Find the project by ID
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Delete all activities associated with the project
        await Activity.deleteMany({ _id: { $in: project.activities } });

        // Delete the project
        await Project.findByIdAndDelete(projectId);

        res.json({ message: 'Project and its activities deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting project and its activities' });
    }
});

export default router;
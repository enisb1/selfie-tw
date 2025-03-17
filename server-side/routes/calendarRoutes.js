import Router from 'express';
import Event from '../models/Event.js'
import Activity from '../models/Activity.js'
import Resource from '../models/Resource.js';
import Project from '../models/Project.js';
import mongoose, { mongo } from 'mongoose';
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import {mailer, wsConnectionHandler} from "../server-deploy.js";
import {Message} from "../services/wsHandler.js";
import {agendaHandler} from "../server-deploy.js";
import multer from 'multer';

const router = Router();

//TODO: check if it's best to put the code inside each api call in a separate file

router.post("/addEvent", async (req, res) => {
    try {
        const event = new Event(
            {
                title: req.body.title,
                location: req.body.location,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                frequency: req.body.frequency,
                repetitionNumber: req.body.repetitionNumber,
                repetitionDate: req.body.repetitionDate,
                color: req.body.color,
                users: [req.body.creator],
                resources: req.body.resources,
                notify15Before: req.body.notify15Before,
                notify30Before: req.body.notify30Before,
                notify1HourBefore: req.body.notify1HourBefore,
                notify1DayBefore: req.body.notify1DayBefore,
                pomodoroSettings: req.body.pomodoroSettings
            }
        );
        await event.save();
        await sendEventNotificationToUsers(event, req.body.users, req.body.creator);
        await agendaHandler.scheduleEventNotifications(event);
        res.status(201).json({ message: 'Data saved successfully' });
    }catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

//TODO: sposta questa funzione da qui
async function sendEventNotificationToUsers(event, users, creator) {
    for (const userId of users) {
        const user = await User.findOne({_id: userId});
        const notification = new Notification({
            sender: creator,
            receiver: user.username,
            time: new Date(),
            read: false,
            title: event.title,
            text: `You have been invited to the event: ${event.title}`,
            type: "invite",
            data: {
                type: "event",
                id: event._id,
                status: "pending"
            }
        });
        await notification.save();
        await wsConnectionHandler.sendPushNotification(new Message('server', user.username, 'notification', notification));
    }
}

router.post("/addActivity", async (req, res) => {
    try {
        const activity = new Activity({
            title: req.body.title,
            deadline: req.body.deadline,
            isDone: false,
            users: [req.body.creator],
            compositeActivity: req.body.compositeActivity,
            projectData: req.body.projectData
            }
        );
        await activity.save();
        await sendActivityNotificationToUsers(activity, req.body.users, req.body.creator);
        await agendaHandler.scheduleActivityNotifications(activity);
        res.status(201).json({ message: 'Data saved successfully', data: activity });
    }catch (error) {
        console.log(error)
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post("/addActivityNoInvite", async (req, res) => {
    try {
        const activity = new Activity({
                title: req.body.title,
                deadline: req.body.deadline,
                isDone: false,
                users: req.body.users,
                compositeActivity: null,
                projectData: req.body.projectData
            }
        );
        await activity.save();
        res.status(201).json({ message: 'Data saved successfully', data: activity });
    }catch (error) {
        console.log(error)
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Server error' });
    }
})


// TODO: magari sposta questa funzione da qui
async function sendActivityNotificationToUsers(activity, users,creator) {
    for (const userId of users) {
        const user = await User.findOne({_id: userId});
        const notification = new Notification({
            sender: creator,
            receiver: user.username,
            time: new Date(),
            read: false,
            title: activity.title,
            text: `You have been invited to the activity: ${activity.title}`,
            type: "invite",
            data: {
                type: "activity",
                id: activity._id,
                status: "pending"
            }
        });
        await notification.save();
        await wsConnectionHandler.sendPushNotification(new Message('server', user.username, 'notification', notification));
        await mailer.sendMail(`You have been invited to the activity: ${activity.title}`, user.email,activity.title);
    }
}

// Update an activity to add a project ID
router.put('/updateActivityProjectId/:id', async (req, res) => {
  const { id } = req.params;
  const { projectId } = req.body;

  try {
      const updatedActivity = await Activity.findByIdAndUpdate(
          id,
          { 'projectData.projectId': projectId },
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

// retrieve all events from db (//TODO: if not used delete this)
router.get("/events/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const events = await Event.find({ users: userId }); // retrieve all events from the database
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving events', error });
    }
});

// '/api/calendar/activities?start=(..)&end=(..)&userId=(..)'
router.get("/activities", async (req,res) => {
    // start: start date string in UTC TIME!
    // end: end date string in UTC TIME!
    // dates are stored in UTC time on mongodb, and sent back to client in local time
    const { start, end, userId } = req.query;
    const sDate = new Date(start);
    const eDate = new Date(end);
    try {
        // get events that start in the range, or finish in range, or start before and finish after range
        // the render function for the calendar is going to truncate the dates accordingly
        const activities = await Activity.find({
            deadline: {$gte: sDate, $lte: eDate},
            users: userId
        });
        
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
})

// Get all activities by array of IDs
router.post('/getActivitiesByIds', async (req, res) => {
  const { activityIds } = req.body;

  try {
      const activities = await Activity.find({ _id: { $in: activityIds } });
      res.status(200).json(activities);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
});

// delete activity given id
//TODO: delete these activities from project activities as well (check if project activities are needed, else delete)
router.delete("/activities/:id", async (req, res) => {
  const activityId = req.params.id;
  try {
      // Delete the specified activity
      const result = await Activity.findByIdAndDelete(activityId);

      if (result) {
          await agendaHandler.dropSheduledActivityNotifications(activityId);
        
          // Update activities that have the deleted activity's ID as the 'previous' field in projectData
          const relatedActivities = await Activity.updateMany(
              { 'projectData.previous': activityId },
              { $set: { 'projectData.previous': null } }
          );

          // Remove the activity from the project's 'activities' field
          const projectId = result.projectData.projectId;
          const projectUpdateResult = await Project.findByIdAndUpdate(
              projectId,
              { $pull: { activities: activityId } },
              { new: true }
          );

          res.status(200).json({
              message: 'Activity deleted successfully',
              activity: result,
              relatedActivitiesUpdated: relatedActivities.nModified,
              projectUpdateResult: projectUpdateResult
          });
      } else {
          res.status(404).json({ message: 'Activity not found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error deleting activity', error: error.message });
  }
});

// edit activity given id
router.put("/activities/:id", async (req,res) => {
    const activityId = req.params.id;
    const updatedData = req.body;

    try {
        const updatedActivity = await Activity.findByIdAndUpdate(activityId, updatedData, {
          new: true, // return updated activity
          runValidators: true, // ensure the data meets schema rules
        });
    
        if (updatedActivity) {
            await agendaHandler.dropSheduledActivityNotifications(activityId);
            await agendaHandler.scheduleActivityNotifications(updatedActivity);
          res.status(200).json({ message: 'Activity updated successfully', activity: updatedActivity });
        } else {
          res.status(404).json({ message: 'Activity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating activity', error: error.message });
    }
})

// '/api/calendar/events?start=(..)&end=(..)?userId=(..)'
router.get("/events", async (req, res) => {
  // start: start date string in UTC TIME!
  // end: end date string in UTC TIME!
  // dates are stored in UTC time on mongodb, and sent back to client in local time
  const { start, end, userId } = req.query;
  const sDate = new Date(start);
  const eDate = new Date(end);
  try {
      // get events that start in the range, or finish in range, or start before and finish after range
      // and include the current user in the users field
      const events = await Event.find({
          $and: [
              {
                  $or: [
                      { endDate: { $gte: sDate, $lte: eDate } },  // end in range
                      { startDate: { $gte: sDate, $lte: eDate } }, // start in range
                      { startDate: { $lte: sDate }, endDate: { $gte: eDate } } // (spanning the entire range)
                  ]
              },
              { users: userId } // check if userId is in the users field
          ]
      });
      
      res.json(events);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching events' });
  }
});

// '/api/calendar/activities?start=(..)&end=(..)&userId=(..)'
router.get("/activities", async (req, res) => {
  // start: start date string in UTC TIME!
  // end: end date string in UTC TIME!
  // dates are stored in UTC time on mongodb, and sent back to client in local time
  const { start, end, userId } = req.query;
  const sDate = new Date(start);
  const eDate = new Date(end);
  try {
      // get activities that have deadline in the range, include the current user in the users field, and have projectData set to true
      const activities = await Activity.find({
          $and: [
              { deadline: { $gte: sDate, $lte: eDate } },  // deadline in range
              { users: userId }, // check if userId is in the users field
              { projectData: { $exists: true, $ne: null } } // check if projectData is true (exists and not null)
          ]
      });
      
      res.json(activities);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching activities' });
  }
});

router.get("/resourcesEvents", async (req,res) => {
    try {
        const events = await Event.aggregate([
            {
              $addFields: {
                resources: {
                  $map: {
                    input: "$resources",
                    as: "resource",
                    in: { $toObjectId: "$$resource" }, // Convert each user string to ObjectId
                  },
                },
              },
            },
            {
              $lookup: {
                from: "resources", // The resources collection
                localField: "resources", // Converted users field
                foreignField: "_id", // Match with the ObjectId in resources
                as: "matchedResources",
              },
            },
            {
              $match: {
                "matchedResources.0": { $exists: true }, // Ensure at least one match exists
              },
            },
            {
              $project: {
                title: 1,
                location: 1,
                startDate: 1,
                endDate: 1,
                frequency: 1,
                repetitionNumber: 1,
                repetitionDate: 1,
                color: 1,
                users: 1,
                matchedResources: 1, // return matched resources
              },
            },
        ]);
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
            await agendaHandler.dropSheduledEventNotifications(eventId);
            res.status(200).json({ message: 'Event deleted successfully', event: result });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
})

router.put("/events/:id", async (req,res) => {
    const eventId = req.params.id;
    const updatedData = req.body;
    
    try {
        const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedData, {
          new: true, // return updated event
          runValidators: true, // ensure the data meets schema rules
        });
    
        if (updatedEvent) {
            await agendaHandler.dropSheduledEventNotifications(eventId);
            await agendaHandler.scheduleEventNotifications(updatedEvent);
            res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
})

router.get("/resources", async (req, res) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
})

router.get('/eventsByResource/:resourceId', async (req, res) => {
  const { resourceId } = req.params;

  try {
      const events = await Event.find({ resources: resourceId });
      res.status(200).json(events);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

router.get("/resourcesFromIds", async (req, res) => {
  const {resources} = req.query;
  const objectIds = resources.split(",").map(r => new mongoose.Types.ObjectId(r))
  try {
    const matchingResources = await Resource.find({ 
      _id: { $in: objectIds } 
    });
    res.json(matchingResources);
  }catch (err) {
    console.error("Error fetching resources from ids:", err);
    throw err;
  }
})

router.post("/addResource", async (req, res) => {
    try {
        const resource = new Resource(req.body);
        await resource.save();
        res.status(201).json({ message: 'Data saved successfully' });
    }catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch("/removeResourceFromEvent", async (req, res) => {
  const {resource, event} = req.body;
  try {
    const result = await Event.updateOne(
      { _id: event }, // Find the document with the specified ID
      { $pull: { resources: resource } } // Use $pull to remove the resource
    );
    // Check if the document was modified
    if (result.modifiedCount > 0) {
      return res.status(200).json({ message: 'Resource removed successfully.' });
    } else {
      return res.status(404).json({ message: 'Event not found or resource not present.' });
    }
  }catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ message: 'Server error' });
  }
})

router.delete("/resources/:id", async (req, res) => {
  const resourceId = req.params.id;
  try {
    // 1. Delete the resource from the resources collection
    const deleteResult = await Resource.deleteOne({ _id: new mongoose.Types.ObjectId(resourceId) });
    if (deleteResult.deletedCount === 0) {
      return res.status(404).send({ error: "Resource not found" });
    }

    // 2. Remove the resourceId from the resources array in the events collection
    const updateResult = await Event.updateMany(
      { resources: resourceId }, // Find events where the resource exists in the resources array
      { $pull: { resources: resourceId } } // Remove the resourceId from the resources array
    );

    return res.status(200).send({
      message: "Resource deleted successfully",
      resourceDeleted: deleteResult.deletedCount,
      eventsUpdated: updateResult.modifiedCount,
    });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
})

// Delete activities by groupName and groupId
router.delete("/deleteByGroup", async (req, res) => {
  const { groupName, groupId } = req.body;

  try {
      const result = await Activity.deleteMany(
          { 'compositeActivity.groupName': groupName, 'compositeActivity.groupId': groupId }
      );

      res.status(200).json({
          message: 'Activities deleted successfully',
          deletedCount: result.deletedCount
      });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting activities', error: error.message });
  }
});

const upload = multer({ storage: multer.memoryStorage() });
router.post('/export', upload.single('file'), async (req, res) => {
    try {
        const { receiver, eventTitle, yahooLink, googleLink, outlookLink } = req.body;
        const file = req.file;  // formdata's file (uploaded in memory with multer to access its contents)
        
        if (!file) {
            res.status(400).send({ error: 'No file uploaded' });
            return;
        }
        else{
            const subject = `Export of ${eventTitle}`;
            const text = `Exported .ics file attached.\n\nAdd event to your calendar by clicking the following links:\nYahoo: ${yahooLink}\nGoogle: ${googleLink}\nOutlook: ${outlookLink}`;
            const attachments = [{ filename: file.originalname, content: file.buffer }];
    
            try {
                await mailer.sendMailWithAttachments(receiver, subject, text, attachments);
                res.status(200).send('Email sent!');
            } catch (error) {
                res.status(500).send({ error: 'Error sending the email.' });
            }
        }
    } 
    catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

export default router;
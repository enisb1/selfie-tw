import Router from 'express';
import Event from '../models/Event.js'
import Activity from '../models/Activity.js'
import Resource from '../models/Resource.js';
import mongoose, { mongo } from 'mongoose';

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
        const savedActivity = await activity.save();
        res.status(201).json(savedActivity);
    }catch (error) {
        console.log(error)
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

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
          res.status(200).json({ message: 'Activity updated successfully', activity: updatedActivity });
        } else {
          res.status(404).json({ message: 'Activity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating activity', error: error.message });
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

export default router;
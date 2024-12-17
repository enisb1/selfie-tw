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
        await activity.save();
        res.status(201).json({ message: 'Data saved successfully' });
    }catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Server error' });
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
                users: {
                  $map: {
                    input: "$users",
                    as: "user",
                    in: { $toObjectId: "$$user" }, // Convert each user string to ObjectId
                  },
                },
              },
            },
            {
              $lookup: {
                from: "resources", // The resources collection
                localField: "users", // Converted users field
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

router.get("/availableResources", async (req,res) => {
    const {users, start, end} = req.query;
    const userIds = users.split(',');
    const startDate = new Date(start);
    const endDate = new Date(end);
    console.log(startDate);
    console.log(endDate);
    try {
      const availableResources = await Resource.aggregate([
        // 1. Convert _id in resources to string
        {
          $addFields: {
            _idString: { $toString: "$_id" },
          },
        },
        // 2. Match resources where _idString is in the userIds
        {
          $match: {
            _idString: { $in: userIds },
          },
        },
        // 3. Lookup events and match users in the event
        {
          $lookup: {
            from: "events",
            localField: "_idString", // Use the string version of _id
            foreignField: "users",   // users in events are strings
            as: "userEvents",
          },
        },
        // 4. Add fields to check if the resource has events within the date range
        {
          $addFields: {
            hasEventsInRange: {
              $anyElementTrue: {
                $map: {
                  input: "$userEvents",
                  as: "event",
                  in: {
                    $or: [
                      {
                        $and: [
                          { $lte: ["$$event.startDate", endDate] },
                          { $gte: ["$$event.endDate", startDate] },
                        ],
                      },
                      {
                        $and: [
                          { $lte: [startDate, "$$event.endDate"] },
                          { $gte: [endDate, "$$event.startDate"] },
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        // 5. Filter out resources with events within the specified date range
        {
          $match: {
            hasEventsInRange: false,
          },
        },
        // 6. Project the necessary fields
        {
          $project: {
            _id: 1,
            username: 1, // Include other fields you need
          },
        },
      ]);
      res.json(availableResources);
    } catch (err) {
      console.error("Error fetching users without events:", err);
      throw err;
    }
})

router.get("/resourcesInUsers", async (req,res) => {
    const users = req.params.users
    const userIds = users.split(',');
    try {
        const matchingResources = await Resource.find(
            { _id: { $in: userIds } }, // match user IDs in the resources collection
            { username: 1, _id: 0 } // project only the username field
        );
    
        // extract usernames
        const usernames = matchingResources.map(resource => resource.username);
        res.json(usernames);
    }
    catch (err) {
        console.error("Error fetching users without events:", err);
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

export default router;
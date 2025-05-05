import Router from "express";
import Note from '../models/Note.js';



const router = Router()

router.post('/addNote', async (req, res) => {
    try {
        const note = new Note(req.body);
        await note.save();
        res.status(201).json({ message: 'Note saved successfully' });
    }catch (error) {
        console.error('Error saving Note:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get tasks with expiration in a certain range and filter by username
router.get('/tasks', async (req, res) => {
    const { start, end, username } = req.query;
    
    try {
        const notes = await Note.find({
            $and: [
                { 'bodyTask.expiration': { $gte: start, $lte: end } },
                { $or: [{ user: username }, { userListAccess: username }, { access: 'publicAccess' }] }
            ]
        });

        const tasks = notes.flatMap(note => 
            note.bodyTask.filter(task => 
                task.expiration >= start && task.expiration <= end
            )
        );

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});

router.delete('/deleteNote/:id', async (req, res) => {
    const noteId = req.params.id;
    try {
        const result = await Note.findByIdAndDelete(noteId);
        if(result){
            res.status(200).json({ message: 'Note deleted successfully' });
        } else{
            res.status(404).json({ message: 'Note not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note', error: error.message});
    }
});


router.get('/getNoteId/:id', async(req,res) => {
    const noteId = req.params.id
    try {
        const noteFound = await Note.findById(noteId)
        if(!noteFound){
            res.status(404).json({message: 'Note not found'})
        }
        res.status(200).json(noteFound)
    } catch (error) {
        console.error("Error retrieving note: ", error)
        res.status(500).json({message: "Server error: ", error})
    }
})

router.put('/editNote/:id', async(req,res) => {
    const noteId = req.params.id
    const updatedBody = req.body
    
    try {
        const updatedNote = await Note.findByIdAndUpdate(noteId, updatedBody,
        { new: true, 
          runValidators: true,
        });
        if(updatedNote){
            res.status(200).json({ message: 'Note updated successfully', note: updatedNote });
        } else {
            res.status(404).json({ message: 'Note not found' });
        }  
    } catch (error) {
        res.status(500).json({ message: 'Error updating note', error: error.message })
    }
})

router.get('/getUserNote', async(req, res) => {
    const username = req.query.user
    const access = req.query.access

    try {
        let query = {}
        if(username){
            query.user = username;
        }
        if(access){
            query.access = access;
        }
        const notes = await Note.find(query) 

        res.status(200).json(notes);
        
    } catch (error) {
        console.error("Error retrieving notes: ", error)
        res.status(500).json({message: 'Server error'})
    }
})

router.get('/getUserSelectNote', async(req, res) => {
    const username = req.query.user
    try{
        const notes = await Note.find({userListAccess: username})
        res.json(notes)
    }catch(error){
        console.error("Error retrieving notes: ", error)
        res.status(500).json({message: 'Server error'})
    }
})


export default router;
import Router from "express";
import Note from '../models/Note.js';



const router = Router()

router.post('/addNote', async (req, res) => {
    try {
        const note = new Note(req.body);
        await note.save();
        res.status(201).json({ message: 'Note saved successfully' });
        console.log(req.body);
    }catch (error) {
        console.error('Error saving Note:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/getNote', async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving notes', error });
    }
});

router.delete('/:id', async (req, res) => {
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


router.get('/:id', async(req,res) => {
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

router.put('/:id', async(req,res) => {
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


export default router;
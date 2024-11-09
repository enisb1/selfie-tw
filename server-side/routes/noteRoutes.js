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

router.get("/getNote", async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving notes', error });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const noteId = req.params.id;
        const note = await Note.findByIdAndDelete(noteId);
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ', error});
    }
    
});


router.get('/singleNote/:id', async(req,res) => {
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

router.put('/edit/:id', async(req,res) => {
    const noteId = req.params.id
    const {title, bodyNote, bodyTask, category, format, access} = req.body
    
    try {
        const updateNote = await Note.findByIdAndUpdate(noteId, 
            { title, bodyNote, bodyTask, category, format, access},
        { new: true})
        res.status(200).json(updateNote)
    } catch (error) {
        console.error("Error updating note", error)
        res.status(500).json({message: "Server error", error})
    }
})




export default router;
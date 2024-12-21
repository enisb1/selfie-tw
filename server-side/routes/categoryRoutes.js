/*import Router from "express";
import Category from '../models/Category.js'

const router = Router()

router.post('/addCategory', async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json({ message: 'Category saved successfully' });
        console.log(req.body);
    }catch (error) {
        console.error('Error saving Category:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

router.get('/getCategory', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving categories', error });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findByIdAndDelete(categoryId);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ', error});
    }
    
});



export default router;*/
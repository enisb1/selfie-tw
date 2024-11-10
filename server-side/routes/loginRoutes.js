import Router from 'express';
import User from '../models/User.js'
import bcrypt from 'bcrypt';
import passport from 'passport';


const router = Router();



router.post("/addUser", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(req.body.password, salt);


        const user = new User({
            username: req.body.username,
            passwordHash: passwordHash,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            isAResource: false,
            isAdmin: false,
            telegram: req.body.telegram
        });
        await user.save();
        res.status(201).json({ message: 'Data saved successfully' });
    }catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
/*
router.post("/passwordCheck", passport.authenticate('local'),
    async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username: req.body.username })
            res.status(200).json(user);
        } catch (error) {
            console.error('Error checking password:', error);
            res.status(500).json({ message: 'Server error' });
        }


});
*/
router.post("/passwordCheck",
    async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username: username })
            if (!user) {
                res.status(401).json({ message: 'Username not found' });

            }else {
                const isMatch = await bcrypt.compare(password, user.passwordHash);
                if (!isMatch) {
                    res.status(401).json({ message: 'Incorrect password' });
                }else {
                    res.status(200).json({
                        message: 'Password correct',
                        user: user
                    });
                }

            }
        } catch (error) {
            console.error('Error checking password:', error);
            res.status(500).json({ message: 'Server error' });
        }


    });

router.post("/checkUsername", async (req, res) => {
    try {
        const {username} = req.body;
        const user = await User
            .findOne({username: req.body.username});
        if (!user) {
            res.status(200).json({message: 'Username available'});
        } else {
            res.status(200).json({message: 'Username not available'});
        }
    }
    catch (error) {
        console.error('Error checking username:', error);
        res.status(500).json({message: 'Server error'});
    }
});

router.post("/logout", (req, res) => {
    req.logout();
    res.status(200).json({message: 'Logout successful'});
});




export default router;

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
            telegram: req.body.telegram,
            unavailableStart: req.body.unavailableStart,
            unavailableEnd: req.body.unavailableEnd,
            unavailableFrequency: req.body.unavailableFrequency,
            unavailableRepNumber: req.body.unavailableRepNumber,
            unavailableRepDate: req.body.unavailableRepDate
        });
        await user.save();
        res.status(201).json({ message: 'Data saved successfully' ,
            user: user});
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

//get all users
router.get("/allUsers", async (req, res) => {
    try {
        const users = await User.find( {isAResource: false});
        res.status(200).json({message: 'Users found', users: users});
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put("/updateUnavailability/:id", async (req, res) => {
    const userId = req.params.id;
    const { unavailableStart, unavailableEnd, unavailableFrequency, unavailableRepNumber, unavailableRepDate } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, {
            unavailableStart,
            unavailableEnd,
            unavailableFrequency,
            unavailableRepNumber,
            unavailableRepDate
        }, { new: true });

        if (updatedUser) {
            res.status(200).json({ message: 'Unavailability updated successfully', user: updatedUser });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating unavailability', error: error.message });
    }
});

router.get("/getUser/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
});

router.post("/getUsers", async (req, res) => {
    const { userIds } = req.body;

    try {
        const users = await User.find({ _id: { $in: userIds } });
        if (users.length > 0) {
            res.status(200).json(users);
        } else {
            res.status(404).json({ message: 'Users not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
});

router.post('/getUserIdsByEmails', async (req, res) => {
    const { emails } = req.body;

    try {
        const users = await User.find({ email: { $in: emails } }, '_id');
        const userIds = users.map(user => user._id);
        res.status(200).json(userIds);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user IDs', error: error.message });
    }
});

// Check if a user exists by username
router.get('/userExists/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username: username });
        if (user) {
            res.status(200).json({ exists: true, id: user._id });
        } else {
            res.status(200).json({ exists: false, id: null });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error checking user existence', error: error.message });
    }
});

export default router;

const {Router} = require('express');
const router = Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {

    try {
        res.render('profile', {
            title: 'Profile',
            isProfile: true,
            user: req.user.toObject()
        });
    } catch (err) {
        console.log(err);
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const toChange = {
            name: req.body.name
        };
        if(req.file) {
            toChange.avatarUrl = req.file.path;
        }

        Object.assign(user, toChange);
        await user.save();

        res.redirect('/profile');
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
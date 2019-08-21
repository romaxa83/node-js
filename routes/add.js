const {Router} = require('express');
const {validationResult} = require('express-validator');
const Course = require('../models/course');
const router = Router();
const {courseValidators} = require('../utils/validators');
const auth = require('../middleware/auth');

router.get('/', auth,(req, res) => {
	res.render('add', {
		title: 'Add new course',
		isAdd: true
	});
});

router.post('/', auth, courseValidators,async (req, res) => {
    const data = req.body;
    // валидация на ошибки с помощью пакета express-validator
    const errors = validationResult(req);
    if(!errors.isEmpty()) {

        return res.status(422).render('add', {
            title: 'Add new course',
            isAdd: true,
			error: errors.array()[0].msg,
			data: {
                title: data.title,
                price: data.price,
                img: data.img,
			}
        });
    }

	const course = new Course({
		title: data.title,
		price: data.price,
		img: data.img,
		userId: req.user._id
	});

	try {
        await course.save();
        res.redirect('/courses');
	} catch(err) {
		console.log(err);
	}
});

module.exports = router;
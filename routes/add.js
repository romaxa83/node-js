const {Router} = require('express');
const Course = require('../models/course');
const router = Router();

router.get('/', (req, res) => {
	res.render('add', {
		title: 'Add new course',
		isAdd: true
	});
});

router.post('/', async (req, res) => {
	const data = req.body;
	const course = new Course({
		title: data.title,
		price: data.price,
		img: data.img
	});

	try {
        await course.save();
        res.redirect('/courses');
	} catch(err) {
		console.log(err);
	}
});

module.exports = router;
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
	const course = new Course(data.title, data.price, data.img);
	await course.save();

	res.redirect('/courses');
});

module.exports = router;
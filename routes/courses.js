const {Router} = require('express');
const Course = require('../models/course');
const router = Router();
const auth = require('../middleware/auth');

router.get('/', async (req, res, next) => {
	const courses = await Course.find().populate('UserId', 'name email');

	res.render('courses', {
		title: 'Courses',
		isCourses: true,
		courses
	});
});
router.post('/edit', auth, async (req, res) => {
	const {id} = req.body;
	delete req.body.id;
    await Course.findByIdAndUpdate(id, req.body);

    res.redirect('/courses');
});

router.get('/:id/edit', auth, async (req, res) => {
	if(!req.query.allow) {
		return res.redirect('/');
	}

	const course = await Course.findById(req.params.id);

	res.render('course-edit', {
		title: `Edit ${course.title}`,
		course
	});
});

router.get('/:id', async (req,res) => {
	const course = await Course.findById(req.params.id);
	res.render('course', {
		layout: 'empty',
		title: `Course ${course.title}`,
		course
	});
});

router.post('/remove',auth, async (req,res) => {
	try {
        await Course.deleteOne({
			_id: req.body.id
		});
        res.redirect('/courses');
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
const {Router} = require('express');
const {validationResult} = require('express-validator');
const Course = require('../models/course');
const {courseValidators} = require('../utils/validators');
const router = Router();
const auth = require('../middleware/auth');

// функция проверяет владельца курса (т.к. только он может его редактировать)
function isOwner(course, req) {
	return course.userId.toString() === req.user._id.toString();
}

router.get('/', async (req, res, next) => {

	try {
        const courses = await Course.find()
			.populate('UserId', 'name email').select();

        res.render('courses', {
            title: 'Courses',
            isCourses: true,
			userId: req.user ? req.user._id.toString() : null,
            courses
        });
	} catch (err) {
		console.log(err);
	}
});

router.post('/edit', auth, courseValidators,async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {

        return res.status(422).redirect(`/courses/${req.body.id}/edit?allow=true`);
    }

	try {
        const {id} = req.body;
        delete req.body.id;
        const course = await Course.findById(id);

        if(!isOwner(course, req)) {
            return res.redirect('/courses');
        }
        Object.assign(course, req.body);
        await course.save();

        res.redirect('/courses');
	} catch(err) {
		console.log(err);
	}

});

router.get('/:id/edit', auth, async (req, res) => {
	if(!req.query.allow) {
		return res.redirect('/');
	}

	try {
        const course = await Course.findById(req.params.id);
		if(!isOwner(course, req)) {
			return res.redirect('/courses');
		}

        res.render('course-edit', {
            title: `Edit ${course.title}`,
            course
        });
	} catch (err) {
		console.log(err);
	}
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
			_id: req.body.id,
			userId: req.user._id
		});
        res.redirect('/courses');
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
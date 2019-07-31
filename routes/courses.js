const {Router} = require('express');
const router = Router();

router.get('/', (req, res, next) => {
	res.render('course', {
		title: 'Courses',
		isCourses: true
	});
});

module.exports = router;
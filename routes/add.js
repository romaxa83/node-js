const {Router} = require('express');
const router = Router();

router.get('/', (req, res, next) => {
	res.render('add', {
		title: 'Add new course',
		isAdd: true
	});
});

module.exports = router;
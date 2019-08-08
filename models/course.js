const {Schema, model} = require('mongoose');

// схема для таблици
const courseSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	img: String,
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

// преобразуем данные(так с бд прилетает "_id" ,а на клиенте используеться "id")
courseSchema.method('toClient', function() {
	// порлучаем одьект курса
	const course = this.toObject();

	course.id = course._id;
	delete course._id;

	return course;
});

module.exports = model('Course', courseSchema);
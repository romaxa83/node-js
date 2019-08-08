const {Schema, model} = require('mongoose');

// схема для таблици
const course = new Schema({
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	img: String
});

module.exports = model('Course', course);
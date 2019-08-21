const {body} = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
    body('email')
        .isEmail().withMessage('Enter a valid email.')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value});
                if(user) {
                    return Promise.reject('User with this email already exists');
                }
            } catch (err) {
                consolle.log(err);
            }
        })
        .normalizeEmail(),
    body('password').isLength({min: 5, max: 56})
        .isAlphanumeric()
        .withMessage('Password must be at least 6 characters.')
        .trim(),
    //собственый валидатор для сравнения паролей
    body('confirm').custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Passwords do not match.')
        }
        return true;
    })
        .trim(),
    body('name', 'Name must be at least 3 characters.')
        .isLength({min: 3}).trim()
];

exports.courseValidators = [
    body('title').isLength({min: 3}).withMessage('Минимальная длинна названия 3 символа'),
    body('price').isNumeric().withMessage('Введите корректную цену'),
    body('img', 'Введите корректный Url картинки').isURL()
];
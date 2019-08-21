const {Router} = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {validationResult} = require('express-validator');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const config = require('../config');
const User = require('../models/user');
const regEmail = require('../emails/registration');
const resetEmail = require('../emails/reset');
const {registerValidators} = require('../utils/validators');
const router = Router();

//создаем транспортере для писем
const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: config.SENDGRID_API_KEY}
}));

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        isLogin:true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    });
});

router.get('/logout', async (req, res) => {
    // когда данные из сессии очистяться,вызовиться колбэк
    req.session.destroy(() => {
        res.redirect('/auth/login#login');
    });
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const candidate = await User.findOne({email});
        if(candidate) {
            // проверяем пароль пользователя (сравнивает compare сравнивает хеш в бд и пароль с клиента)
            const confirmPassword = await bcrypt.compare(password, candidate.password);
            if(confirmPassword) {
                // успешный логин
                const user = candidate;
                req.session.user = user;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if(err) {
                        throw err;
                    }
                    res.redirect('/');
                });
            } else {
                req.flash('loginError', 'Password is a wrong');
                res.redirect('/auth/login#login');
            }
        } else {
            req.flash('loginError', 'User does not exist');
            res.redirect('/auth/login#register');
        }
    } catch (err) {
        console.log(err);
    }
});

//функция body (береться из пакета express-validator),для валидации данных
router.post('/register', registerValidators, async (req, res) => {
    try {
        const {email, password, name} = req.body;

        // валидация на ошибки с помощью пакета express-validator
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg);
            return res.status(422).redirect('/auth/login#register');
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email, name, password: hashPassword, cart: {items: []}});
        await user.save();
        res.redirect('/auth/login#login');
        // добавляем после редиректа,чтоб отправка произошла в фоне
        await transporter.sendMail(regEmail(email));

    } catch (err) {
        console.log(err);
    }
});

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Reset password',
        error: req.flash('error')
    });
});

router.post('/reset', (req, res) => {
    try {
        //генерируем ключ
        crypto.randomBytes(32, async (err, buffer) => {
            if(err) {
                req.flash('error', 'Failed to generate key');
                return res.redirect('/auth/reset');
            }

            const token = buffer.toString('hex');
            const candidate = await User.findOne({email: req.body.email});

            if(candidate) {
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                await candidate.save();
                await transporter.sendMail(resetEmail(candidate.email, token));

                res.redirect('/auth/login');
            } else {
                req.flash('error', 'User not found.');
                res.redirect('/auth/reset');
            }
        });

    } catch (err) {
        console.log(err);
    }
});

router.get('/password/:token', async (req, res) => {

    if(!req.params.token) {
        return res.redirect('/auth/login');
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        });
console.log(req.params.token);
        if(!user) {
            return res.redirect('/auth/login');
        } else {
            res.render('auth/password', {
                title: 'New password',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            });
        }
    } catch (err) {
        console.log(err);
    }
});

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        });

        if(user) {
            user.password = await bcrypt.hash(req.body.password, 10);
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            await  user.save();

            res.redirect('/auth/login');
        } else {
            req.flash('loginError', 'Token expired.');
            res.redirect('/auth/login');
        }
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;
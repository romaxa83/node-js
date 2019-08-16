const {Router} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = Router();

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

router.post('/register', async (req, res) => {
    try {
        const {email, password, repeat, name} = req.body;
        const candidate = await User.findOne({email});
        if(candidate) {
            // такой пользователь уже зарегистрирован
            req.flash('registerError', 'User with this email already exists');
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({
                email, name, password: hashPassword, cart: {items: []}
            });
            await user.save();
            res.redirect('/auth/login#login');
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
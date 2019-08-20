const config = require('../config');

module.exports = function(email, token) {
    return {
        to: email,
        from: config.EMAIL_FROM,
        subject: 'Reset password',
        html: `
        <h1>Здравствуй добрый человек</h1>
        <p>Перейдите по ссылки,для создания нового пароля</p>
        <hr/>
        <a href="${config.BASE_URL}/auth/password/${token}">New password</a>
      `
    }
};
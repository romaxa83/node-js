const config = require('../config');

module.exports = function(email) {
  return {
      to: email,
      from: config.EMAIL_FROM,
      subject: 'Account create',
      html: `
        <h1>Здравствуй добрый человек</h1>
        <p>аккаунт создан с email - ${email}</p>
        <hr/>
        <a href="${config.BASE_URL}">Тестовый сайт на nodejs</a>
      `
  }
};
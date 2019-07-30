const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
const PORT = process.env.PORT || 3000;

// конфигурируем handlebars
const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs'
});

app.engine('hbs', hbs.engine);	// регистрируем handlebars
app.set('view engine', 'hbs'); // используем handlebars в express
app.set('views', 'views');	// указываем где храняться шаблоны

app.get('/', (req, res, next) => {
	// res.sendFile(path.join(__dirname, 'views', 'index.html'));
	res.render('index');
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
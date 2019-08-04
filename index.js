const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
const PORT = process.env.PORT || 3000;
//Routes
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cartRoutes = require('./routes/cart');

// конфигурируем handlebars
const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs'
});

app.engine('hbs', hbs.engine);	// регистрируем handlebars
app.set('view engine', 'hbs'); // используем handlebars в express
app.set('views', 'views');	// указываем где храняться шаблоны

app.use(express.static('public'));	//регистрируем статические файлы
app.use(express.urlencoded({extended: true}));
app.use('/', homeRoutes);			//регистрируем пути(первый параметр -
app.use('/add', addRoutes);	//префикс для все путе в файле)
app.use('/courses', coursesRoutes);
app.use('/cart', cartRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
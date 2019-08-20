const express = require('express');
const path = require('path');
const csrf = require('csurf');
const flash = require('connect-flash');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const app = express();
const PORT = process.env.PORT || 3000;
//Routes
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
// Mongo
const mongoose = require('mongoose');

const config = require('./config');

// Middleware
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

// конфигурируем handlebars
const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs',
	helpers: require('./utils/hbs-helpers')	// подключение собственных хелперов
});

// настройка автоматического сохранение сессий в mongo
const store = new MongoStore({
	collection: 'sessions',	// название таблицы для сохранение сессии
	uri: config.MONGODB_URI			// url для подключение к mongo
});

app.engine('hbs', hbs.engine);	// регистрируем handlebars
app.set('view engine', 'hbs'); // используем handlebars в express
app.set('views', 'views');	// указываем где храняться шаблоны

app.use(express.static(path.join(__dirname, 'public')));	//регистрируем статические файлы
app.use(express.urlencoded({extended: true}));
//настраиваем сессию
app.use(session({
	secret: config.SESSION_SECRET,	//строка на основе которой сессия будет шифроваться
	resave: false,
	saveUninitialized: false,
	store: store					// store для автоматичесого хранения сессии
}));
// для генерации csrf-ключей
app.use(csrf());
// flash сообщения
app.use(flash());
// передаем свой middleware
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);			//регистрируем пути(первый параметр -
app.use('/add', addRoutes);	//префикс для все путе в файле)
app.use('/courses', coursesRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

async function start()
{
	try {
		// подключаемся к базе данных
        await mongoose.connect(config.MONGODB_URI, {
        	useNewUrlParser: true,
			useFindAndModify: false
        });

        // запускаем приложение
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`MongoDB connection`);
        });

	} catch (err) {
		console.log(err);
	}

}
start();
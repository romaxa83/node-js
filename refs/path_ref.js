// модуль для работы с путями в nodejs
const path = require('path');

// метод выводит название файла из абсолютного пути
console.log(`Имя файла - ${path.basename(__filename)}`);

// метод выводит название папки в которой находиться файл
console.log(`Директория - ${path.dirname(__filename)}`);

console.log(`Расширение - ${path.extname(__filename)}`);

// парсит путь ,возвращает обьект,поэтому можно сразу вызывать его св-ва
console.log(path.parse(__filename));
console.log(`Расширение - ${path.parse(__filename).ext}`);

// склеивает пути создавая один путь
// первый параметр - папка где ведеться разработка
// второй - папка в которую нужно перейти ('../' - переход на уровень выше)
// третий - название файла
console.log(`Расширение - ${path.join(__dirname, 'test', 'test.html').ext}`);

// очень похож на метод join
console.log(`Расширение - ${path.resolve(__dirname, 'test', 'test.html').ext}`);
// модульдля работы с файловой системой
const fs = require('fs');
const path = require('path');

//создает папку
// первый параметр - путь к ней
// второй - callback(первым аргументом будет ошибка)
fs.mkdir(path.join(__dirname, 'notes'), err => {
	if (err) throw new Error(err);

	console.log(`папка создана`);
});

// создает файл
// первый параметр - путь к ней
// второй - данные которые хотим записать
// третия callback (первым аргументом будет ошибка)
fs.writeFile(
	path.join(__dirname, 'notes', 'mynotes.txt'),
	'Some data', 
	err => {
	if (err) throw new Error(err);

	console.log(`файл создан`);
});

// добавляет данные файл
fs.appendFile(
	path.join(__dirname, 'notes', 'mynotes.txt'),
	'Some data', 
	err => {
	if (err) throw new Error(err);

	console.log(`данные записаны в файл`);
});

// считываем файл
// первый параметр - путь к файлу
// вторым callback (первым аргументом будет ошибка, вторым данные из файла)
// считаные данные будут в буфере
// чтоб перевести данные в строку - Buffer.from(data).toString()
// или передать в метод readFile вторым параметром кодировку (utf-8)
fs.readFile(
	path.join(__dirname, 'notes', 'mynotes.txt'),
	(err, data) => {
		if(err) throw err

		console.log(data);	
	}	
);

// переименование файла
// первый - путь к файлу
// вторым - путь к файлу с новым именем
// третиq - callback 
fs.rename(
	path.join(__dirname,'notes', 'mynotes.txt'),
	path.join(__dirname,'notes', 'notes.txt'),
	err => {
		if(err) throw err;

		console.log(`файл переименован`);
	}
)
//функция парсит аргумента переданые после команда
//node console.js mess=error
//process.argv - выведет все параметры переданые консоли (кроме первых двух)
function consoleToJSON() {
	const c = {};

	for (let i = 2 ; i < process.argv.lenght; i++) {
		const arg = process.argv[i].split('=');
		c[arg[0]] = arg[1] ? arg[1] : true;
	}

	return c;
}

console.log(consoleToJSON());
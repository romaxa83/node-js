const EventEmitter = require('events');

class Logger extends EventEmitter {

	log(message) {
		this.emit('message', `${message} ${Date.now()}`)
	}
}

const logger = new Logger();

// какое событие мы будем слушать (которое мы заемитили в классе)
// важно чтоб прослушка на события была раньше чем оно инициализируеться
// меоды on и emit предоставляет EventEmitter
logger.on('message', data => {
	console.log(data);
});

logger.log('Hello romaxa');
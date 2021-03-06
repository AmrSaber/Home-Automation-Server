const chalk = require('chalk')
const cron = require('node-cron')

const server = require('./server')
require('./sockets')	// needed for the initialization of the sockets

const db = require('./db')

// init board pins to database start state
require('./raspberry/init');

if (process.env.RAS_PI) {
	console.log(chalk.bgBlue('Running in Raspberry Pi mode'))
}

if (!process.env.DEV) {
	// handle temperature change
	const task = cron.schedule('*/10 * * * * *', () => {
		db.setTemperature(25 + (Math.random() * 4 - 2))
	});
	task.start()
}

// handle exceptions
process.on('SIGTERM', () => server.close())
process.on('uncaughtException', (e) => {
	console.log(chalk.bgRed('Uncaught Error'))
	console.log(chalk.red(e.stack))
	server.close()
})

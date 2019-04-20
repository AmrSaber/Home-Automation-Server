const chalk = require('chalk')
const cron = require('node-cron')

const server = require('./server')
require('./sockets')	// needed for the initialization of the sockets

const db = require('./db')

// handle temperature change
const task = cron.schedule('*/5 * * * *', () => {
	console.log(chalk.bgYellow('Temperature Changed'))
	db.setTemperature(25 + (Math.random() * 4 - 2))
});
task.start()

// handle exceptions
process.on('SIGTERM', () => server.close())
process.on('uncaughtException', (e) => {
	console.log(chalk.bgRed('Uncaught Error'))
	console.log(chalk.red(e.stack))
	server.close()
})
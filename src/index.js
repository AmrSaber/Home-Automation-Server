const chalk = require('chalk')
const server = require('./server')
const sockets = require('./sockets')

process.on('SIGTERM', () => server.close())
process.on('uncaughtException', (e) => {
	console.log(chalk.bgRed('Uncaught Error'))
	console.log(chalk.red(e.stack))
	server.close()
})

// setInterval(() => {
// 	const temperature = Math.floor(Math.random() * 100)
// 	sockets.emit('temperature', { temperature })
// }, 2000)
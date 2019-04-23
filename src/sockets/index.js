const chalk = require('chalk')
const SocketServer = require('socket.io')

const server = require('../server')

const io = new SocketServer(server, {
    cookie: false,
    path: '/real-time-socket'
})

io.on('connection', () => {
    console.log(chalk.bgBlue('New socket connection'))
})

io.on('disconnection', () => {
    console.log(chalk.bgGreen('Socket disconnection'))
})

const emit = (tag, data) => {
    console.log(
        (new Date()).toISOString() + ': ' +
        chalk.bgYellow('Emit') + ' ' +
        chalk.yellow(JSON.stringify(data))
    )
    io.emit(tag, data)
}

module.exports = {
    emit
}

const chalk = require('chalk')
const SocketServer = require('socket.io')

const server = require('../server')

const io = new SocketServer(server, {
    cookie: false,
    // path: '/socket'
})

io.on('connection', () => {
    console.log(chalk.bgBlue('New socket connection'))
})

io.on('disconnection', () => {
    console.log(chalk.bgGreen('Socket disconnection'))
})

const emit = (tag, data) => {
    console.log(chalk.bgYellow('Emit'))
    console.log(chalk.yellow(JSON.stringify(data, null, 2)))
    io.emit(tag, data)
}

module.exports = {
    emit
}
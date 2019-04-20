const SocketServer = require('socket.io')
const server = require('../server')

const io = new SocketServer(server, {
    cookie: false,
    // path: '/socket'
})

io.on('connection', () => {
    console.log(chalk.green('New socket connection'))
})

io.on('disconnection', () => {
    console.log(chalk.yellow('Socket disconnection'))
})

const emit = (data) => {
    console.log(chalk.yellow('Emit: ' + JSON.stringify(data, null, 2)))
    io.sockets.emit(data)
}

module.exports = {
    emit
}
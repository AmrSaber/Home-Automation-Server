if (!process.env.RAS) return

const { Gpio } = require('onoff')

const writePin = (pin, state) => {
    const device = new Gpio(pin, 'out')
    device.writeSync(state)
}

const readPin = (pin) => {
    const device = new Gpio(pin, 'in')
    return device.readSync()
}

module.exports = {
    writePin,
    readPin
}
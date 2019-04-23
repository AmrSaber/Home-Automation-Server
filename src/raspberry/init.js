if (process.env.RAS_PI) {
    const db = require('../db');
    const ras = require('./index');
    let Devices = db.getDevices();
    Devices.forEach(device => writePin(device.pin, device.state));
}
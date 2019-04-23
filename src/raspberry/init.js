const db = require('db/index');
const ras = require('index');

let Devices = db.getDevices();

for(let device in Devices){
    ras.writePin(device.pin, device.state);
}
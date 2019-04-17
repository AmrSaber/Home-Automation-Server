const fs = require("fs");
const loader = require('csv-load-sync');
const _ = require('lodash')

let DB = {
    temperature: -1,
    devices: {},
    nextID: 0,
    used_pins: new Set()
};

function readDB() {
    let devices = loader('devices.csv');
    for (let it = 0; it < devices.length; it++) {
        let device = devices[it];
        device.id = parseInt(device.id);
        device.pin = parseInt(device.pin);
        device.state = parseInt(device.state);
        DB.nextID = Math.max(DB.nextID, device.id + 1);
        DB.devices[device.id] = device;
        DB.used_pins.add(device.pin);
    }
}

function saveDB() {
    let data = "id,name,state,pin\n";
    for (let k in DB.devices) {
        const { id, name, state, pin } = DB.devices[k];
        data += `${id},${name},${state},${pin}\n`
    }
    fs.writeFileSync("devices.csv", data, function (err, data) {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
    });
}


function getDevices() {
    let ret = [];
    for (let k in DB.devices) {
        ret.push(_.cloneDeep(DB.devices[k]));
    }
    return ret;
}

function updateDevice(id, state) {
    if (!DB.devices.hasOwnProperty(id)) throw new Error("No device found with given id");
    if (state > 1 || state < 0) throw new Error("value of state must be either 0:OFF, 1:ON");
    DB.devices[id].state = state;
    saveDB();
}

function addDevice(name, pin) {
    if (!_.isString(name)) throw new Error("Name must be string");
    if (!_.isInteger(pin)) throw new Error("Given pin is not a number")
    if (DB.used_pins.has(pin)) throw new Error("this pin is already used for another device");

    DB.devices[DB.nextID] = {
        id: DB.nextID,
        name: name,
        state: 0,
        pin: parseInt(pin)
    };

    DB.nextID += 1;
    DB.used_pins.add(pin);

    saveDB();
}

function deleteDevice(id) {
    if (DB.devices.hasOwnProperty(id)) {
        DB.used_pins.delete(DB.devices[id].pin);
        delete DB.devices[id];
    }
    else throw new Error("no device with given id");
    saveDB();
}

function setTemperature(temp) {
    if (!_.isNumber(temp)) throw new Error('Temperature must be a number')
    DB.temperature = parseFloat(temp);
}

function getTemperature() {
    return DB.temperature
}

readDB();

module.exports = {
    getDevices,
    updateDevice,
    addDevice,
    deleteDevice,
    setTemperature,
    getTemperature
}

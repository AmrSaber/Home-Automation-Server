const fs = require('fs');
const path = require('path');
const loader = require('csv-load-sync');
const _ = require('lodash');

const raspberry = require('../raspberry');

const sockets = require('../sockets');
const { TAG_DEVICE_UPDATE, TAG_DEVICES_UPDATE, TAG_TEMPERATURE } = require('../constants')

const fileName = path.join(__dirname, './devices.csv');
const fileHeader = 'id,name,state,pin\n';

const DB = {
    temperature: -1,
    devices: {},
    nextID: 0,
    used_pins: new Set()
};

function readDB() {
    let devices = loader(fileName);
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
    let data = fileHeader;
    for (let k in DB.devices) {
        const { id, name, state, pin } = DB.devices[k];
        data += `${id},${name},${state},${pin}\n`;
    }
    fs.writeFileSync(fileName, data, function (err, data) {
        if (err) throw err;
    });
}


function getDevices() {
    let ret = [];
    for (let k in DB.devices) {
        ret.push(_.cloneDeep(DB.devices[k]));
    }
    return ret;
}

function getDevice(id){
    return DB.devices[id]
}

function updateDevice(id, state) {
    if (!DB.devices.hasOwnProperty(id)) throw new Error("No device found with given id");
    if (state > 1 || state < 0) throw new Error("value of state must be either 0:OFF, 1:ON");
    DB.devices[id].state = state;
    saveDB();

    const device = DB.devices[id]
    sockets.emit(TAG_DEVICE_UPDATE, device)

    if (process.env.RAS_PI) raspberry.writePin(device.pin, device.state)
}

function addDevice(name, pin) {
    if (!_.isString(name)) throw new Error("Name must be string");
    if (!_.isInteger(pin)) throw new Error("Given pin is not a number")
    if (DB.used_pins.has(pin)) throw new Error("this pin is already used for another device");

    const device = {
        id: DB.nextID,
        name: name,
        state: 0,
        pin: parseInt(pin)
    };

    DB.devices[DB.nextID] = device;

    DB.nextID += 1;
    DB.used_pins.add(pin);

    saveDB();
    sockets.emit(TAG_DEVICES_UPDATE, getDevices())

    if (process.env.RAS_PI) raspberry.writePin(device.pin, device.state)

    return device;
}

function deleteDevice(id) {
    if (DB.devices.hasOwnProperty(id)) {
        if (process.env.RAS_PI) raspberry.writePin(DB.devices[id].pin, 0);
        DB.used_pins.delete(DB.devices[id].pin);
        delete DB.devices[id];
    }
    else throw new Error("no device with given id");

    saveDB();
    sockets.emit(TAG_DEVICES_UPDATE, getDevices())
}

function setTemperature(temp) {
    if (!_.isNumber(temp)) throw new Error('Temperature must be a number');
    DB.temperature = parseFloat(temp);
    sockets.emit(TAG_TEMPERATURE, { temperature: DB.temperature })
}

function getTemperature() {
    return DB.temperature
}

// initialize the .csv file if doesn't exist, read the devices anyway
if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, fileHeader)
}

readDB();

// the exported data
module.exports = {
    getDevices,
    getDevice,
    updateDevice,
    addDevice,
    deleteDevice,
    setTemperature,
    getTemperature,
};
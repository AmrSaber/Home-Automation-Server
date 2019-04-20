const express = require('express')
const db = require('../db')

const router = new express.Router()

//get devices
router.get('/', (req, res) => {
	res.send({ data: db.getDevices() })
})

//get device
router.get('/:id', (req, res) => {
	res.send({ data: db.getDevice(req.params.id) })
})

//add device
router.post('/', (req, res) => {
	const { name, pin } = req.body
	const device = db.addDevice(name, parseInt(pin))
	res.send({ data: device })
})

//update device
router.patch('/:id', (req, res) => {
	let { id } = req.params
	let { state } = req.body
	id = parseInt(id)
	state = parseInt(state)
	db.updateDevice(id, state)
	res.send({ data: db.getDevice(id) })
})

//delete device 
router.delete('/:id', (req, res) => {
	const { id } = req.params
	const device = db.getDevice(id)
	db.deleteDevice(id)
	res.send({ data: device })
})

//get tempratur 


module.exports = router
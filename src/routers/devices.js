const express = require('express')
const Joi = require('joi')
const db = require('../db')


const router = new express.Router()

//get devices
router.get('/', (req, res) => {
	res.send({ data: db.getDevices() })
})

//get device
router.get('/:id', (req, res) => {
	const schema = {
		id: Joi.number().required()
	}
	const result = Joi.validate(req.params, schema)
	if (result.error) return res.send({ error: result.error.details[0].message })

	res.send({ data: db.getDevice(req.params.id) })
})

//add device
router.post('/', (req, res) => {
	console.log(db.validPins)
	const schema = {
		name: Joi.string().min(3).required(),
		pin: Joi.number().valid(db.validPins).required()
	}
	const result = Joi.validate(req.body, schema)
	if (result.error) return res.send({ error: result.error.details[0].message })

	const { name, pin } = req.body
	const device = db.addDevice(name, parseInt(pin))
	res.send({ data: device })
})

//update device
router.patch('/:id', (req, res) => {
	const bodySchema = {
		state: Joi.number().integer().min(0).max(1).required()
	}
	const paramsSchema = {
		id: Joi.number().integer().required()
	}

	let result = Joi.validate(req.params, paramsSchema)
	if (result.error) return res.send({ error: result.error.details[0].message })
	
	result = Joi.validate(req.body, bodySchema)
	if (result.error) return res.send({ error: result.error.details[0].message })
	
	let { id } = req.params
	let { state } = req.body
	id = parseInt(id)
	state = parseInt(state)
	db.updateDevice(id, state)
	res.send({ data: db.getDevice(id) })
})

//delete device 
router.delete('/:id', (req, res) => {
	const schema = {
		id: Joi.number().required()
	}
	const result = Joi.validate(req.params, schema)
	if (result.error) return res.send({ error: result.error.details[0].message })

	const { id } = req.params
	const device = db.getDevice(id)
	db.deleteDevice(id)
	res.send({ data: device })
})

module.exports = router
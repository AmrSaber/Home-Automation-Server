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
	const schema = {
		name: Joi.string().min(3).required(),
		pin: Joi.number().required()
	}
	const result = Joi.validate(req.body, schema)
	if (result.error) return res.send({ error: result.error.details[0].message })

	const { name, pin } = req.body
	const device = db.addDevice(name, parseInt(pin))
	res.send({ data: device })
})

//update device
router.patch('/:id', (req, res) => {
	const schema = {
		params: {
			id: Joi.number().required()
		},
		body: {
			state: Joi.boolean().required()
		}
	}
	const result = Joi.validate(req, schema)
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
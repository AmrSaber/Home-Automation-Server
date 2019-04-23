const express = require('express')
const db = require('../db')

const router = new express.Router()

//get temperature 
router.get('/', (req, res) =>{
	res.send({ temperature: db.getTemperature()})
})

module.exports = router
const express = require('express')
const db = require('../db')

const router = new express.Router()

//get temprature 
router.get('/temprature', (req, res) =>{
	res.send({ data: db.getTemperature()})
})

module.exports = router
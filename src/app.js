const express = require('express')
const devicesRouter = require('./routers/devices')
const temperatureRouter = require('./routers/temperature')

const app = new express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/devices', devicesRouter)
app.use('/temperature', temperatureRouter)

module.exports = app
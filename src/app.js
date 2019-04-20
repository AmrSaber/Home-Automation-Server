const express = require('express')
const devicesRouter = require('./routers/devices')
const tempratureRouter = require('./routers/temprature')

const app = new express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/devices', devicesRouter)
app.use('/temprature', tempratureRouter)

module.exports = app
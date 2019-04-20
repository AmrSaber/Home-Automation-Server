const express = require('express')
const devicesRouter = require('./routers/devices')

const app = new express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/devices', devicesRouter)

module.exports = app
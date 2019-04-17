const express = require('express')

const app = new express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

module.exports = app
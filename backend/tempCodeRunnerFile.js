const express = require('express')
const app = express()
require('dotenv').config()
const dbconnection = require('./config/db')
const cors = require('cors')

app.use(cors())
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true, limit: '5mb' }))

dbconnection()
app.use('/api', require('./routes/AuthRoute'))
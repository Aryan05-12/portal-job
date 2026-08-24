const express = require('express')
const app = express()
require('dotenv').config()
const dbconnection = require('./config/db')
const cors = require('cors')
const path = require('path');


console.log("EMAIL_USER:", process.env.EMAIL_EMAIL);
console.log("EMAIL_PASS:", process.env.EMAIL_PASSWORD);
app.use(cors())
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))


dbconnection()
app.use('/api', require('./routes/AuthRoute'))

app.use(express.static(path.join(__dirname, '../frontend/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
})


const PORT = parseInt(process.env.PORT, 10) || 1111
app.listen(PORT, ()=>console.log("server is ready"))

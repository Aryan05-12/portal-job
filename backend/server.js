const express = require('express')
const app = express()
require('dotenv').config()
const dbconnection = require('./config/db')
const cors = require('cors')
const path = require('path')

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

app.use(cors())
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))

dbconnection()

// 1. All API Routes
app.use('/api', require('./routes/AuthRoute'))

// 2. Static Files (JS/CSS/Images)
const frontendPath = path.join(__dirname, '../frontend/dist')
app.use(express.static(frontendPath))

// 3. Simple Middleware Fallback (No wildcard strings = Zero PathError)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(frontendPath, 'index.html'))
  }
  next()
})

const PORT = parseInt(process.env.PORT, 10) || 1111
app.listen(PORT, () => console.log("server is ready"))
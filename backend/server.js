const express = require('express')
const app = express()
require('dotenv').config()
const dbconnection = require('./config/db')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

console.log("EMAIL_USER:", process.env.EMAIL_USER)
console.log("EMAIL_PASS:", process.env.EMAIL_PASS)

app.use(cors())
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))

dbconnection()

// 1. API Routes
app.use('/api', require('./routes/AuthRoute'))

// 2. Serve Frontend Static Files
const frontendPath = path.join(__dirname, '../frontend/dist')
const indexPath = path.join(frontendPath, 'index.html')

app.use(express.static(frontendPath))

// 3. Clean Fallback Check
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath)
    } else {
      return res.status(404).send("Frontend build not found. Please verify npm run build executed for frontend.")
    }
  }
  next()
})

const PORT = parseInt(process.env.PORT, 10) || 1111
app.listen(PORT, () => console.log("server is ready"))
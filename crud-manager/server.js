require('dotenv').config()
const express = require('express')
const router = require('./router')
const helmet = require('helmet')
const cors = require('cors')

const app = express()
const port = 8001 || process.env.PORT

app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use('/api/v1', router)
app.get('/api/v1/health', (req, res) => {
  res.send('OK')
})
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`CRUD process application running on ${port} 🛠️`)
})

// module.exports = app
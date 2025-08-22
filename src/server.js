const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const routes = require('./routes/routes')
const bodyParser = require('body-parser')
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

const mongoUri = `${process.env.MONGO_DB}`

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connect DB successfully')
  })
  .catch((error) => {
    console.error('Error connecting to database:', error)
  })

app.use(bodyParser.json())
routes(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')
const { Server } = require('socket.io')

const app = express()
app.disable('x-powered-by')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(cors())
app.use(morgan('tiny'))

app.get('/', (req, res) => {
  res.render('index')
})

const server = require('http').createServer(app)
const io = new Server(server)
require('./socket')(io)

module.exports = server

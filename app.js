const express = require('express')
require('express-async-errors')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')
const { Server } = require('socket.io')
const middleware = require('./utils/middleware')
const propertiesRouter = require('./controllers/propertiesRouter')
const loginRouter = require('./controllers/loginRouter')
const adminRouter = require('./controllers/adminRouter')

const config = require('./utils/config')
const logger = require('./utils/logger')

const app = express()
app.disable('x-powered-by')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
// app.use(fileUpload)

app.use(morgan('tiny'))
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.get('/', (req, res) => {
  res.render('index')
})

app.use('/api/properties', propertiesRouter)
app.use('/api/login', loginRouter)
app.use('/api/admin', middleware.adminMiddleware, adminRouter)

const server = require('http').createServer(app)
const io = new Server(server)
require('./socket')(io)

// const PORT = 3001

// server.listen(PORT, () => {
//   logger.info(`Servidor conectado en el puerto ${PORT}`)
// })

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = server

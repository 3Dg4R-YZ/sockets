const jwt = require('jsonwebtoken')

const config = require('./config')
const logger = require('./logger')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = (req, res, next) => {
  if (req.token) {
    const user = jwt.verify(req.token, config.SECRET)
    if (user) {
      req.user = user
    }
  }

  next()
}

const adminMiddleware = (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'Usuario no autorizado' })
  }

  next()
}

const requestLogger = (req, res, next) => {
  logger.info('---')
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (req, res) => {
  ERRORS_HANDLERS.UnknownEndpoint(res)
}

const ERRORS_HANDLERS = {
  CastError: (res) =>
    res.status(400).json({ error: 'El formato del Id es incorrecto' }),
  ValidationError: (res, error) =>
    res.status(400).json({ error: error.message }),
  MongoServerError: (res, error) => {
    if (error.message.includes('E11000 duplicate key error')) {
      return res
        .status(400)
        .json({ error: 'El nombre de usuario no esta disponible' })
    }
    res.status(400).json({ error: 'Ha ocurrido un error en la base de datos' })
  },
  JsonWebTokenError: (res) => res.status(401).json({ error: 'Token invalido' }),
  TokenExpiredError: (res) => res.status(401).json({ error: 'Token expirado' }),
  DefaultError: (res) =>
    res.status(500).json({ error: 'Ha ocurrido un error en el servidor' }),
  UnknownEndpoint: (res) => res.status(404).json({ error: 'Unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error)
  const handler = ERRORS_HANDLERS[error.name] || ERRORS_HANDLERS.DefaultError
  handler(res, error)
  next(error)
}

module.exports = {
  tokenExtractor,
  userExtractor,
  requestLogger,
  unknownEndpoint,
  errorHandler,
  adminMiddleware
}

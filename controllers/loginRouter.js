const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const config = require('../utils/config')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const isUserCorrect = username === 'admin'
  const isPasswordCorrect = password === 'admin'

  if (!(isUserCorrect && isPasswordCorrect)) {
    return res.status(401).json({
      error: 'Usuario o contraseña incorrecta'
    })
  }
  const userForToken = {
    username
  }
  const token = jwt.sign(userForToken, config.SECRET, {
    expiresIn: 60 * 60 * 24
  })

  res.status(200).send({ token })
})

module.exports = loginRouter

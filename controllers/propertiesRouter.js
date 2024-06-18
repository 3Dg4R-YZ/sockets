const fs = require('fs')

const propertiesRouter = require('express').Router()

propertiesRouter.get('/', async (req, res) => {
  const file = await fs.readFileSync('./db2.json', 'utf-8')
  const result = await JSON.parse(file)
  res.json(result)
})

module.exports = propertiesRouter

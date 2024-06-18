const jwt = require('jsonwebtoken')
const fs = require('fs')
const config = require('../utils/config')
const { validateProduct } = require('../schemas/propertySchema')

const adminRouter = require('express').Router()

// adminRouter.get('/', async (req, res) => {
//   const file = await fs.readFileSync('./db2.json', 'utf-8')
//   const properties = await JSON.parse(file)

//   const newFile = properties.map((property) => {
//     return { ...property, propertyType: 'Apartamento' }
//   })
//   await fs.writeFileSync('./db2.json', JSON.stringify(newFile))
//   res.status(200).json(newFile)
// })

adminRouter.get('/', async (req, res) => {
  const decodedToken = jwt.verify(req.token, config.SECRET)
  if (!decodedToken.username) {
    return res.status(401).json({ error: 'Token invalido' })
  }
  res.status(200).json({ message: 'Usuario ahutorizado' })
})

adminRouter.post('/', async (req, res) => {
  const body = req.body

  console.log(req.files)

  const decodedToken = jwt.verify(req.token, config.SECRET)
  if (!decodedToken.username) {
    return res.status(401).json({ error: 'Token invalido' })
  }
  const { data, success, error } = await validateProduct(body)
  console.log(error)
  if (!success) {
    return res
      .status(400)
      .json({ error: 'Los datos no cumplen la estructura requerida' })
  }

  const file = await fs.readFileSync('./db2.json', 'utf-8')
  const properties = await JSON.parse(file)

  const newFile = properties.concat(data)
  await fs.writeFileSync('./db2.json', JSON.stringify(newFile))
  // for (const image of body.imagesList) {
  //   console.log(image)
  // }
  res.status(201).json(newFile)
})

adminRouter.delete('/:id', async (req, res) => {
  const decodedToken = jwt.verify(req.token, config.SECRET)
  if (!decodedToken.username) {
    return res.status(401).json({ error: 'Token invalido' })
  }

  const id = Number(req.params.id)
  const file = await fs.readFileSync('./db2.json', 'utf-8')
  const properties = await JSON.parse(file)
  const propertyToFind = properties.find((property) => property.id === id)
  if (!propertyToFind) {
    return res.status(404).json({ error: 'No existe ese blog' })
  }
  const newFile = properties.filter(
    (property) => property.id !== propertyToFind.id
  )
  await fs.writeFileSync('./db2.json', JSON.stringify(newFile))
  res.status(204).end()
})

adminRouter.put('/:id', async (req, res) => {
  const decodedToken = jwt.verify(req.token, config.SECRET)
  if (!decodedToken.username) {
    return res.status(401).json({ error: 'Token invalido' })
  }

  const body = req.body
  const { data, success, error } = await validateProduct(body)
  if (!success) return res.status(400).end()

  const id = Number(req.params.id)
  const file = await fs.readFileSync('./db2.json', 'utf-8')
  const properties = await JSON.parse(file)
  const propertyToFind = properties.find((property) => property.id === id)
  if (!propertyToFind) {
    return res.status(404).json({ error: 'No existe ese blog' })
  }
  const newFile = properties.map((property) =>
    property.id === propertyToFind.id ? data : property
  )
  await fs.writeFileSync('./db2.json', JSON.stringify(newFile))
  res.status(201).json(data)
})

module.exports = adminRouter

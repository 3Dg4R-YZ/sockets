const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/', (req, res) => {
  Person.find({}).then((result) => res.send(result))
})

personsRouter.get('/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.send(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

personsRouter.post('/', (req, res) => {
  const newPerson = new Person({ ...req.body })
  if (!newPerson.name || !newPerson.number) {
    return res.status(400).json({ error: 'content missing' })
  }
  Person.find({}).then((result) => {
    if (result.some((person) => person.name.toLowerCase() === newPerson.name.toLowerCase())) {
      return res.status(400).json({ error: 'this person exists' })
    }
    newPerson.save()
      .then((result) => {
        console.log(`added ${newPerson.name} number ${newPerson.number} to phonebook`)
        res.status(201).json(newPerson)
      })
      .catch(() => {
        res.status(500).json({ error: 'Server error' })
      })
  })
})

personsRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then((result) => {
      res.status(204).send(result)
    })
    .catch((error) => next(error))
})

personsRouter.put('/:id', (req, res, next) => {
  const id = req.params.id
  const updatedPerson = { ...req.body }
  Person.findByIdAndUpdate(id, updatedPerson, { new: 'true' })
    .then((result) => {
      res.status(202).send(result)
    })
    .catch((error) => next(error))
})

module.exports = personsRouter

const { Schema, model } = require('mongoose')

const personSchema = new Schema({
  name: { type: String, min: 3, required: true },
  number: { type: String, min: 8, required: true }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = model('Person', personSchema)

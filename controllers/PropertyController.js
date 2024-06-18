import { PropertyModel } from '../models/PropertyModel.js'
import {
  validateProduct,
  validatePartialProduct,
  validateId
} from '../schemas/propertySchema.js'
import {
  DB_ERROR,
  ID_ERROR,
  NOTFOUND_ERROR,
  SERVER_ERROR,
  VALIDATION_ERROR
} from '../utils/errorMessages.js'

export class PropertyController {
  static async getAll (req, res) {
    PropertyModel.getAll()
      .then((products) => res.status(200).send(products))
      .catch(() => res.status(500).send(DB_ERROR))
  }

  static async getById (req, res) {
    if (!validateId(req.params.id)) {
      return res.status(400).send(ID_ERROR)
    }
    PropertyModel.getById(req.params.id)
      .then((product) => {
        if (!product) {
          return res.status(404).send(NOTFOUND_ERROR)
        }
        res.status(200).send(product)
      })
      .catch(() => res.status(500).send(DB_ERROR))
  }

  static async create (req, res) {
    validateProduct(req.body)
      .then((result) => {
        if (!result.success) {
          return res.status(400).send(VALIDATION_ERROR)
        }
        const newProduct = result.data
        PropertyModel.create(newProduct)
          .then((insertId) =>
            res.status(201).send({ id: insertId, ...newProduct })
          )
          .catch(() => res.status(500).send(DB_ERROR))
      })
      .catch(() => res.status(500).send(SERVER_ERROR))
  }

  static async update (req, res) {
    if (!validateId(req.params.id)) {
      return res.status(400).send(ID_ERROR)
    }
    validatePartialProduct(req.body)
      .then((result) => {
        if (!result.success) {
          return res.status(400).send(VALIDATION_ERROR)
        }
        PropertyModel.update(req.params.id, result.data)
          .then((product) => {
            res.status(201).send(product)
          })
          .catch((err) => res.status(500).send(err))
      })
      .catch(() => res.status(500).send(SERVER_ERROR))
  }

  static async delete (req, res) {
    if (!validateId(req.params.id)) {
      return res.status(400).send(ID_ERROR)
    }
    PropertyModel.delete(req.params.id)
      .then((result) => {
        res.status(201).send(result)
      })
      .catch(() => res.status(500).send(DB_ERROR))
  }
}

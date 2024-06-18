import { Router } from 'express'
import { PropertyController } from '../controllers/PropertyController.js'

export const propertiesRouter = Router()

propertiesRouter.get('/', PropertyController.getAll)
propertiesRouter.post('/', PropertyController.create)

propertiesRouter.get('/:id', PropertyController.getById)
propertiesRouter.patch('/:id', PropertyController.update)
propertiesRouter.delete('/:id', PropertyController.delete)

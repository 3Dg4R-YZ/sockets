const z = require('zod')

const propertyTypeEnum = ['Apartamento', 'Casa Independiente']
const areaEnum = [
  'Centro Habana',
  'Cerro',
  'Habana Vieja',
  'La Víbora',
  'Miramar',
  'Nuevo Vedado',
  'Playa',
  'Plaza',
  'Vedado'
]

const propertySchema = z.object({
  id: z.number().int().min(1),
  price: z.number().int().positive(),
  propertyType: z.enum(propertyTypeEnum),
  bedrooms: z.number().int().min(1),
  bathrooms: z.number().int().min(1),
  info: z.string().default(''),
  area: z.enum(areaEnum),
  extras: z.array(z.string()).default([]),
  images: z.number().int().min(0).optional(),
  imagesList: z.any(),
  hidden: z.boolean().default(false).optional()
})

function validateProduct(input) {
  // return propertySchema.safeParse(input)
  return propertySchema.safeParseAsync(input)
}

function validatePartialProduct(object) {
  // return propertySchema.safeParse(object)
  return propertySchema.partial().safeParseAsync(object)
}

function validateId(id) {
  id = Number(id)
  return id > 0 && Math.floor(id) === id
}

module.exports = { validateProduct, validatePartialProduct, validateId }

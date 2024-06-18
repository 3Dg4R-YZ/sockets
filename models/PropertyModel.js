// import mysql from 'mysql2/promise'
import fs from 'fs'
import {
  DB_ERROR,
  NOCHANGE_ERROR,
  NOTFOUND_ERROR
} from '../utils/errorMessages.js'
// const config = {
//   host: 'localhost',
//   port: '3306',
//   user: 'root',
//   password: 'toor',
//   database: 'rentashabanadb'
// }
// const config = {
//   host: 'https://rentashabana.com/phpmyadmin/',
//   user: 'admin2_Edgar',
//   password: '3dg4r.3D',
//   database: 'admin2_rentashabana'
// }
// const getAllQuery = `
// SELECT p.property_id AS id, p.price, p.propertyType, p.bedrooms, p.bathrooms, p.info,
// a.area,
// GROUP_CONCAT(DISTINCT e.extra) AS extras,
// GROUP_CONCAT(DISTINCT i.url) AS images
// FROM property p
// INNER JOIN image i ON i.property_id = p.property_id
// INNER JOIN property_extra pe ON p.property_id = pe.property_id
// INNER JOIN extra e ON pe.extra_id = e.extra_id
// INNER JOIN area a ON a.area_id = p.area_id
// GROUP BY p.property_id`
// const connection = await mysql.createConnection(config)

export class PropertyModel {
  static async getAll () {
    const file = await fs.readFileSync('./db2.json', 'utf-8')
    const result = await JSON.parse(file)
    return result
  }

  static async getById (id) {
    try {
      const file = await fs.readFileSync('./db2.json', 'utf-8')
      const parsedFile = await JSON.parse(file)
      const properties = parsedFile.propertiesdb
      const a = properties.find((el) => (el.id === Number(id)))
      return a
    } catch {
      throw new Error()
    }
  }

  static async create ({
    id,
    price,
    propertyType,
    bedrooms,
    bathrooms,
    info,
    area,
    extras,
    hidden,
    images
  }) {
    try {
      const file = await fs.readFileSync('./db2.json', 'utf-8')
      const parsedFile = await JSON.parse(file)
      const properties = parsedFile.propertiesdb
      if (properties.findIndex((el) => el.id === id) !== -1) throw new Error('Ya estaba creado el objeto')
      properties.push({
        id,
        price,
        propertyType,
        bedrooms,
        bathrooms,
        info,
        area,
        extras,
        hidden,
        images
      })
      const result = await JSON.stringify(parsedFile)
      return fs.writeFileSync('./db2.json', result)
    } catch {
      throw new Error()
    }
  }

  static async update (id, newParams) {
    try {
      const file = await fs.readFileSync('./db2.json', 'utf-8')
      const parsedFile = await JSON.parse(file)
      const properties = parsedFile.propertiesdb
      const propertyIndx = properties.findIndex((el) => (el.id === Number(id)))
      const property = properties[propertyIndx]

      for (const param in newParams) {
        property[param] = newParams[param]
      }
      const result = await JSON.stringify(parsedFile)
      fs.writeFileSync('./db2.json', result)
      return property
    } catch (err) {
      if (err.error) throw err
      throw DB_ERROR
    }
  }

  static async delete (id) {
    try {
      const file = await fs.readFileSync('./db2.json', 'utf-8')
      const parsedFile = await JSON.parse(file)
      const properties = parsedFile.propertiesdb
      parsedFile.propertiesdb = properties.filter((el) => (el.id !== Number(id)))
      const result = await JSON.stringify(parsedFile)
      return fs.writeFileSync('./db2.json', result)
    } catch {
      throw new Error()
    }
  }
}

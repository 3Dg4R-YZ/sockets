const server = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

const PORT = config.PORT ?? 3001
const aplication = server.listen(PORT, () => {
  logger.info(`Servidor conectado en el puerto ${PORT}`)
})

module.exports = aplication

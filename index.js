const server = require('./app')

const PORT = 3001
const aplication = server.listen(PORT, () => {
  console.log(`Servidor conectado en el puerto ${PORT}`)
})

module.exports = aplication

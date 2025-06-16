module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Se ha conectado un nuevo cliente')

    socket.on('add-information', (data) => {
      io.emit('show-information', data)
    })

    socket.broadcast.emit('new-connection', 'Nuevo cliente conectado')

    socket.on('disconnect', () => {
      console.log('El cliente se ha desconectado')
    })

    socket.on('writing', (username) => {
      socket.broadcast.emit('writing', username)
    })
  })
}

const path = require('path')
const express= require('express')
const socketIo = require('socket.io')

const app = express()
app.use(express.static(path.join(__dirname, '/public')))
const expressServer = app.listen(8080);
const io= socketIo(expressServer)
io.on('connection',(socket)=>{
  
 socket.emit('messageFromServer',{message:"connection established"})
 socket.on('messageToServer',(message)=>{
    io.emit('clientMessage',message)
    socket.emit('infoFromServer',{message:'message received'})
 })
 
}) 
io.of('/general').on('connection',(socket)=>{
   console.log('connected')
   socket.on('messageToServer',(message)=>{
       io.of('/general').emit('clientMessage',message);
       socket.emit('infoFromServer',{message:'message received and sent'})
   })
});
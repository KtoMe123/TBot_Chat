import express from "express";
import cors from "cors";
import { Server } from 'socket.io';
import mesRouter from './routes/mess_routes.js';
import userRouter from './routes/user_routers.js';
const server = () => {

  const PORT = process.env.PORT || 8080
  const app = express();

  app.use(cors())
  app.use(express.json())
  app.use('/api', mesRouter)
  app.use('/api', userRouter)

  app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
  });


  const io = new Server(3000, {
    cors: {
      origin: ["http://localhost:5173"]
    }
  })


  io.on('connection', socket => {
    console.log(socket.id)
    socket.on('send-message', (message) => {
      io.emit('receive-message', message)
    })
    socket.on('send-user', (user) => {
      io.emit('receive-user', user)
    })
    socket.on('send-my-mess', (mess) => {
      io.emit('receive-my-mess', mess)
    })
    socket.on('send-mess-view', (mess, count) => {
      io.emit('receive-mess-view', mess, count)
    })
    
  })

  app.listen(PORT, () => console.log(`server start: ${PORT}`))
}

export default server

import express from "express";
import cors from "cors";
import { Server } from 'socket.io';
import mesRouter from './routes/mess_routes.js';
import userRouter from './routes/user_routes.js';
import botRouter from './routes/bot_routes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import path from 'path'
import axios from "axios";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const server = () => {
  const PORT = process.env.PORT || 8081
  const app = express();


  app.use(cors())
  app.use(express.json())
  app.use('/api', mesRouter)
  app.use('/api', userRouter)
  app.use('/api', botRouter)

  app.get('/', function(req, res) { 
    res.sendFile(__dirname + '/index.html');
  });
  let storage_img = multer.diskStorage({
    
    destination: function (req, file, cb) {
      cb(null, __dirname + '/uploads')
    },
    filename: function (req, file, cb) {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8') 
      console.log(file.originalname)
      cb(null, file.originalname)
    }
  })
  const upload_img = multer({ storage: storage_img })

  let storage_video = multer.diskStorage({
    
    destination: function (req, file, cb) {
      cb(null, __dirname + '/uploads_video')
    },
    filename: function (req, file, cb) {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8') 
      console.log(file.originalname)
      cb(null, file.originalname)
    }
  })
  const upload_video = multer({ storage: storage_video })

  let storage_file = multer.diskStorage({
    
    destination: function (req, file, cb) {
      cb(null, __dirname + '/uploads_file')
    },
    filename: function (req, file, cb) {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8') 
      console.log(file.originalname)
      cb(null, file.originalname)
    }
  })
  const upload_file = multer({ storage: storage_file })

  app.post('/uploads', upload_img.single('photo'), (req, res) => {
    if (req.file) {
      
      res.sendStatus(200);
    } else {
      console.error('Ошибка при сохранении картинки в папку uploads.');
      res.sendStatus(500);
    }
    
  });
  app.post('/uploads_video', upload_video.single('video'), (req, res) => {
    if (req.file) {
      
      res.sendStatus(200);
    } else {
      console.error('Ошибка при сохранении картинки в папку uploads.');
      res.sendStatus(500);
    }
    
  });
  app.post('/uploads_file', upload_file.single('document'), (req, res) => {
    if (req.file) {
      
      res.sendStatus(200);
    } else {
      console.error('Ошибка при сохранении картинки в папку uploads.');
      res.sendStatus(500);
    }
    
  });
  app.use('/uploads_file', express.static(path.join(__dirname, 'uploads_file')))
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
  app.use('/uploads_video', express.static(path.join(__dirname, 'uploads_video')))
  

  const io = new Server(3000, {
    cors: {
      origin: "*",
    }
  })

  io.on('connection', socket => {
    // console.log(socket.id)
    socket.on('send-message', (message) => {
      
      axios
      .get('http://localhost:8081/api/bots/' + message.token)
      .then((response) => {
        let data = response.data
        data.forEach(element => {
          console.log(element.socket_main)
          io.to(element.socket_main).emit('receive-message', message)
        });
        
      })
      
    })
    socket.on('send-img', (img) => {
      axios
      .get('http://localhost:8081/api/bots/' + img.token)
      .then((response) => {
        let data = response.data
        data.forEach(element => {
          io.to(element.socket_main).emit('receive-img', img)
        });
        
      })
    })
    socket.on('send-user', (user) => {
      axios
      .get('http://localhost:8081/api/bots/' + user.token)
      .then((response) => {
        let data = response.data
        data.forEach(element => {
          io.to(element.socket_main).emit('receive-user', user)
        });
        
      })
    })
    socket.on('send-my-mess', (token, mess) => {
      axios
      .get('http://localhost:8081/api/bots/' + token)
      .then((response) => {
        let data = response.data
        data.forEach(element => {
          io.to(element.socket_main).emit('receive-my-mess', mess)
        });
        
      })
    })
    socket.on('send-mess-view', (token, mess, count) => {
      axios
      .get('http://localhost:8081/api/bots/' + token)
      .then((response) => {
        let data = response.data
        console.log(data)
        data.forEach(element => {
          io.to(element.socket_list).emit('receive-mess-view', token, mess, count)
        });
        
      })
    })
    
  })
  app.listen(PORT, () => console.log(`server start: ${PORT}`))

  
}

export default server

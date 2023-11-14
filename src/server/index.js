import {Telegraf} from 'telegraf'
import server from "./Server.js"
server()
import { io } from 'socket.io-client'
import axios from 'axios'
import fs from "fs"
import * as https  from "https"
import fetch from "node-fetch";

const socket = io('http://localhost:3000')

const bot = new Telegraf("6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4");
bot.command('start', ctx => {
  fetch('http://localhost:8080/api/users')
    .then((response) => response.json())
    .then((data) =>  {

      if (data.find(e => Number(e.id_chat) === ctx.from.id && e.token === ctx.telegram.token)) {
        console.log("Again")
      } else {
        socket.emit('send-user', user)

        axios
          .post('http://localhost:8080/api/users',
          {
            id_chat: ctx.from.id,
            username: ctx.from.first_name,
            link: ctx.from.username,
            count: 0,
            token: ctx.telegram.token,
          }
          )
          .then(response => {
              console.log('Значение успешно добавленно');
          })
          .catch(err => {
              console.error('Ошибка при добавленнии значения:', err);
          });
      }
    })
  console.log(ctx.telegram.token)
  bot.telegram.sendMessage(ctx.chat.id, "Hello", {
  })
  let user = {
    id_chat: ctx.from.id,
    username: ctx.from.first_name,
    link: ctx.from.username,
    count: 0,
    token: ctx.telegram.token
  }
  
})



bot.on('message', msg => {
  let Hours = new Date().getHours()
  let Min = new Date().getMinutes()

    if(Hours.toString().length === 1) {
        Hours = "0" + Hours
    } 
    if(Min.toString().length === 1) {
        Min = "0" + Min
    } 
  let info_text = {
    id_chat: msg.message.from.id,
    main: {text: msg.message.text, username: msg.message.from.first_name, time: `${Hours}:${Min}`},
    seen: 'false',
    token: msg.telegram.token
  }

    let count = 0
    fetch('http://localhost:8080/api/users/' + msg.message.from.id)
      .then((response) => response.json())
      .then((data) => {
        
        axios
          .put('http://localhost:8080/api/users/' + msg.message.from.id,
          {
            count: data[0].count + 1,
            id_chat: msg.message.from.id,
            token: msg.telegram.token
          }
          )
          .then(response => {
              console.log('Значение успешно добавленно');
              count = data[0].count
          })
          .catch(err => {
              console.error('Ошибка при добавленнии значения:', err);
          });
    })

  if(msg.message.text) {

    axios
      .post('http://localhost:8080/api/mess',
      {
        id_chat: msg.message.from.id,
        main: {text: msg.message.text, username: msg.message.from.first_name, time: `${Hours}:${Min}`},
        seen: 'false',
        token: msg.telegram.token
      }
      )
      .then(response => {
        setTimeout(() => {
          socket.emit('send-message', info_text)
        },250)
          console.log('Значение успешно добавленно');
      })
      .catch(err => {
          console.error('Ошибка при добавленнии значения:', err);
      });
      setTimeout(() => {
        socket.emit('send-mess-view', msg.message.from.id, count)
      },250)
  } else if(msg.message.photo) {
      let photo = msg
      const imgId = photo.update.message.photo.pop().file_unique_id;
      const fileId = photo.update.message.photo.pop().file_id;
      
      let info_img = {
        id_chat: photo.message.from.id,
        main: {img: `${imgId}.png`, username: photo.message.from.first_name, time: `${Hours}:${Min}`},
        seen: 'false',
        token: photo.telegram.token
      }
      
      photo.telegram.getFileLink(fileId).then((link) => {
        https.get(link, (response) =>
          response.pipe(fs.createWriteStream(`src/server/uploads/${imgId}.png`))
        );
      });
      axios
        .post('http://localhost:8080/api/mess',
        {
          id_chat: photo.message.from.id,
          main: {img: `${imgId}.png`, username: photo.message.from.first_name, time: `${Hours}:${Min}`},
          seen: 'false',
          token: photo.telegram.token
        }
        )
        .then(response => {
          setTimeout(() => {
            socket.emit('send-message', info_img)
            socket.emit('send-mess-view', photo.message.from.id, count)
          },250)
          
            console.log('Значение успешно добавленно');
        })
        .catch(err => {
            console.error('Ошибка при добавленнии значения:', err);
        });
  } else if (msg.message.video) {
    const videoId = msg.update.message.video.file_unique_id;
    const fileId = msg.update.message.video.file_id;
    
    let info_video = {
      id_chat: msg.message.from.id,
      main: {video: `${videoId}.mp4`, username: msg.message.from.first_name, time: `${Hours}:${Min}`},
      seen: 'false',
      token: msg.telegram.token
    }
    
    msg.telegram.getFileLink(fileId).then((link) => {
      https.get(link, (response) =>
        response.pipe(fs.createWriteStream(`src/server/uploads_video/${videoId}.mp4`))
      );
    });
    axios
      .post('http://localhost:8080/api/mess',
      {
        id_chat: msg.message.from.id,
        main: {video: `${videoId}.mp4`, username: msg.message.from.first_name, time: `${Hours}:${Min}`},
        seen: 'false',
        token: msg.telegram.token
      }
      )
      .then(response => {
        setTimeout(() => {
          socket.emit('send-message', info_video)
          socket.emit('send-mess-view', msg.message.from.id, count)
        },250)
        
          console.log('Значение успешно добавленно');
      })
      .catch(err => {
          console.error('Ошибка при добавленнии значения:', err);
      });

  } else if(msg.update.message.document) {

    const IdFile = msg.update.message.document.file_name;
    const fileId = msg.update.message.document.file_id;
    
    let info_file = {
      id_chat: msg.message.from.id,
      main: {file: `${IdFile}`, username: msg.message.from.first_name, time: `${Hours}:${Min}`},
      seen: 'false',
      token: msg.telegram.token
    }
    
    msg.telegram.getFileLink(fileId).then((link) => {
      https.get(link, (response) =>
        response.pipe(fs.createWriteStream(`src/server/uploads_file/${IdFile}`))
      );
    });
    axios
      .post('http://localhost:8080/api/mess',
      {
        id_chat: msg.message.from.id,
        main: {file: `${IdFile}`, username: msg.message.from.first_name, time: `${Hours}:${Min}`},
        seen: 'false',
        token: msg.telegram.token
      }
      )
      .then(response => {
        setTimeout(() => {
          socket.emit('send-message', info_file)
          socket.emit('send-mess-view', msg.message.from.id, count)
        },250)
        
          console.log('Значение успешно добавленно');
      })
      .catch(err => {
          console.error('Ошибка при добавленнии значения:', err);
      });
  } else if(msg.update.message.voice) {
    const IdVoice = msg.update.message.voice.file_unique_id;
    const fileId = msg.update.message.voice.file_id;
    console.log(msg.update.message.voice)
    let info_file = {
      id_chat: msg.message.from.id,
      main: {voice: `${IdVoice}.ogg`, username: msg.message.from.first_name, time: `${Hours}:${Min}`},
      seen: 'false',
      token: msg.telegram.token
    }
    
    msg.telegram.getFileLink(fileId).then((link) => {
      https.get(link, (response) =>
        response.pipe(fs.createWriteStream(`src/server/uploads_file/${IdVoice}.ogg`))
      );
    });
    axios
      .post('http://localhost:8080/api/mess',
      {
        id_chat: msg.message.from.id,
        main: {voice: `${IdVoice}.ogg`, username: msg.message.from.first_name, time: `${Hours}:${Min}`},
        seen: 'false',
        token: msg.telegram.token
      }
      )
      .then(response => {
        console.log('Значение успешно добавленно');
        setTimeout(() => {
          socket.emit('send-message', info_file)
          socket.emit('send-mess-view', msg.message.from.id, count)
        }, 250)
        
      })
      .catch(err => {
          console.error('Ошибка при добавленнии значения:', err);
      });
  } else {
    console.log("dont support")
    return
  }
  
  
  
  
  
  
})
function debug(obj = {}) {
  return JSON.stringify(obj, null, 4)
}

bot.launch();


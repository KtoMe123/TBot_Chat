



import {Telegraf} from 'telegraf'
import server from "./Server.js"
server()
import { io } from 'socket.io-client'
import axios from 'axios'

const socket = io('http://localhost:3000')

const bot = new Telegraf("6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4");
bot.command('start', ctx => {
  fetch('http://localhost:8080/api/users')
    .then((response) => response.json())
    .then((data) =>  {
      console.log(data)
      if (data.find(e => e.id_chat === ctx.from.id)) {
        console.log("Again")
      } else {
        socket.emit('send-user', user)

        axios
          .post('http://localhost:8080/api/users',
          {
            id_chat: ctx.from.id,
            username: ctx.from.first_name,
            link: ctx.from.username,
            count: 0
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
  console.log(ctx.from)
  bot.telegram.sendMessage(ctx.chat.id, "Hello", {
  })
  let user = {
    id_chat: ctx.from.id,
    username: ctx.from.first_name,
    link: ctx.from.username,
    count: 0
  }
  
  
})
bot.on('message', msg => {
  const { id } = msg.chat
  let Hours = new Date().getHours()
  let Min = new Date().getMinutes()


    if(Hours.toString().length === 1) {
        Hours = "0" + Hours
    } 
    if(Min.toString().length === 1) {
        Min = "0" + Min
    } 
  let info = {
    id_chat: msg.message.from.id,
    main: {text: msg.message.text, username: msg.message.from.first_name, time: `${Hours}:${Min}`},
    seen: 'false'
  }

    let count
    fetch('http://localhost:8080/api/users/' + msg.message.from.id)
      .then((response) => response.json())
      .then((data) => {
        
        axios
          .put('http://localhost:8080/api/users/' + msg.message.from.id,
          {
            count: data[0].count + 1,
            id_chat: msg.message.from.id
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


  axios
    .post('http://localhost:8080/api/mess',
    {
      id_chat: msg.message.from.id,
      main: {text: msg.message.text, username: msg.message.from.first_name, time: `${Hours}:${Min}`},
      seen: 'false'
    }
    )
    .then(response => {
        console.log('Значение успешно добавленно');
    })
    .catch(err => {
        console.error('Ошибка при добавленнии значения:', err);
    });
  setTimeout(() => {
    console.log(count)
    socket.emit('send-message', info)
    socket.emit('send-mess-view', msg.message.from.id, count)
  },250)
  
  
})
function debug(obj = {}) {
  return JSON.stringify(obj, null, 4)
}

bot.launch();


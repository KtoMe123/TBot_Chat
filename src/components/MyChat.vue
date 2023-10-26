<script setup>
import { computed, onMounted } from "vue";
import { ref } from "vue";
import { io } from 'socket.io-client'
import axios from 'axios'

const props = defineProps({
  UserId: {
    type: Number,
    required: true,
  },
  MyUsers: {
    type: Array,
  },
  Message: {
    type: Array
  }
})
const Smiles = ['😀', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😈',
                '😉', '😊', '😋', '😌', '😍', '😎', '😏', '😐', '😑',
                '😒', '😓', '😔', '😕', '😖', '😗', '😘', '😙', '😚',
                '😛', '😜', '😝', '😞', '😟', '😠', '😡', '😢', '😣',
                '😤', '😥', '😦', '😧', '😨', '😩', '😪', '😫', '😬',
                '😭', '😮', '😯', '😰', '😱', '😲', '😳', '😴', '😵',
                '😶', '😷', '😸', '😹', '😺', '😻', '😼', '😽', '😾', '😿',
                '🙀', '💩', '☠', '👌', '👍', '👎', '🙈', '🙉', '🙊']

const socket = io('http://localhost:3000')



const Mess = ref('')
const VisibleSmile = ref(false)
const token = "6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4";
const url = (id, mess) => {
  let i = (`https://api.telegram.org/bot${token}/sendMessage?chat_id=${id}&text=${mess}`);
  return i
}
const UpdUrl = `https://api.telegram.org/bot${token}/getupdates`

function OpenSmile() {
    if(VisibleSmile.value === true) {
        VisibleSmile.value = false
        return
    }
    VisibleSmile.value = true
    
}

const AddSmile = (smile) => {
    Mess.value += smile
}

const oReq = new XMLHttpRequest();
const xhr = new XMLHttpRequest();
const SendMEss = () => {
  const Hours = ref(new Date().getHours())
  const Min = ref(new Date().getMinutes())

  if(Hours.value.toString().length === 1) {
      Hours.value = "0" + Hours.value
  } 
  if(Min.value.toString().length === 1) {
      Min.value = "0" + Min.value
  } 
  const EmitMess = ref({
    id_chat: props.UserId,
    main: {text: Mess.value, username: "Admin", time: `${Hours.value}:${Min.value}`}, 
    seen: 'true'
  })

    axios
      .post('http://localhost:8080/api/mess',
      {
        id_chat: props.UserId,
        main: {text: Mess.value, username: "Admin", time: `${Hours.value}:${Min.value}`}, 
        seen: 'true'
      }
      )
      .then(response => {
          console.log('Значение успешно добавленно');
      })
      .catch(err => {
          console.error('Ошибка при добавленнии значения:', err);
      });
  socket.emit('send-my-mess', EmitMess.value)
  oReq.open("POST", url(props.UserId, Mess.value), true);
  oReq.send();
  Mess.value = ''
}



</script>

<template>
<div class="chat-frame-empty" v-if="UserId === ''">Search Chat</div>
  <div :class="['chat-frame', {'chat-frame_d': Number(user.id_chat) === UserId}]" v-for="user in MyUsers" :key="user.id">
    <div class="chat-frame__wrapper">
      <div class="chat__header">
        <a :href="'https://t.me/' + user.link" class="chat__header-text">{{user.username}}</a>
        </div>
      <div class="chat__content" >
        <div class="chat__messages" v-for="mess in Message" :key="mess.chat_id">
          <div 
            :class="['chat__message', {'chat__message_frend': mess.main.username != 'Admin'}, {'chat__message_my': mess.main.username === 'Admin'}]"
            v-if="Number(mess.id_chat) === UserId"
          >
            <p class="chat__text ">{{mess.main.text}}<br><span class="chat__time">{{mess.main.time}}</span></p>
          </div>
        </div>
        <div class="chat-input">
          <div class="chat-input-main">
            <div v-if="VisibleSmile === true" class="chat-input__smile">
              <div class="chat-input__smile-main">
                <div 
                    v-for="(smile, index) in Smiles"
                    :key="index"
                >
                <div class="chat-input__smile-item" @click="AddSmile(smile)">{{smile}}</div>
                </div>
              </div>
            </div>
            <div class="chat-input__main">
              <div class="chat-input__icon">
                <ion-icon ion-icon class="smile-icon" name="happy-outline" @click="OpenSmile"></ion-icon>
              </div>
            
              <input class="chat-input__input" v-model="Mess" @keyup.enter="SendMEss" type="text"  placeholder="Message">
            </div>
          </div>
      </div>
    </div>
      </div>
      
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar-thumb:horizontal {
  margin-right: 5px;
}

::-webkit-scrollbar {
    width: 0;
}


* { 
    scrollbar-width: none;
}

.smile-icon {
  cursor: pointer;
  margin-left: 10px;
}

.chat {
  &__header {
    width: 100%;
    height: 50px;
    background: #fff;
    border-left: 1px solid #c4c4c4;
    border-bottom: 1px solid #c4c4c4;
    display: flex;
    align-items: center;
  &-text {
    margin-left: 15px;
    font-size: 20px;
    transition: all 0.4s;
    
    &:hover {
      color: #266caa;
    }
  }
  }
  &-input {
    width: 100%;
    position: absolute;
    bottom: 55px;
    &__main {
      display: flex;
      justify-content: center;
      padding: 0 10px;
    }
    &__smile {
      display: flex;
      justify-content: center;
      padding: 0 10px;
      
      &-main {
        display: flex;
        max-width: 200px;
        flex-wrap: wrap;
        overflow: auto;
        max-height: 100px;
      }
      &-item {
        cursor: pointer;
        margin: 5px;
        font-size: 25px;
      }
    }
    &__icon {
        font-size: 30px;
        color: #51585c;
        height: 56px;
        background: #fff;
        display: flex;
        align-items: center;
        border-radius: 15px 0% 0% 15px;
    }
    &__input {
      height: 56px;
      width: 660px;
      padding: 20px;
      border-radius: 0% 15px 15px 0%;
      font-size: 16px;
    }
  }
  &-frame {
    width: 100%;
    height: 100%;
    display: none;
    &_d {
      display: block;
    }
    &-empty {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.4;
    }
    &__wrapper {
      min-height: 100%;
      display: flex;
      flex-direction: column;
      background: url('src/assets/translucent-image.png');
      background-size: 510px auto;
    }
  }
  &__content {
    overflow-y: auto;
    flex: 1 1 auto;
    max-height: 750px;
    height: 100%;
    
  }
  &__messages {
    transform: scaleY(-1);
    display: flex;
    flex-direction: column-reverse;
    margin: 0 auto;
    max-width: 700px;
    
    }
    &__message {
      position: relative;
      display: flex;
      margin: 5px 0;
    }
    &__message_my {
      justify-content: flex-end;
      & .chat__text {
        background-color: rgb(138, 169, 242);
        text-align: right;
        transform: scaleY(-1);
        margin: 0 20px;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          right: -12px;
          width: 20px;
          height: 20px;
          background: linear-gradient( 135deg,rgb(138, 169, 242) 0%, rgb(138, 169, 242) 50%, transparent 50%, transparent);
        }
      }
      
    }
    
    &__message_frend .chat__text {
      margin: 0 20px;
      transform: scaleY(-1);  
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -12px;
        width: 20px;
        height: 20px;
        background: linear-gradient( -135deg,#fff 0%, #fff 50%, transparent 50%, transparent);
      }
    }
    &__text {
      text-align: left;
      padding: 12px;
      background-color: #fff;
      border-radius: 10px;
      font-size: 14px;
      max-width: 300px;
      overflow-wrap: break-word;
    }
    &__time {
        display: block;
        margin-top: 5px;
        font-size: 12px;
        opacity: 0.5;
    }
}
</style>
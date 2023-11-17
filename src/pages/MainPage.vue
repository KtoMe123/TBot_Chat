<script setup>
import List from '../components/MyList.vue'
import Chat from '../components/MyChat.vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { io } from 'socket.io-client'

const props = defineProps({
  id: {
    type: String,
  },
  mail: {
    type: String,
  },
})

const socket = io('http://localhost:3000')


  socket.on('connect', () => {
    axios
      .put('http://localhost:8080/api/bot_update_main/',
      {
        socket_main: socket.id,
        token: props.id
      }
      )
      .then(response => {
      })
      .catch(err => {
          console.error('Ошибка при добавленнии значения:', err);
      });
})






const Message = ref([])
onMounted(() => {
  fetch('http://localhost:8080/api/bot-mess/' + props.id)
    .then((response) => response.json())
    .then((data) => {
      data.filter((v,i,a)=>a.sort((c, b) => b.id - c.id))
      Message.value = data.filter((v,i,a)=>a.sort((c, b) => b.id - c.id))
    })
})

const ImgVal = ref('')

socket.on('receive-message', message => {
  if(message.main.text) {
    Message.value.unshift(message)
  }else if(message.main.img) {
    setTimeout(() => {
      Message.value.unshift(message)
    },2000)
  } else if(message.main.video) {
    setTimeout(() => {
      Message.value.unshift(message)
    },2000)
  } else {
    setTimeout(() => {
      Message.value.unshift(message)
    },5000)
  }
  
    
})
const fbase64 = ref('')
const fr = ref('')

socket.on('receive-my-mess', mess => {
    Message.value.unshift(mess)
})

const UserId = ref('')
const MyUsers = ref('')
const GetId = (UsersId) => {
  return UserId.value = UsersId
}
const GetUsers = (Users) => {
    return MyUsers.value = Users.value
}
</script>

<template>
  <div class="container">
    <div class="header">
      <h1 class="header-text">TeleBot</h1>
    </div>

    <div class="main">
      <div class="main__list">
        <List @SendId="GetId" @SendUser="GetUsers" :token="props.id" :Message="Message"/></div>
      <div class="main__chat">

        <Chat :UserId="UserId" :MyUsers="MyUsers" :token="props.id" :Message="Message"/>
      </div>
    </div>
    
    
  </div>
  
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Days+One&display=swap');
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
}

.main {
  display: flex;
  min-width: 100%;
  border: 1px solid rgba(146, 167, 186, 0.68);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  &__list {
    width: 100%;
    min-width: 220px;
    position: relative;
    flex: 25%;
    height: 100%;
    transition: .6s;
    background: #fff;
    box-shadow: 1px 1px 1px 1px rgba(146, 167, 186, 0.68);;
  }
  &__chat {
    width: 100%;
    right: 0;
    display: flex;
    position: relative;
    flex: 75%;
    height: 100%;
    background: rgba(146, 167, 186, 0.68);
  }
}

.header {
  width: 100%;
  height: 40px;
  background: #33bcfe;
  &-text {
    display: flex;
    color: #fff;
    align-items: center;
    height: 100%;
    margin-left: 20px;
    font-size: 25px;
    font-family: 'Days One', sans-serif;
  }
}

</style>
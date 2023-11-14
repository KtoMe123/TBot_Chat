<script setup>
import { computed, nextTick, onMounted, ref } from "vue";
import { io } from 'socket.io-client'
import axios from 'axios'

const socket = io('http://localhost:3000')
const TrueId = ref('')
const UserMess = ref('')
const MessView = ref([])
const CountView = ref({})
const CountsView = ref([])


const props = defineProps({
  Message: {
    type: Array
  },
  token: {
    type: String,
    required: true
  }
})

const GetUserMess = () => {
  fetch('http://localhost:8080/api/mess/' + TrueId.value)
    .then((response) => response.json())
    .then((data) => {
      UserMess.value = data
    })
    return UserMess.value
}


socket.on('receive-mess-view', (user_id, count) => {
  MessView.value.push(user_id)
  console.log(user_id)
  console.log(count)
  CountView.value = {
    key: user_id,
    count: count + 1
  }
  
  CountsView.value.unshift(CountView.value)

  CountsView.value = CountsView.value.filter(({key}) => (!CountsView.value[key] && (CountsView.value[key] = 1)));

  MessView.value = MessView.value.filter((val, ind) => ind === MessView.value.indexOf(val))
  if (MessView.value.includes(Number(TrueId.value))) {
    MessView.value.splice(MessView.value.indexOf(Number(TrueId.value)), 1)
    axios
      .put('http://localhost:8080/api/mess/' + TrueId.value,
      {
        seen: true,
        id_chat: TrueId.value
      }
      )
      .then(response => {
          console.log('Значение успешно добавленно');
      })
      .catch(err => {
          console.error('Ошибка при добавленнии значения:', err);
      });

    axios
      .put('http://localhost:8080/api/users/' + TrueId.value,
      {
        count: 0,
        id_chat: TrueId.value
      }
      )
      .then(response => {
          console.log('Значение успешно добавленно');
      })
      .catch(err => {
          console.error('Ошибка при добавленнии значения:', err);
      });
  }

  SortedUsers.value.sort((a,b) => MessView.value.indexOf(Number(b.id_chat)) - MessView.value.indexOf(Number(a.id_chat)))

})

onMounted(() => {
  fetch('http://localhost:8080/api/bot-users/' + props.token)
    .then((response) => response.json())
    .then((data) => {
      Users.value = data
      SendUser()
    })
  
})



const Users = ref([])
const Search = ref('')

socket.on('receive-user', user => {
    Users.value.push(user)
    SendUser()
})
const SendUser = () => {
  emits("SendUser", Users)
}

const emits = defineEmits(['SendId', "SendUser"])
const SendId = () => {
  GetUserMess()
  setTimeout(() => {
    axios
      .put('http://localhost:8080/api/mess/' + TrueId.value,
      {
        seen: true,
        id_chat: TrueId.value,
        token: props.token
      }
      )
      .then(response => {
          console.log('Значение успешно добавленно');
      })
      .catch(err => {
          console.error('Ошибка при добавленнии значения:', err);
      });

    axios
      .put('http://localhost:8080/api/users/' + TrueId.value,
      {
        count: 0,
        id_chat: TrueId.value,
        token: props.token
      }
      )
      .then(response => {
          console.log('Значение успешно добавленно');
      })
      .catch(err => {
          console.error('Ошибка при добавленнии значения:', err);
      });
  },200)
  
  emits("SendId", Number(TrueId.value))

  if (MyMess.value.indexOf(TrueId.value) > -1) {
    MyMess.value.splice(MyMess.value.indexOf(TrueId.value), 1)
  }

  if (MessView.value.indexOf(Number(TrueId.value)) > -1) {
    MessView.value.splice(MessView.value.indexOf(Number(TrueId.value)), 1)
  }

  
}
function Focus() {
  let elem = document.getElementsByClassName("users-search__input")[0]
  elem.focus();
}

const SortedUsers = computed(() => {
  if (Search.value) {
      return Users.value.filter(item => {
          return item.username.toLowerCase().includes(Search.value.toLowerCase());
      });
  }
  
  return Users.value
  })
const MyMess = ref([])

onMounted(() => {
  setTimeout(() => {
    props.Message.forEach((element) => {
      if(element.seen === false) {
          MyMess.value.push(element.id_chat)
      }
    })
    MyMess.value = MyMess.value.filter(function(item, pos) {
      return MyMess.value.indexOf(item) == pos;
    })

  SortedUsers.value.sort((a,b) => MyMess.value.indexOf(b.id_chat) - MyMess.value.indexOf(a.id_chat))
  }, 500)

})

function UserId(id) {
  TrueId.value = id;
}
</script>

<template>
<div class="users-search">
  
  <ion-icon class="users-search__icon" name="search-outline" @click="Focus"></ion-icon>
  <input v-model="Search" class="users-search__input" type="text" placeholder="Search" name="search">
</div>
  <div class="users" @click="SendId">
    <div class="users-empty" v-if="SortedUsers.length < 1">empty</div>
    <div class="users__list">
      <div class="users__item" v-for="user in SortedUsers" :key="user.id" @click="UserId(user.id_chat)">
        <div  class="users__img"><img src="src/assets/user(1).png" alt="user" class="user-img"></div>
        <div class="users__info">
          <div class="users__name">{{user.username}}</div>
      </div>
        <span class="users-read">
          <div class="users-read__bd" v-if="MyMess.includes(user.id_chat)">{{user.count}}</div>
          <div v-else>
            <div v-for="view in MessView" :key="view">
              <div class="users-read__r-time" v-if="view === Number(user.id_chat)">
                <div class="users-read__count" v-for="count in CountsView" :key="count.key">
                  <div class="user-read__count-value" v-if="count.key === Number(user.id_chat)">{{count.count}}</div>
                </div>
              </div>
            </div>
          </div>
        </span>
    </div>
    </div>
    
  </div>
</template>

<style lang="scss" scoped>
.users {
  &__list {
    overflow: auto;
  }
  &-read {
    color: white;
    font-size: 14px;
    &__bd {
      background: rgb(0, 156, 217);
      padding: 4px 7px;
      border-radius: 45px;
      position: absolute;
      right: 30px;
      top: 28px;
    }
    &__r-time {
      background: rgb(0, 156, 217);
      padding: 3px 6px;
      border-radius: 45px;
      position: absolute;
      right: 30px;
      top: 28px;
    }
  }
  &-empty {
    font-size: 30px;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    opacity: 0.3;
    font-weight: 700;
  }
  &-search {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    &__input {
      height: 100%;
      width: 100%;
      margin-left: 10px;
      font-size: 15px;
    }
    &__icon {
      margin-left: 10px;
      font-size: 25px;
      cursor: pointer;
    }
  }
  &__img {
    position: relative;
    width: 45px;
    height: 45px;
    overflow: hidden;
    border-radius: 45px;
    cursor: pointer;
    margin-right: 20px;

      & .user-img {
        position: relative;
        width: 45px;
        height: 45px;
      }
  }
  &__item {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    cursor: pointer;
    &:hover {
        background: #f5f5f5;
    }
  }
}
</style>

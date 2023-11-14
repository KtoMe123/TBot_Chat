<script setup>
import { ref } from "vue"
const test = "test"
const Login = ref(false)
const Reg = ref(false)
const EmailField = ref('')
const PassField = ref('')
const SearchBot = ref('http://localhost:8080/api/bot/')
const BotInfo = ref('')

function InfoBot(link) {
  setTimeout(() => {
    fetch(link)
    .then((response) => response.json())
    .then((data) => BotInfo.value = data)
  },50)
  setTimeout(() => {
    if(BotInfo.value.length === 1) {
      if (BotInfo.value[0].mail != EmailField.value) {
        console.log("почта введена неверно")
      } else if (BotInfo.value[0].pass != PassField.value)   {
        console.log("пароль введен неверно")
      } else {
        Login.value = true
      }
    }
  }, 150)

  
}

const emits = defineEmits('OpenReg')
function OpenReg () {
  Reg.value = true
  emits("OpenReg", Reg)
}

</script>

<template>
  <div class="login">
    <form class="login__form" @submit.prevent="submitForm">
      <div class="login-title">
        <span class="login-title__text">TeleBot</span> Login 
      </div>
      <div class="login-input">
        <label class="input">
          <input 
            class="login-input__main"
            placeholder="Mail"
            @input="InfoBot(SearchBot + EmailField)"
            v-model="EmailField"
          >
          <span class="text"><span>Mail</span></span>
        </label>
        <label class="input">
          <input 
            class="login-input__main"
            placeholder="Pass"
            v-model="PassField"
            @input="InfoBot(SearchBot + EmailField)"
            type="password"
          >
          <span class="text"><span>Pass</span></span>
        </label>
      </div>
      <div class="login__button">
        <button type="submit" class="login-button">
          <div class="login__link" v-if="Login === false">Вход</div>
          <router-link  class="login__link" v-if="Login === true" :to="{name: 'Main', params: {id: BotInfo[0].token}}">Вход</router-link>
          </button>
      </div>
        <a @click="OpenReg" class="login__reg-link">Регистрация</a>
    </form>
  </div>
  
</template>

<style lang="scss" scoped>
:focus::-webkit-input-placeholder {
  color: transparent
}

:focus::-moz-placeholder {
  color: transparent
}

:focus:-moz-placeholder {
  color: transparent
}

:focus:-ms-input-placeholder {
  color: transparent
}
::placeholder {
  color: #000;
  opacity: 1; /* Firefox */
}

.login {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  &__link {
    width: 100%;
    height: 100%;
    display: block;
    padding: 15px 29px;
  }
  &-title {
    position: absolute;
    top: 20px;
    display: flex;
    flex-direction: column;
    text-align: center;
    font-size: 20px;
    &__text {
      margin-bottom: 10px;
      font-size: 24px;
      font-weight: 600;
      color: #33bcfe;
    }
  }
  &__form {
    width: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 440px;
    position: relative;
    background: #fff;
    border-radius: 15px;
    border: 2px solid #b5b5b5;
    
  }
  &-input {
    width: 300px;
    margin-bottom: 15px;
    &__main {
      height: 40px;
      width: 100%;
      border-bottom: 1px solid #000;
      color: #000;
      &:focus {
        font-weight: 600;
      }
    }
  }
  &__button {
    margin-top: 15px;
  }
  &-button {
    border-radius: 45px;
    background: #33bcfe;
    color: rgb(17, 27, 33);
    font-size: 16px;
    font-weight: 600;
    line-height: 16px;
    &:hover {
      box-shadow: 0px 1px 10px 1px gray;
      background: #33bcfe;
    }
  }
  &__reg-link {
    position: absolute;
    bottom: 25px;
    color: gray;
    cursor: pointer;
    &:hover {
      color: #33bcfe;
    }
  }
}


  label.input{
    float: left;
    width: 300px;
    height: 42px;
    margin: 20px 0 0 0;
    position: relative;
    clear: both;
    span{
      width: 100%;
      height: 40px;
      line-height: 40px;
      position: absolute;
      left: 0;
      cursor: text;
      span{
        position: absolute;
        top: 0;
        z-index: 1;
        font-size: 16px;
        color: #fff;
        text-indent: 10px;
        transition: 0.3s;
        -webkit-transition: 0.3s;
        -moz-transition: 0.3s;
      }
    }
  }

  input{
    float: left;
    width: 460px;
    height: 40px;
    padding: 0 10px;
    border: 0;
    background-color: transparent;
    color: #fff;
    font-size: 16px;
    position: relative;
    z-index: 99;
    &:focus{
      outline: 0;
    }
    &.white{
      background-color: #E74C3C;
    }
  }

  input:focus + span{
    span{
      cursor: initial;
      position: absolute;
      top: -25px;
      color: #000;
    }
  }

</style>
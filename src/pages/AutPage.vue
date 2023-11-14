<script setup>
import { ref } from 'vue';
import Login from '../components/Login.vue'
import Reg from '../components/Reg.vue'

const OpenReg = ref(false);

const Open = (e) => {
  OpenReg.value = e.value
}
</script>

<template>
<div class="container">
  <div v-if="OpenReg === false" class="login">
    <Login @OpenReg="Open"/>
  </div>
  <div v-if="OpenReg === true" class="Reg">
    <Reg @CloseReg="Open"/>
  </div>
</div>
  
</template>

<style lang="scss" scoped>
.container {

  position: fixed;
  min-width: 100%;
  min-height: 100%;
}
.login .Reg {
  width: 100%;
}
</style>



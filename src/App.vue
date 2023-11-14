<script setup>
import MainPage from './pages/MainPage.vue'
</script>

<template>
<div class="main-app"> 
  <router-view></router-view>
</div>

  
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz@9..144&family=Open+Sans:wght@300;400;500;600;700&family=Roboto&family=Space+Grotesk&display=swap');

*  {
    font-family: 'Open Sans', sans-serif;
}

body {
    min-height: 100%;
    min-width: 100%;
    background: #fff 100%;
    display: flex;
}

.main-app {
  width: 100%;
  height: 100%;
}
</style>
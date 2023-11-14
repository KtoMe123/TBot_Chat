import {createRouter, createWebHistory} from "vue-router"
import Main from '../pages/MainPage.vue'
import Aut from '../pages/AutPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
      {
          path: '/:id',
          name: 'Main',
          component: Main,
          props: true,
          
      },
      {
          path: '/',
          name: 'Aut',
          component: Aut
      },
      
  ]
})

export default router;
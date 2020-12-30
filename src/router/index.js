import { createRouter, createWebHistory } from '@ionic/vue-router';
import Store from '../store';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    /* beforeEnter: (to, from, next) => {
      if(this.$store.getters.isLoggedIn) {
        next({ name: 'visualization' })
      } else {
        next()
      }
    } */
  },
  {
    path: '/visualization',
    name: 'visualization',
    component: () => import('../views/VisualizationView.vue'),
    beforeEnter: (to, from, next) => {
      if(Store.state.isLoggedIn) {
        next()
      } else {
        next({ name: 'login' })
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

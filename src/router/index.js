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
  },
  {
    path: '/workouts',
    name: 'workouts',
    component: () => import('../views/WorkoutListView.vue'),
    beforeEnter: (to, from, next) => {
      if(Store.state.isLoggedIn) {
        next()
      } else {
        next({ name: 'login' })
      }
    }
  },
  {
    path: '/visualization/:id',
    name: 'visualization',
    component: () => import('../views/VisualizationView.vue'),
    beforeEnter: (to, from, next) => {
      if(Store.state.isLoggedIn) {
        next()
      } else {
        next({ name: 'login' })
      }
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

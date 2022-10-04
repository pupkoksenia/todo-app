import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/loader',
    component: () => import('../components/LoaderPage.vue'),
  },
  {
    path: '/authentification',
    children: [
      {
        path: '/sign-in',
        component: () => import('../components/SignInFormPage.vue'),
      },
      {
        path: '/register',
        component: () => import('../components/RegisterFormPage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

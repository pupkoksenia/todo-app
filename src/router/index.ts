import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [{ path: '/board/:id', component: () => import('../components/NotFoundPage.vue') }],
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
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../components/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useFireBase } from '../composables/useFireBase'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { auth: true },
  },
  {
    path: '/loader',
    component: () => import('../pages/LoaderPage.vue'),
  },
  {
    path: '/authentification',
    children: [
      {
        path: '/sign-in',
        component: () => import('../pages/SignInFormPage.vue'),
      },
      {
        path: '/register',
        component: () => import('../pages/RegisterFormPage.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../pages/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const requireAuth = to.matched.some((record) => record.meta.auth)
  const { state } = useFireBase()

  if (requireAuth && !state.user.isAuthenticated) next({ path: '/sign-in' })
  else next()
})

export default router

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

router.beforeEach((to, from, next) => {
  const requireAuth = to.matched.some((record) => record.meta.auth)
  const { state } = useFireBase()

  if (requireAuth && !state.user.isAuth) next({ path: '/sign-in' })
  else next()
})

export default router

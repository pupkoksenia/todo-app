import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useFireBase } from '../composables/useFireBase'
import LoaderPage from '../pages/LoaderPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { auth: true },
  },
  {
    path: '/board/:id',
    name: 'board',
    props: true,
    component: () => import('../components/Board.vue'),
    meta: { auth: true },
  },

  {
    path: '/board/create-board',
    name: 'new-board',
    component: () => import('../pages/CreateBoardPage.vue'),
    meta: { auth: true },
  },
  {
    path: '/loader',
    name: 'loader',
    component: LoaderPage,
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
  const { state } = useFireBase()
  const requireAuth = to.meta.auth
  if (requireAuth && !state.user.isAuthenticated) next({ path: '/sign-in' })
  else next()
})

export default router

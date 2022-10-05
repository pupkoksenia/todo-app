import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { createFirebaseConfig } from './composables/createFireBaseConfig'
import { useFireBase } from '../src/composables/useFireBase'
import '../src/assets/app.css'

createApp(App).use(router).mount('#app')

const { firebaseConfig } = createFirebaseConfig()

const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore(firebaseApp)
router.push('/loader').finally(() => {
  useFireBase()
    .checkIsAuth()
    .then((path) => {
      router.push(path)
    })
})

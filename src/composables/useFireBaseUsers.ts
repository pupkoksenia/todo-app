import { reactive, DeepReadonly, readonly } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../main'

export interface User {
  uid: string
  email: string
}

interface Users {
  data: User[]
}
const users = reactive<Users>({
  data: [],
})

export interface fireBaseUsers {
  users: DeepReadonly<typeof users>
  getUsers: () => Promise<void>
}

export const useFireBaseUsers: () => fireBaseUsers = () => {
  const getUsers = () =>
    getDocs(collection(db, 'users')).then((usersDb) => {
      users.data = []
      usersDb.forEach((userDb) => {
        users.data.push({ uid: userDb.data().uid, email: userDb.data().email })
      })
    })

  return { users: readonly(users), getUsers }
}

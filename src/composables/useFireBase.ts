import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import { collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '../main'
import { readonly, reactive, DeepReadonly } from 'vue'

import {
  AUTH_SUCCESS,
  INVALID_EMAIL,
  ACCOUNT_NOT_FOUND,
  INCORRECT_PASSWORD,
  INCORRECT_PASSWORD_EMAIL,
} from '../constants/index'

export interface State {
  user: {
    email: string | null
    uid: string
    isAuthenticated: boolean
    name: string
    surname: string
  }
}

export const state = reactive<State>({
  user: {
    email: '',
    uid: '',
    isAuthenticated: false,
    name: '',
    surname: '',
  },
})

export interface FireBase {
  state: DeepReadonly<typeof state>
  signInEmailAndPasswordFirebase: (payload: { email: string; password: string }) => Promise<string>
  signInGoogleFirebase: () => Promise<string>
  registerEmailAndPasswordFirebase: (payload: {
    email: string
    password: string
    userName: string
    userSurname: string
  }) => Promise<string | undefined>
  checkIsAuth: (locationPathname: string) => Promise<{
    path: string
  }>
  //checkIsAuth: () => Promise<void>
  getNameAndSurname: (id: string) => void
  signOutFirebase: () => void
  registerGoogleFirebase: () => Promise<string>
}

export const useFireBase: () => FireBase = () => {
  const auth = getAuth()
  const provider = new GoogleAuthProvider()

  const signInEmailAndPasswordFirebase = (payload: { email: string; password: string }) =>
    signInWithEmailAndPassword(auth, payload.email, payload.password)
      .then((userCredential) => {
        state.user.email = userCredential.user.email
        state.user.uid = userCredential.user.uid
        state.user.isAuthenticated = true
        getNameAndSurname(state.user.uid)
        return AUTH_SUCCESS
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            return INVALID_EMAIL
          case 'auth/user-not-found':
            return ACCOUNT_NOT_FOUND
          case 'auth/wrong-password':
            return INCORRECT_PASSWORD
          default:
            return INCORRECT_PASSWORD_EMAIL
        }
      })

  const signInGoogleFirebase = () =>
    signInWithPopup(auth, provider)
      .then((result) => {
        state.user.email = result.user.email
        state.user.uid = result.user.uid
        state.user.isAuthenticated = true
        getNameAndSurname(state.user.uid)
        return AUTH_SUCCESS
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            return INVALID_EMAIL
          case 'auth/user-not-found':
            return ACCOUNT_NOT_FOUND
          case 'auth/wrong-password':
            return INCORRECT_PASSWORD
          default:
            return INCORRECT_PASSWORD_EMAIL
        }
      })

  const registerEmailAndPasswordFirebase = (payload: {
    email: string
    password: string
    userName: string
    userSurname: string
  }) =>
    createUserWithEmailAndPassword(auth, payload.email, payload.password)
      .then((userCredential) => {
        state.user.email = userCredential.user.email
        state.user.uid = userCredential.user.uid
        state.user.isAuthenticated = true
        state.user.name = payload.userName
        state.user.surname = payload.userSurname

        const id = userCredential.user.uid

        getDocs(collection(db, 'users')).then(() => {
          setDoc(
            doc(db, 'users', id),
            {
              email: userCredential.user.email,
              role: 'admin',
              name: payload.userName,
              surname: payload.userSurname,
            },
            { merge: true }
          )
        })
        return AUTH_SUCCESS
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            return INVALID_EMAIL
        }
      })

  const registerGoogleFirebase = () =>
    signInWithPopup(auth, provider)
      .then((result) => {
        state.user.email = result.user.email
        state.user.uid = result.user.uid
        state.user.isAuthenticated = true

        if (result.user.displayName) {
          const resultNameAndSurname = result.user.displayName?.split(' ')
          state.user.name = resultNameAndSurname[0]
          state.user.surname = resultNameAndSurname[1]
        }

        const id = result.user.uid

        getDocs(collection(db, 'users')).then(() => {
          setDoc(
            doc(db, 'users', id),
            {
              email: result.user.email,
              role: 'admin',
              name: state.user.name,
              surname: state.user.surname,
            },
            { merge: true }
          )
        })
        return AUTH_SUCCESS
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            return INVALID_EMAIL
          case 'auth/user-not-found':
            return ACCOUNT_NOT_FOUND
          case 'auth/wrong-password':
            return INCORRECT_PASSWORD
          default:
            return INCORRECT_PASSWORD_EMAIL
        }
      })

  const checkIsAuth = (locationPathname: string) =>
    new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          state.user.email = user.email
          state.user.uid = user.uid
          state.user.isAuthenticated = true
          getNameAndSurname(state.user.uid)
          resolve(state.user.isAuthenticated)
        } else reject(state.user.isAuthenticated)
      })
    })
      .then(() => {
        return { path: locationPathname }
      })
      .catch(() => {
        return { path: '/sign-in' }
      })

  const getNameAndSurname = (id: string) => {
    getDoc(doc(db, 'users', id)).then((data) => {
      if (data.exists()) {
        state.user.name = data.data().name
        state.user.surname = data.data().surname
      }
    })
  }

  const signOutFirebase = () => {
    signOut(auth).then(() => {
      state.user.email = ''
      state.user.uid = ''
      state.user.isAuthenticated = false
      state.user.name = ''
      state.user.surname = ''
    })
  }

  return {
    state: readonly(state),
    signInEmailAndPasswordFirebase,
    signInGoogleFirebase,
    registerEmailAndPasswordFirebase,
    checkIsAuth,
    getNameAndSurname,
    signOutFirebase,
    registerGoogleFirebase,
  }
}

import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'
import { collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '../main'
import { readonly, reactive, DeepReadonly } from 'vue'
import { State } from '../types/index'

const state = reactive<State>({
  user: {
    email: '',
    uid: '',
    isSignIn: false,
    name: '',
    surname: '',
  },
})

export interface FireBase {
  state: DeepReadonly<typeof state>
  signInEmailAndPasswordFirebase: (email: string, password: string) => Promise<string>
  signInGoogleFirebase: () => Promise<string>
  registerEmailAndPassword: (
    email: string,
    password: string,
    userName: string,
    userSurname: string
  ) => Promise<string | undefined>
  checkIsSignIn: () => Promise<{
    path: string
  }>
  getNameAndSurname: (id: string) => void
}

export const useFireBase: () => FireBase = () => {
  const auth = getAuth()
  const provider = new GoogleAuthProvider()

  const signInEmailAndPasswordFirebase = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        state.user.email = userCredential.user.email
        state.user.uid = userCredential.user.uid
        state.user.isSignIn = true
        getNameAndSurname(state.user.uid)
        return 'ok'
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            return 'Invalid email'
          case 'auth/user-not-found':
            return 'No account with that email was found'
          case 'auth/wrong-password':
            return 'Incorrect password'
          default:
            return 'Email or password was incorrect'
        }
      })

  const signInGoogleFirebase = () =>
    signInWithPopup(auth, provider)
      .then((result) => {
        state.user.email = result.user.email
        state.user.uid = result.user.uid
        state.user.isSignIn = true
        getNameAndSurname(state.user.uid)
        return 'ok'
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            return 'Invalid email'
          case 'auth/user-not-found':
            return 'No account with that email was found'
          case 'auth/wrong-password':
            return 'Incorrect password'
          default:
            return 'Email or password was incorrect'
        }
      })

  const registerEmailAndPassword = (email: string, password: string, userName: string, userSurname: string) =>
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        state.user.email = userCredential.user.email
        state.user.uid = userCredential.user.uid
        state.user.isSignIn = true
        state.user.name = userName
        state.user.surname = userSurname

        const id = userCredential.user.uid

        getDocs(collection(db, 'users')).then(() => {
          setDoc(
            doc(db, 'users', id),
            {
              email: userCredential.user.email,
              role: 'admin',
              name: userName,
              surname: userSurname,
            },
            { merge: true }
          )
        })
        return 'ok'
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            return 'Invalid email'
        }
      })

  const checkIsSignIn = () =>
    new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          state.user.email = user.email
          state.user.uid = user.uid
          state.user.isSignIn = true
          getNameAndSurname(state.user.uid)
          resolve(state.user.isSignIn)
        } else resolve(state.user.isSignIn)
      })
    }).then((result) => {
      if (result) return { path: '/' }
      else return { path: '/sign-in' }
    })

  const getNameAndSurname = (id: string) => {
    getDoc(doc(db, 'users', id)).then((data) => {
      if (data.exists()) {
        state.user.name = data.data().name
        state.user.surname = data.data().surname
      }
    })
  }

  return {
    state: readonly(state),
    signInEmailAndPasswordFirebase,
    signInGoogleFirebase,
    registerEmailAndPassword,
    checkIsSignIn,
    getNameAndSurname,
  }
}

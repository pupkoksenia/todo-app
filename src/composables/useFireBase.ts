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

export interface State {
  user: {
    email: string | null
    uid: string
    isAuth: boolean
    name: string
    surname: string
  }
}

const state = reactive<State>({
  user: {
    email: '',
    uid: '',
    isAuth: false,
    name: '',
    surname: '',
  },
})

export interface FireBase {
  state: DeepReadonly<typeof state>
  signInEmailAndPasswordFirebase: (email: string, password: string) => Promise<string>
  signInGoogleFirebase: () => Promise<string>
  registerEmailAndPasswordFirebase: (
    email: string,
    password: string,
    userName: string,
    userSurname: string
  ) => Promise<string | undefined>
  checkIsAuth: () => Promise<{
    path: string
  }>
  getNameAndSurname: (id: string) => void
  signOutFirebase: () => void
  registerGoogleFirebase: () => Promise<string>
}

export const useFireBase: () => FireBase = () => {
  const auth = getAuth()
  const provider = new GoogleAuthProvider()

  const signInEmailAndPasswordFirebase = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        state.user.email = userCredential.user.email
        state.user.uid = userCredential.user.uid
        state.user.isAuth = true
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
        state.user.isAuth = true
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

  const registerEmailAndPasswordFirebase = (email: string, password: string, userName: string, userSurname: string) =>
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        state.user.email = userCredential.user.email
        state.user.uid = userCredential.user.uid
        state.user.isAuth = true
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

  const registerGoogleFirebase = () =>
    signInWithPopup(auth, provider)
      .then((result) => {
        state.user.email = result.user.email
        state.user.uid = result.user.uid
        state.user.isAuth = true

        if (result.user.displayName) {
          const arrayOfNameandSurname = result.user.displayName?.split(' ')
          state.user.name = arrayOfNameandSurname[0]
          state.user.surname = arrayOfNameandSurname[1]
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

  const checkIsAuth = () =>
    new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          state.user.email = user.email
          state.user.uid = user.uid
          state.user.isAuth = true
          getNameAndSurname(state.user.uid)
          resolve(state.user.isAuth)
        } else reject(state.user.isAuth)
      })
    })
      .then(() => {
        return { path: '/' }
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
      state.user.isAuth = false
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

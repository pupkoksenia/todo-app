import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { readonly, reactive, DeepReadonly } from 'vue'
import { State } from '../types/index'

const state = reactive<State>({
  user: {
    email: '',
    uid: '',
  },
})

export interface FireBase {
  state: DeepReadonly<typeof state>
  signInEmailAndPassword: (email: string, password: string) => Promise<string>
  signInGoogle: () => Promise<string>
}

export const useFireBase: () => FireBase = () => {
  const auth = getAuth()
  const provider = new GoogleAuthProvider()

  const signInEmailAndPassword = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        state.user.email = userCredential.user.email
        state.user.uid = userCredential.user.uid
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

  const signInGoogle = () =>
    signInWithPopup(auth, provider)
      .then((result) => {
        state.user.email = result.user.email
        state.user.email = result.user.uid
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

  return {
    state: readonly(state),
    signInEmailAndPassword,
    signInGoogle,
  }
}

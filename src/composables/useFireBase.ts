import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
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
  signIn: (email: string, password: string) => Promise<string>
}

export const useFireBase: () => FireBase = () => {
  const auth = getAuth()

  const signIn = (email: string, password: string) =>
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

  return {
    state: readonly(state),
    signIn,
  }
}

<template>
  <div class="view-auth">
    <div class="view-form">
      <h1 class="text-center text-3xl">To-do app</h1>
      <div class="flex flex-col space-y-2">
        <label class="text-sm font-light" for="email">Email</label>
        <input class="email-form" placeholder="Your Email" v-model="form.email" />
      </div>
      <div class="flex flex-col space-y-2">
        <label class="text-sm font-light" for="password">Password</label>
        <input type="password" class="password-form" v-model="form.password" placeholder="Your Password" />
      </div>
      <button class="button-auth" @click="signInByEmailAndPassword">Sign In</button>
      <button class="button-auth" @click="signInByGoogleAccount">Sign in by Google</button>
      <p v-if="errMsg">{{ errMsg }}</p>
      <div @click="redirectToRegister" class="text-blue-600 cursor-pointer">Don't have an account? Register!</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFireBase } from '../composables/useFireBase'
import { AUTH_SUCCESS } from '../constants/index'
export default defineComponent({
  name: 'SignInForm',
  setup() {
    const { signInEmailAndPasswordFirebase, signInGoogleFirebase } = useFireBase()
    const form = ref({
      email: '',
      password: '',
    })
    const errMsg = ref()
    const router = useRouter()

    const signInByEmailAndPassword = () => {
      const payload = {
        email: form.value.email,
        password: form.value.password,
      }
      signInEmailAndPasswordFirebase(payload).then((msg) => {
        if (msg === AUTH_SUCCESS) {
          router.push('/')
        } else errMsg.value = msg
      })
    }

    const signInByGoogleAccount = () => {
      signInGoogleFirebase().then((msg) => {
        if (msg === AUTH_SUCCESS) {
          router.push('/')
        } else errMsg.value = msg
      })
    }

    const redirectToRegister = () => {
      router.push('/register')
    }
    return {
      form,
      signInByEmailAndPassword,
      errMsg,
      redirectToRegister,
      signInByGoogleAccount,
    }
  },
})
</script>

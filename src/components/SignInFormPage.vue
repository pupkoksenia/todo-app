<template>
  <div class="view-sign-in-register">
    <div class="view-form">
      <h1 class="text-center text-3xl dark:text-white">Todo app</h1>
      <div class="flex flex-col space-y-2">
        <label class="text-sm font-light dark:text-white" for="email">Email</label>
        <input class="email-form" placeholder="Your Email" v-model="form.email" />
      </div>
      <div class="flex flex-col space-y-2">
        <label class="text-sm font-light dark:text-white" for="password">Password</label>
        <input type="password" class="password-form" v-model="form.password" placeholder="Your Password" />
      </div>
      <button class="button-send-info" @click="sendInfo">Sign In</button>
      <button class="button-send-info" @click="redirectToGoogleSignIn">Sign In by Google</button>
      <p v-if="errMsg" class="dark:text-white">{{ errMsg }}</p>
      <!--div @click="redirectToRegister" class="text-blue-600 cursor-pointer dark:text-white">
        Don't have an account? Register!
      </div-->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFireBase } from '../composables/useFireBase'

export default defineComponent({
  name: 'SignInForm',
  setup() {
    const { signInEmailAndPassword, signInGoogle } = useFireBase()
    const form = ref({
      email: '',
      password: '',
    })
    const errMsg = ref()
    const router = useRouter()
    const passwordFieldType = ref('password')

    const sendInfo = () => {
      signInEmailAndPassword(form.value.email, form.value.password).then((msg) => {
        if (msg === 'ok') {
          router.push('/')
        } else errMsg.value = msg
      })
    }

    const redirectToGoogleSignIn = () => {
      signInGoogle().then((msg) => {
        if (msg === 'ok') {
          router.push('/')
        } else errMsg.value = msg
      })
    }

    const redirectToRegister = () => {
      router.push('/register')
    }
    return {
      form,
      sendInfo,
      errMsg,
      passwordFieldType,
      redirectToRegister,
      redirectToGoogleSignIn,
    }
  },
})
</script>

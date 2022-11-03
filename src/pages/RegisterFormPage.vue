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
      <div class="flex flex-col space-y-2">
        <label class="text-sm font-light" for="name">Name</label>
        <input type="text" class="email-form" v-model="form.name" placeholder="Your Name" />
      </div>
      <div class="flex flex-col space-y-2">
        <label class="text-sm font-light" for="surname">Surname</label>
        <input type="text" class="email-form" v-model="form.surname" placeholder="Your Surname" />
      </div>
      <button class="button-auth" @click="registerByEmailPassword">Register</button>
      <button class="button-auth" @click="registerByGoogleAccount">Register by Google</button>
      <p v-if="errMsg">{{ errMsg }}</p>
      <div @click="redirectToSignIn" class="text-blue-600 cursor-pointer">Already have an account? Sign-in!</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFireBase } from '../composables/useFireBase'
import { AUTH_SUCCESS } from '../constants/index'
export default defineComponent({
  name: 'RegisterPage',
  setup() {
    const { registerEmailAndPasswordFirebase, registerGoogleFirebase } = useFireBase()
    const form = ref({
      email: '',
      password: '',
      name: '',
      surname: '',
    })
    const errMsg = ref()
    const router = useRouter()

    const registerByEmailPassword = () => {
      const payload = {
        email: form.value.email,
        password: form.value.password,
        userName: form.value.name,
        userSurname: form.value.surname,
      }
      registerEmailAndPasswordFirebase(payload).then((msg) => {
        if (msg === AUTH_SUCCESS) {
          router.push({ path: '/' })
        } else errMsg.value = msg
      })
    }
    const registerByGoogleAccount = () => {
      registerGoogleFirebase().then((msg) => {
        if (msg === AUTH_SUCCESS) {
          router.push({ path: '/' })
        } else errMsg.value = msg
      })
    }
    const redirectToSignIn = () => {
      router.push('/sign-in')
    }
    return { form, registerByEmailPassword, errMsg, redirectToSignIn, registerByGoogleAccount }
  },
})
</script>

<template>
  <div class="view-sign-in-register">
    <div class="view-form">
      <h1 class="text-center text-3xl dark:text-white">To-do app</h1>
      <div class="flex flex-col space-y-2">
        <label class="text-sm font-light dark:text-white" for="email">Email</label>
        <input class="email-form" placeholder="Your Email" v-model="form.email" />
      </div>
      <div class="flex flex-col space-y-2">
        <label class="text-sm font-light dark:text-white" for="password">Password</label>
        <input type="password" class="password-form" v-model="form.password" placeholder="Your Password" />
      </div>
      <div class="flex flex-col space-y-2">
        <label class="text-sm font-light dark:text-white" for="name">Name</label>
        <input type="text" class="email-form" v-model="form.name" placeholder="Your Name" />
      </div>
      <div class="flex flex-col space-y-2">
        <label class="text-sm font-light dark:text-white" for="surname">Surname</label>
        <input type="text" class="email-form" v-model="form.surname" placeholder="Your Surname" />
      </div>
      <button class="button-send-info" @click="sendEmailAndPasswordOnFirebase">Register</button>
      <button class="button-send-info" @click="redirectToGoogleRegister">Register by Google</button>
      <p v-if="errMsg" class="dark:text-white">{{ errMsg }}</p>
      <div @click="redirectToSignIn" class="text-blue-600 cursor-pointer dark:text-white">
        Already have an account? Sign-in!
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFireBase } from '../composables/useFireBase'
export default defineComponent({
  name: 'RegisterForm',
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
    const sendEmailAndPasswordOnFirebase = () => {
      registerEmailAndPasswordFirebase(form.value.email, form.value.password, form.value.name, form.value.surname).then(
        (msg) => {
          if (msg === 'ok') {
            router.push({ path: '/' })
          } else errMsg.value = msg
        }
      )
    }
    const redirectToGoogleRegister = () => {
      registerGoogleFirebase().then((msg) => {
        if (msg === 'ok') {
          router.push({ path: '/' })
        } else errMsg.value = msg
      })
    }
    const redirectToSignIn = () => {
      router.push('/sign-in')
    }
    return { form, sendEmailAndPasswordOnFirebase, errMsg, redirectToSignIn, redirectToGoogleRegister }
  },
})
</script>

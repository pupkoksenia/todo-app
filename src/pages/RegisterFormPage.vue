<template>
  <section class="bg-white">
    <div class="lg:grid lg:min-h-screen lg:grid-cols-12">
      <section class="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
        <img
          alt="Night"
          src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          class="absolute inset-0 h-full w-full object-cover opacity-80"
        />

        <div class="hidden lg:relative lg:block lg:p-12">
          <h2 class="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">Welcome! 🦑</h2>

          <p class="mt-4 leading-relaxed text-white/90">App to create your daily plans.</p>
        </div>
      </section>

      <main
        aria-label="Main"
        class="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:py-12 lg:px-16 xl:col-span-6"
      >
        <div class="max-w-xl lg:max-w-3xl">
          <form action="#" class="mt-8 grid grid-cols-6 gap-6">
            <div class="col-span-6 sm:col-span-6">
              <label for="FirstName" class="block text-sm font-medium text-gray-700"> First Name </label>
              <input type="text" class="email-form" v-model="form.name" />
            </div>

            <div class="col-span-6 sm:col-span-6">
              <label for="LastName" class="block text-sm font-medium text-gray-700"> Last Name </label>
              <input type="text" class="email-form" v-model="form.surname" />
            </div>

            <div class="col-span-6">
              <label for="Email" class="block text-sm font-medium text-gray-700"> Email </label>
              <input class="email-form" v-model="form.email" />
            </div>

            <div class="col-span-6 sm:col-span-6">
              <label for="Password" class="block text-sm font-medium text-gray-700"> Password </label>
              <input type="password" class="password-form" v-model="form.password" />
            </div>

            <div class="col-span-6 sm:flex sm:items-center sm:gap-4">
              <button
                class="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                @click="registerByEmailPassword"
              >
                Register
              </button>

              <button
                class="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                @click="registerByGoogleAccount"
              >
                Register by Google
              </button>
              <p class="mt-4 text-sm text-gray-500 sm:mt-0" v-if="errMsg">{{ errMsg }}</p>

              <div @click="redirectToSignIn" class="text-blue-600 cursor-pointer col-span-6 sm:col-span-6">
                Already have an account? Sign-in!
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  </section>
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

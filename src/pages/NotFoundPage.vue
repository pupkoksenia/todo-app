<template>
  <div class="view-not-frond-page">
    <div class="inset-0 bg-black opacity-25 absolute"></div>
    <div class="container-not-found-page">
      <div class="w-full font-mono flex flex-col items-center relative z-10">
        <h1>We are all alone here</h1>
        <button class="button-go-home-not-found-page" @click="goToHomePage">Go Home</button>
        <p class="font-extrabold text-8xl my-44 text-white animate-bounce">404</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useFireBase } from '../composables/useFireBase'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'NotFound',
  setup() {
    const router = useRouter()
    const { state } = useFireBase()
    const goToHomePage = () => {
      if (state.user.email !== '') router.push('/')
      else router.push('/sign-in')
    }
    return { goToHomePage }
  },
})
</script>

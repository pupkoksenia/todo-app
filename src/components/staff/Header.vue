<template>
  <div class="grid grid-cols-8 w-screen h-16">
    <div class="col-span-1 justify-items-end"></div>
    <div class="flex items-center justify-start col-span-3 text-black font-bold">To-do app</div>

    <button class="flex items-center justify-center col-span-2 text-cyan-700 font-bold" @click="logOut">Log Out</button>
    <div class="col-span-1 flex items-center justify-items-center">
      <img src="../../assets/profile.jpg" class="h-8 w-8" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useFireBase } from '@/composables/useFireBase'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'HeaderPart',
  setup() {
    const { signOutFirebase } = useFireBase()
    const router = useRouter()
    const logOut = () => {
      signOutFirebase()
      router.push({ path: '/sign-in' })
    }
    return { logOut }
  },
})
</script>

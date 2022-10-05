<template>
  <div class="grid grid-cols-8 w-screen h-16">
    <div class="col-span-1 justify-items-end"></div>
    <div class="flex items-center justify-start col-span-3 text-black font-bold">To-do app</div>

    <button class="flex items-center justify-center col-span-2 text-sky-500 font-medium" @click="logOut">
      Log Out
    </button>
    <div class="col-span-1 flex items-center justify-items-center">
      <img src="../assets/profile.jpg" class="h-8 w-8" @click="openModalWindow" />
    </div>
    <ModalWindow :isOpen="modalWindowIsOpen" @closeModalWindow="closeModalWindow">
      <template #body>
        <div class="grid-cols-1 grid-rows-2">
          <div class="text-sm">Email: {{ state.user.email }}</div>
          <div class="text-sm">Name: {{ state.user.name }}</div>
          <div class="text-sm">Surname: {{ state.user.surname }}</div>
        </div>
      </template>
    </ModalWindow>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useFireBase } from '@/composables/useFireBase'
import { useRouter } from 'vue-router'
import ModalWindow from './ModalWindow.vue'
export default defineComponent({
  name: 'HeaderElement',
  components: {
    ModalWindow,
  },
  setup() {
    const { logOutFirebase, state } = useFireBase()
    const router = useRouter()
    const modalWindowIsOpen = ref()
    const logOut = () => {
      logOutFirebase()
      router.push({ path: '/sign-in' })
    }
    onMounted(() => (modalWindowIsOpen.value = false))
    const openModalWindow = () => {
      modalWindowIsOpen.value = true
    }
    const closeModalWindow = () => {
      modalWindowIsOpen.value = false
    }
    return { logOut, openModalWindow, modalWindowIsOpen, closeModalWindow, state }
  },
})
</script>

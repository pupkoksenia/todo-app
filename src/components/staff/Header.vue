<template>
  <div class="grid grid-cols-8 w-screen h-16">
    <div class="col-span-1 justify-items-end"></div>
    <div class="flex items-center justify-start col-span-3 text-black font-bold">To-do app</div>

    <button class="flex items-center justify-center col-span-2 text-cyan-700 font-bold" @click="logOut">Log Out</button>
    <div class="col-span-1 flex items-center justify-items-center">
      <img src="../../assets/profile.jpg" class="h-8 w-8" @click="openModalWindow" />
    </div>
    <ModalWindow
      :isOpenModalWindow="isOpenModalWindow"
      @isOpenModalWindow="(isOpened) => setOpenModalWindowValue(isOpened)"
    >
      <template #body>
        <div class="grid-cols-1 grid-rows-2">
          <div class="text-sm dark:text-white">Email: {{ state.user.email }}</div>
          <div class="text-sm dark:text-white">Name: {{ state.user.name }}</div>
          <div class="text-sm dark:text-white">Surname: {{ state.user.surname }}</div>
        </div>
      </template>
    </ModalWindow>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useFireBase } from '@/composables/useFireBase'
import { useRouter } from 'vue-router'
import ModalWindow from '../staff/ModalWindow.vue'
export default defineComponent({
  name: 'HeaderPart',
  components: {
    ModalWindow,
  },
  setup() {
    const { signOutFirebase, state } = useFireBase()
    const router = useRouter()
    const isOpenModalWindow = ref()
    const logOut = () => {
      signOutFirebase()
      router.push({ path: '/sign-in' })
    }
    onMounted(() => (isOpenModalWindow.value = false))
    const openModalWindow = () => {
      isOpenModalWindow.value = true
    }
    const setOpenModalWindowValue = (isOpened: boolean) => {
      isOpenModalWindow.value = isOpened
    }
    return { logOut, openModalWindow, isOpenModalWindow, setOpenModalWindowValue, state }
  },
})
</script>

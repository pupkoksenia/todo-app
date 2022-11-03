<template>
  <div class="mx-auto max-w-screen-xl px-4 sm:py-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div class="text-center sm:text-left">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Welcome Back, {{ state.user.name }}!</h1>

        <p class="mt-1.5 text-sm text-gray-500">Let's check your boards! 🎉</p>
      </div>

      <div class="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
        <button @click="handleSignOut" class="header-button-sign-in" type="button">
          <span class="text-sm font-medium"> Sign Out </span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ml-1.5 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </button>

        <button @click="openModalWindow" class="header-button-account" type="button">Your account</button>
        <ModalWindow :isOpen="modalWindowIsOpen" @closeModalWindow="closeModalWindow">
          <template #body>
            <div class="grid-cols-1 grid-rows-2">
              <div class="text-sm">email: {{ state.user.email }}</div>
              <div class="text-sm">name: {{ state.user.name }}</div>
              <div class="text-sm">surname: {{ state.user.surname }}</div>
            </div>
          </template>
        </ModalWindow>
      </div>
    </div>
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
    const { signOutFirebase, state } = useFireBase()
    const router = useRouter()
    const modalWindowIsOpen = ref()
    const handleSignOut = () => {
      signOutFirebase()
      router.push({ path: '/sign-in' })
    }
    onMounted(() => (modalWindowIsOpen.value = false))
    const openModalWindow = () => {
      modalWindowIsOpen.value = true
    }
    const closeModalWindow = () => {
      modalWindowIsOpen.value = false
    }
    return { handleSignOut, openModalWindow, modalWindowIsOpen, closeModalWindow, state }
  },
})
</script>

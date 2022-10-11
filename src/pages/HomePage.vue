<template>
  <Loader :isLoading="loadingListener" />
  <router-link
    :to="{ path: '/board/' + userBoard.idBoard }"
    class="relative block rounded-xl border border-gray-100 p-8 shadow-xl"
    v-for="userBoard in userBoards"
    :key="userBoard.idBoard"
  >
    <div class="mt-4 text-gray-500 sm:pr-8">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-10 w-10 text-pink-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>

      <h5 class="mt-4 text-xl font-bold text-gray-900">{{ userBoard.board.name }}</h5>
      <p class="mt-2 hidden text-sm sm:block">{{ userBoard.board.description }}</p>
    </div>
  </router-link>
  <div class="absolute bottom-12 right-40">
    <button class="button-create-new-board col-span-6" @click="createNewBoard">+</button>
  </div>
  <ModalWindow :isOpen="modalWindowIsOpen" @closeModalWindow="closeModalWindow">
    <template #body>
      <input
        type="text"
        class="rounded-lg p-1 text-xl mb-2 font-bold text-gray-900 shadow-sm"
        placeholder="name of board"
        v-model="form.name"
      />
      <input
        type="text"
        class="rounded-lg p-1 hidden text-sm sm:block text-gray-900 shadow-sm"
        placeholder="write description"
        v-model="form.description"
      />
    </template>
    <template #footer>
      <button class="header-button-sign-in m-2" type="button" @click="sendBoardInfo">
        <span class="text-sm font-medium"> Save </span>
      </button>
    </template>
  </ModalWindow>
</template>

<script lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFireBaseBoards } from '@/composables/useFireBaseBoards'
import Loader from '../components/Loader.vue'
import ModalWindow from '../components/ModalWindow.vue'

export default {
  name: 'HomePage',
  components: {
    Loader,
    ModalWindow,
  },
  setup() {
    const { boards, getUserBoards, createUserBoard } = useFireBaseBoards()
    const loadingListener = ref()
    const modalWindowIsOpen = ref()
    const form = ref({
      name: '',
      description: '',
    })

    onMounted(() => {
      modalWindowIsOpen.value = false
      loadingListener.value = true
      getUserBoards().then(() => (loadingListener.value = false))
    })
    const userBoards = computed(() => boards.userDataBoards)
    const createNewBoard = () => {
      modalWindowIsOpen.value = true
    }
    const closeModalWindow = () => {
      modalWindowIsOpen.value = false
    }

    const sendBoardInfo = () => {
      createUserBoard(form)
    }

    return {
      userBoards,
      loadingListener,
      createNewBoard,
      modalWindowIsOpen,
      closeModalWindow,
      form,
    }
  },
}
</script>

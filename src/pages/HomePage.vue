<template>
  <div id="board">
    <Loader :isLoading="loadingListener" />
    <div
      @click="goToBoard(userBoard.idBoard.toString())"
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
    </div>
    <div class="absolute bottom-12 right-40">
      <button class="button-create-new-board col-span-6" @click="createNewBoard">+</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFireBaseBoards } from '@/composables/useFireBaseBoards'
import Loader from '../components/Loader.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'HomePage',
  components: {
    Loader,
  },
  setup() {
    const { boards, getUserBoards } = useFireBaseBoards()
    const loadingListener = ref()
    const router = useRouter()

    onMounted(() => {
      loadingListener.value = true
      getUserBoards().then(() => (loadingListener.value = false))
    })
    const userBoards = computed(() => boards.userDataBoards)
    const createNewBoard = () => {
      router.push('board/create-board')
    }

    const goToBoard = (userBoardId: string) => {
      router.push(`/board/${userBoardId}`)
    }

    return {
      userBoards,
      loadingListener,
      createNewBoard,
      goToBoard,
    }
  },
}
</script>

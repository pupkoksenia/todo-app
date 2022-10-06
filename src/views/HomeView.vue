<template>
  <div>
    <Header />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Header from '../components/Header.vue'
import { useFireBaseBoards } from '@/composables/useFireBaseBoards'

export default defineComponent({
  name: 'HomeView',
  components: {
    Header,
  },
  setup() {
    const { getBoards, getUserBoards } = useFireBaseBoards()
    getBoards().then(() => getUserBoards.value)
  },
})
</script>

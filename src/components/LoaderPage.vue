<template>
  <div class="bg-gradient-to-t from-purple-900 dark:to-black w-screen max-h-fit min-h-screen justify-items-center">
    <Loader :isLoading="loadingListener" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import Loader from './staff/Loader.vue'
export default defineComponent({
  name: 'FeedUsers',
  setup() {
    const loadingListener = ref()
    onMounted(() => {
      loadingListener.value = true
    })
    return {
      loadingListener,
    }
  },
  components: { Loader },
})
</script>

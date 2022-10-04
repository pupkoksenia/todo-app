<template>
  <div class="loader-page">
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

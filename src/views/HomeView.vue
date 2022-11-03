<template>
  <div>
    <Header />
    <HomePage />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Header from '../components/Header.vue'
import HomePage from '@/pages/HomePage.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    Header,
    HomePage,
  },
})
</script>

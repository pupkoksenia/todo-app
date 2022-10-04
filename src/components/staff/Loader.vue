<template>
  <div v-show="isLoading" class="loader-ring"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'LoaderElement',
  props: {
    isLoading: Boolean,
  },
})
</script>

<style>
.loader-ring {
  margin-left: 45%;
  margin-top: 15%;
  width: 100wv;
  height: 100hv;
}
.loader-ring:after {
  content: '';
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #6366f1;
  border-color: #6366f1 transparent #6366f1 transparent;
  animation: loader-ring 1.2s linear infinite;
}
@keyframes loader-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

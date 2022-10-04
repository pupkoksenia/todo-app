<template>
  <div v-if="isLoading === true" class="lds-dual-ring"></div>
  <div v-else class="hidden"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'LoaderElement',
  props: {
    isLoading: Boolean,
  },
  setup(props) {
    return props.isLoading
  },
})
</script>

<style>
.lds-dual-ring {
  margin-left: 45%;
  margin-top: 15%;
  width: 100wv;
  height: 100hv;
}
.lds-dual-ring:after {
  content: '';
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #6366f1;
  border-color: #6366f1 transparent #6366f1 transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<template>
  <Teleport to="#app-body">
    <div v-show="isOpenModalWindow" class="modal-window-template" @click="$emit('isOpenModalWindow', false)">
      <div class="modal-window">
        <div class="modal-window-flex-items">
          <svg
            @click="$emit('isOpenModalWindow', false)"
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8 text-cyan-700 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <slot name="body"></slot>
        </div>

        <div>
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ModalWindow',
  props: {
    isOpenModalWindow: Boolean,
  },
  emits: ['isOpenModalWindow'],
})
</script>

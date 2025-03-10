<template>
    <transition name="fade">
      <div v-if="visible" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-xl shadow-md z-50">
        {{ message }}
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    message: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 3000,
    },
  })
  
  const visible = ref(true)
  
  watch(
    () => props.message,
    (newVal) => {
      if (newVal) {
        visible.value = true
        setTimeout(() => {
          visible.value = false
        }, props.duration)
      }
    },
    { immediate: true }
  )
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>
  
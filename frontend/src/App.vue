<script setup>
import { RouterView } from 'vue-router';
import Toast from '@/components/ToastComponent.vue'
import { useNotificationStore } from '@/stores/notificationStore'

const notification = useNotificationStore()
</script>

<template>
  <RouterView />
  <Transition name="fade">
  <Toast v-if="notification.message" :message="notification.message" />
  </Transition>
</template>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>

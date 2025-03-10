import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', () => {
  const message = ref('')

  function showNotification(msg, duration = 3000) {
    message.value = msg
    setTimeout(() => {
      message.value = ''
    }, duration)
  }

  return { message, showNotification }
})

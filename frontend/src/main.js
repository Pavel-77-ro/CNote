import './assets/main.css'
import clickOutside from './directives/v-click-outside'
import { useUserStore } from './stores/userStore'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('click-outside',clickOutside)

app.mount('#app')

const userStore = useUserStore()
if (localStorage.getItem('authToken')) {
  userStore.fetchProfile()
}
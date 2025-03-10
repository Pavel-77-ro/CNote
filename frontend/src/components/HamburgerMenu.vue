<script setup>
import { useUserStore } from '@/stores/userStore'
import { RouterLink } from 'vue-router'

const userStore = useUserStore()


function logout() {
  userStore.logout()
}
</script>

<template>
  <div
    class="
      h-svh w-[70svw]
      flex flex-col justify-between
      p-2
      absolute top-0 left-0 z-50
      bg-gray-50 font-Poppins
    "
  >

    <div class="flex flex-col gap-3 items-center">
      <RouterLink class="mt-8 flex gap-4 px-6 py-3 items-center text-lg" :to="{ name: 'home' }">
        <i class="pi pi-home text-slate-800"></i>
        <h3 class="font-3xl">Home</h3>
      </RouterLink>
      <hr class="w-5/6 rounded-xl border-slate-800 border-1" />

      <RouterLink class="flex gap-4 px-6 py-3 items-center text-lg" :to="{ name: 'about' }">
        <i class="pi pi-question-circle text-slate-800"></i>
        <h1>About</h1>
      </RouterLink>

      <hr class="w-5/6 rounded-xl border-slate-800 border-1" />

      <RouterLink
        v-if="userStore.isAuthenticated"
        class="flex gap-4 px-6 py-3 items-center text-lg"
        :to="{ name: 'dashboard' }"
      >
        <i class="pi pi-pen-to-square text-slate-800"></i>
        <h3 class="font-3xl">Dashboard</h3>
      </RouterLink>

      <RouterLink
        v-if="!userStore.isAuthenticated"
        class="flex gap-4 px-6 py-3 items-center text-lg"
        :to="{ name: 'login' }"
      >
        <i class="pi pi-sign-in text-slate-800"></i>
        <h1>Login</h1>
      </RouterLink>
    </div>

    <div v-if="userStore.isAuthenticated" class="flex justify-center w-full mt-4 mb-4">
      <button
        @click="logout"
        class="flex gap-4 px-8 py-3 items-center text-lg bg-red-500 text-white rounded-xl"
      >
        <i class="pi pi-sign-out text-slate-100"></i>
        <span>Logout</span>
      </button>
    </div>
  </div>
</template>

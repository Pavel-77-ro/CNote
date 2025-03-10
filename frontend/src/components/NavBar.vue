<script setup>
import { ref,watch,onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import logo from '@/assets/img/logo.png';
import { useRouter } from 'vue-router';
import HamburgerMenu from './HamburgerMenu.vue';
import { useUserStore } from '../stores/userStore';


const router = useRouter();
const menuActive = ref(false);
const userStore = useUserStore();

function goToLogIn() {
  router.push({ name: 'login' });
}

const toggleMenu = () => {
  menuActive.value = !menuActive.value;
};

watch(menuActive, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  } else {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  }
});


onUnmounted(() => {
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';
});
</script>

<template>
  <header class="backdrop-blur-xl sm:mt-3 z-40 font-Poppins relative" >
    <nav id="navb" class="container flex items-center py-6">
      <RouterLink class="flex items-center mr-4" to="/">
        <img class="h-10 w-auto" :src="logo" alt="" />
        <span class="text-3xl text-orange-600 font-bold ml-2">C</span>
        <span class="text-3xl text-slate-800 font-bold">NOTE</span>
      </RouterLink>
      <ul class="hidden sm:flex flex-1 justify-end items-center gap-12 text-slate-800 uppercase">
        <li
          class="cursor-pointer hover-underline-animation transition-duration:150ms sm:text-md font-normal"
        >
          <RouterLink :to="{ name: 'home' }">Home</RouterLink>
        </li>
        <li class="cursor-pointer hover-underline-animation transition-duration:150ms sm:text-md">
          <RouterLink :to="{ name: 'about' }">About</RouterLink>
        </li>

        <button
          type="button"
          class="btn btn-purple rounded-lg px-4 py-2 hover:bg-black sm:text-md"
          @click="goToLogIn()"
        >
          {{ userStore.isAuthenticated ? 'My Notes': 'Log In'}}
        </button>
      </ul>
      <div class="flex sm:hidden flex-1 justify-end" @click="toggleMenu()">
        <Transition name="scale-fade" mode="out-in">
          <i class="text-3xl pi pi-bars cursor-pointer font-medium z-20" v-if="!menuActive"></i>
          <i class="text-3xl pi pi-times cursor-pointer font-medium z-20" v-else></i>
        </Transition>
      </div>
      <Transition name="slide-fade"
        ><div class="h-svh w-svw bg-slate-300 opacity-50 absolute top-0 left-0 z-10" v-if="menuActive" @click="toggleMenu()"></div
      ></Transition>
        <Transition name="slide-fade">
        <HamburgerMenu v-if="menuActive === true" />
      </Transition>

      
      
    </nav>
  </header>
</template>

<style scoped>
.scale-fade-enter-active,
.scale-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.scale-fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.scale-fade-leave-to {
  opacity: 0;
  transform: scale(1.2) rotate(90deg);
}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.4s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>

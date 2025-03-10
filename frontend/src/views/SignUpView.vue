<script setup>
import { useUserStore } from '@/stores/userStore';
import { useRouter, RouterLink } from 'vue-router';
import FormCard from '@/components/FormCard.vue';
import logo from '@/assets/img/logo.png';
import { useNotificationStore } from '@/stores/notificationStore'

const notification = useNotificationStore();

const title = 'Create Account';
const btnText = 'Sign Up';
const linkText = 'Log In';
const routeName = 'login';
const question = 'Already have an account?';

const userStore = useUserStore();
const router = useRouter();

async function handleSubmitForm({ username, password }) {
  const success = await userStore.signup({ username, password });
  if (success) {
    router.push({ name: 'login' });
  } else {
    notification.showNotification(userStore.errorMessage);
  }
}
</script>

<template>
  <section class="h-svh w-svw flex items-center justify-center bg-gradient-to-tl from-gray-300 via-gray-200 via-[20%] to-orange-400">
    <RouterLink :to="{ name: 'home' }" class="absolute top-4 left-4 bg-gray-50 p-2 rounded-full hover:scale-105 transition">
      <img class="h-8 lg:h-10 w-auto" :src="logo" alt="Logo" />
    </RouterLink>
    <div class="w-5/6 sm:w-3/5 lg:w-1/2 h-[600px] rounded-2xl shadowed flex overflow-hidden bg-slate-50">
      <FormCard 
        :title="title" 
        :btnText="btnText" 
        :linkText="linkText" 
        :routeName="routeName" 
        :question="question" 
        class="flex-[2] flex justify-center items-center"
        @submitForm="handleSubmitForm"
      />
      <div class="hidden sm:flex h-full text-gray-100 flex-[1] items-center justify-center bg-gray-900 flex-col gap-6 relative">
        <h2 class="text-xl lg:text-3xl font-semibold text-gray-100 text-center">Sign Up Now!</h2>
        <p class="text-md lg:text-xl px-6 text-center text-gray-300">
          Join us today and start exploring our innovative note taking application!
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.shadowed {
  box-shadow: 0 0 20px 3px rgb(150, 150, 150);
}
</style>

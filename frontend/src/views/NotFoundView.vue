<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <section class="text-center flex flex-col justify-center items-center h-96">
      <i class="pi pi-exclamation-triangle text-yellow-500 text-5xl lg:text-7xl"></i>
      <h1 class="text-4xl lg:text-6xl font-bold mb-4">404 Not Found</h1>
      <p class="text-xl mb-5">This page does not exist</p>
      <RouterLink
        to="/"
        class="btn btn-purple rounded-lg px-4 py-2 hover:bg-black sm:text-lg"
        >Homepage</RouterLink
      >
    </section>
</template>
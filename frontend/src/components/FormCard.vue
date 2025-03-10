<script setup>
import { ref, computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  btnText: { type: String, required: true },
  title: { type: String, required: true },
  linkText: { type: String, required: true },
  routeName: { type: String, required: true },
  question: { type: String, required: true },
})

const emit = defineEmits(['submitForm'])

const username = ref('')
const password = ref('')

const usernameTouched = ref(false)
const passwordTouched = ref(false)

function onUsernameBlur() {
  usernameTouched.value = true
}

function onPasswordBlur() {
  passwordTouched.value = true
}

const usernameError = computed(() => {
  if (!usernameTouched.value) return ''
  if (!username.value) return 'Username is required.'
  return ''
})

const passwordError = computed(() => {
  if (!passwordTouched.value) return ''
  if (password.value.length < 8) return 'Password must be at least 8 characters.'
  return ''
})

const isFormValid = computed(() => {
  return !usernameError.value && !passwordError.value
})

function submitForm() {
  usernameTouched.value = true
  passwordTouched.value = true
  
  if (!isFormValid.value) {
    return
  }
  emit('submitForm', { username: username.value, password: password.value })
}
</script>

<template>
  <div class="flex justify-center items-center bg-white">
    <form @submit.prevent="submitForm" class="bg-white p-8 flex flex-col gap-5 w-full max-w-md items-center">
      <h2 class="text-3xl md:text-4xl font-normal text-gray-900 text-center mb-8 font-Lucky">
        {{ props.title }}
      </h2>
      
      <div class="w-full">
        <input 
          type="text" 
          placeholder="Username" 
          v-model="username"
          @blur="onUsernameBlur"
          class="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p v-if="usernameError" class="text-red-500 text-sm mt-1">{{ usernameError }}</p>
      </div>
      
      <div class="w-full">
        <input 
          type="password" 
          placeholder="Password" 
          v-model="password"
          @blur="onPasswordBlur"
          min="8" 
          class="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</p>
      </div>
      
      <button 
        type="submit"
        :disabled="!isFormValid"
        class="mt-8 bg-blue-600 text-white text-center font-medium py-2 rounded-md hover:bg-blue-800 transition w-3/5 disabled:opacity-50"
      >
        {{ props.btnText }}
      </button>

      <p class="text-gray-600 text-center text-sm">
        {{ props.question }}
        <RouterLink :to="{ name: props.routeName }" class="text-blue-500 hover:underline transition">
          {{ props.linkText }}
        </RouterLink>
      </p>
    </form>
  </div>
</template>

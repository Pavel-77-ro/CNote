<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MainScene from '../components/dashboard/MainScene.vue'
import FolderSystem from '../components/dashboard/FolderSystem.vue'


// Reactive property to control folder menu visibility on small screens
const folderMenuOpen = ref(false)
function toggleFolderMenu() {
  folderMenuOpen.value = !folderMenuOpen.value
}

function closeFolderMenu() {
  if(folderMenuOpen.value){
    folderMenuOpen.value=false;
  }
}

// Media query listener: automatically close folder menu when screen is xl or larger.
const mediaQuery = window.matchMedia('(min-width: 1280px)') // Tailwind xl breakpoint (~1280px)
function handleMediaChange(e) {
  if (e.matches) {
    folderMenuOpen.value = false
  }
}
onMounted(() => {
  mediaQuery.addEventListener('change', handleMediaChange)
})
onBeforeUnmount(() => {
  mediaQuery.removeEventListener('change', handleMediaChange)
})
</script>

<template>
  <main class="relative flex h-svh ">
    <button
     v-if="!folderMenuOpen"
      class="absolute top-1 left-0 z-50 bg-gray-600 w-8 h-8 rounded-full shadow-md shadow-slate-400 xl:hidden"
      @click.stop="toggleFolderMenu"
    >
      <i class="pi pi-folder-open text-white"></i>
    </button>


    <!-- Folder System Overlay for small screens -->
    <div
      class="fixed top-0 left-0 z-40 h-full w-[62%] sm:w-[40%] lg:w-[25%] bg-white border-r border-gray-300 overflow-y-auto transition-transform duration-300 ease-in-out xl:hidden"
      :class="folderMenuOpen ? 'translate-x-0' : '-translate-x-full'"
      v-click-outside="closeFolderMenu"
    >
      <FolderSystem />
    </div>

    <!-- Folder System in Grid Layout for xl and up -->
    <div class="hidden xl:block xl:w-[18%] 2xl:w-[16%] border-r h-full overflow-y-auto">
      <FolderSystem />
    </div>

    <!-- Main Scene -->
    <div class="w-full xl:w-[82%] 2xl:w-[84%] h-full">
      <MainScene />
    </div>
  </main>
</template>

<style scoped>

</style>
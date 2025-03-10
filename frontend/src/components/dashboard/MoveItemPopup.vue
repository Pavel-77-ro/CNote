<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  moveCandidate: {
    type: Object,
    required: true,
  },
  allFolders: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'confirm-move']);

// Helper: Check whether a folder is a descendant of the target folder.
function isDescendant(folder, targetId) {
  let currentParent = folder.parentFolder;
  while (currentParent) {
    if (currentParent === targetId) {
      return true;
    }
    const parentFolder = props.allFolders.find(f => f._id === currentParent);
    if (!parentFolder) break;
    currentParent = parentFolder.parentFolder;
  }
  return false;
}

function onSelectParent(folderId) {
  emit('confirm-move', {
    node: props.moveCandidate.node,
    newParentId: folderId,
  });
}

// Compute the position from moveCandidate.position; default to { top: 0, left: 0 }
const movePosition = computed(() => {
  return props.moveCandidate.position || { top: 0, left: 0 };
});
</script>

<template>
  <div
    class="bg-white border border-gray-200 rounded-xl shadow-md z-50"
    :style="{ position: 'absolute', top: movePosition.top + 'px', left: movePosition.left + 'px' }"
  >
    <!-- Header row: title and close icon -->
    <div class="flex items-center justify-between p-3 border-b border-gray-200">
      <span class="font-semibold text-gray-700 text-sm">
        Move "{{ moveCandidate.node.name }}"
      </span>
      <button @click="$emit('close')" class="text-gray-600 hover:text-gray-800">
        <i class="pi pi-times"></i>
      </button>
    </div>

    <!-- List of possible destinations -->
    <ul class="py-1 max-h-64 overflow-auto text-sm">
      <!-- Top Level option -->
      <li
        @click="onSelectParent(null)"
        class="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        <i class="pi pi-inbox mr-2 text-gray-600"></i>
        Top Level
      </li>
      <!-- Other folders excluding the moving folder and its descendants -->
      <li
        v-for="folder in allFolders.filter(f => f._id !== moveCandidate.node._id && !isDescendant(f, moveCandidate.node._id))"
        :key="folder._id"
        @click="onSelectParent(folder._id)"
        class="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        <i class="pi pi-folder mr-2 text-gray-600"></i>
        {{ folder.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

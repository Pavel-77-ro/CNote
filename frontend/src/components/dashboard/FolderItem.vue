<script setup>
import { ref, inject, computed } from 'vue';
import { useNoteStore } from '@/stores/noteStore';
import { useNotificationStore } from '@/stores/notificationStore';

const props = defineProps({
  node: { type: Object, required: true },
  level: { type: Number, default: 0 },
  index: { type: Number, required: true },
  siblings: { type: Array, default: () => [] },
});

const emit = defineEmits([
  'move-item',
  'delete-node',
  'rename-node',
  'request-move',
  'select-note',
]);

const editing = ref(false);
const tempName = ref(props.node.type === 'note' ? props.node.title : props.node.name);
const showOptions = ref(false);

const createFolderFn = inject('createFolder');
const createNoteFn = inject('createNote');
const notification = useNotificationStore();
const noteStore = useNoteStore();

const isSelected = computed(() => {
  if (props.node.type !== 'note') return false;
  if (!noteStore.selectedNote) return false;
  return noteStore.selectedNote._id === props.node._id;
});

function toggleOptions() {
  showOptions.value = !showOptions.value;
}

function closeOptions() {
  showOptions.value = false;
}

function startRename() {
  editing.value = true;
  showOptions.value = false;
}

function saveRename() {
  editing.value = false;
  const newValue = tempName.value.trim();
  if (!newValue) {
    notification.showNotification('Name cannot be empty.');
    return;
  }
  if (props.node.type === 'folder' && newValue.length > 50) {
    notification.showNotification('Folder name must not exceed 50 characters.');
    return;
  }
  if (props.node.type === 'note' && newValue.length > 100) {
    notification.showNotification('Note title must not exceed 100 characters.');
    return;
  }
  if (props.node.type === 'folder') {
    emit('rename-node', {
      type: 'folder',
      node: props.node,
      newName: newValue,
    });
  } else {
    emit('rename-node', {
      type: 'note',
      node: props.node,
      newTitle: newValue,
    });
  }
}

function removeNode() {
  if (props.node.type === 'folder') {
    emit('delete-node', { type: 'folder', id: props.node._id });
  } else {
    emit('delete-node', { type: 'note', id: props.node._id });
  }
  showOptions.value = false;
}

function createNewFolder() {
  if (props.level >= 2) {
    notification.showNotification('Maximum folder nesting level reached.');
    return;
  }
  createFolderFn(props.node);
  showOptions.value = false;
}

function createNewNote() {
  createNoteFn(props.node);
  showOptions.value = false;
}

// NEW: onRequestMove accepts the click event to compute position.
function onRequestMove(event) {
  // Stop propagation so the container click isn't triggered.
  event.stopPropagation();
  // Get the bounding rectangle of the clicked element.
  const rect = event.currentTarget.getBoundingClientRect();
  emit('request-move', {
    node: props.node,
    siblings: props.siblings,
    // Save the position (adjust offsets as needed)
    position: { top: rect.bottom + window.scrollY, left: rect.left + window.scrollX +60 }
  });
  //showOptions.value = false;
}

// Called when user clicks the container.
function onContainerClick() {
  if (props.node.type === 'note' && !editing.value) {
    emit('select-note', props.node);
  }
}
</script>

<template>
  <div class="ml-2 2xl:ml-4 mt-2 relative font-Poppins">
    <!-- Main container -->
    <div
      class="flex items-center justify-between py-[2px] 2xl:py-1 px-[6px] 2xl:px-2 border rounded-xl cursor-pointer bg-gray-100"
      v-click-outside="closeOptions"
      :class="{ 'bg-orange-200': isSelected }"
      @click="onContainerClick"
    >
      <!-- Icon + name -->
      <div class="flex items-center ml-2 overflow-hidden">
        <i
          :class="[
            props.node.type === 'folder'
              ? 'pi pi-folder text-base 2xl:text-lg'
              : 'pi pi-file text-base 2xl:text-lg',
            isSelected ? 'text-orange-500' : 'text-gray-600'
          ]"
        ></i>
        <span
          class="ml-2 overflow-hidden text-sm 2xl:text-base"
          v-if="!editing && props.node.type === 'folder'"
        >
          {{ props.node.name }}
        </span>
        <span
          class="ml-2 overflow-hidden text-sm 2xl:text-base"
          v-else-if="!editing && props.node.type === 'note'"
        >
          {{ props.node.title }}
        </span>
        <input
          v-else
          v-model="tempName"
          @keydown.enter="saveRename"
          @blur="saveRename"
          class="border rounded p-1 ml-1 2xl:ml-2 w-[80%] md:max-w-32"
        />
      </div>
      <!-- Dropdown menu -->
      <div class="relative">
        <button
          @click.stop="toggleOptions"
          class="text-gray-600 hover:text-gray-800 p-2 rounded-full focus:outline-none"
        >
          <i class="pi pi-ellipsis-v text-sm 2xl:text-base"></i>
        </button>
        <transition name="fade">
          <div
            v-if="showOptions"
            class="absolute border right-2 mt-1 w-44 bg-white border-gray-300 rounded-lg shadow-md z-10"
          >
            <ul class="py-1 text-gray-700 text-sm">
              <li
                v-if="props.node.type === 'folder'"
                @click="createNewFolder"
                class="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <i class="pi pi-folder mr-2"></i>
                + New Folder
              </li>
              <li
                v-if="props.node.type === 'folder'"
                @click="createNewNote"
                class="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <i class="pi pi-file mr-2"></i>
                + New Note
              </li>
              <li
                @click="startRename"
                class="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <i class="pi pi-pencil mr-2"></i>
                Rename
              </li>
              <!-- Updated move option -->
              <li
                @click="onRequestMove($event)"
                class="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <i class="pi pi-external-link mr-2"></i>
                Move
              </li>
              <li
                @click="removeNode"
                class="flex items-center px-4 py-2 hover:bg-red-100 cursor-pointer text-red-600"
              >
                <i class="pi pi-trash mr-2"></i>
                Delete
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>

    <!-- Render children recursively if folder -->
    <div v-if="props.node.type === 'folder' && props.node.children && props.node.children.length" class="ml-2 2xl:ml-4 mt-2">
      <div v-for="(child, childIndex) in props.node.children" :key="child._id">
        <FolderItem
          :node="child"
          :level="level + 1"
          :index="childIndex"
          :siblings="props.node.children"
          @move-item="$emit('move-item', $event)"
          @delete-node="(...args) => $emit('delete-node', ...args)"
          @rename-node="$emit('rename-node', $event)"
          @request-move="$emit('request-move', $event)"
          @select-note="$emit('select-note', $event)"
        />
      </div>
    </div>
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

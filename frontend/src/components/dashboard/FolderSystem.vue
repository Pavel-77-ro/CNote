<script setup>
import { onMounted,  ref, computed, provide } from 'vue'
import { useFolderStore } from '@/stores/folderStore'
import { useUserStore } from '@/stores/userStore'
import FolderItem from './FolderItem.vue'
import logo from '@/assets/img/logo.png'
import { RouterLink, useRouter } from 'vue-router'
import MoveItemPopup from './MoveItemPopup.vue'
import { useNoteStore } from '@/stores/noteStore'
import { useNotificationStore } from '@/stores/notificationStore'

const notification = useNotificationStore()
const folderStore = useFolderStore()
const userStore = useUserStore()
const router = useRouter()
const noteStore = useNoteStore()


const folders = computed(() => folderStore.folders)

const moveCandidate = ref(null)


function createFolder(parent) {
  const folderData = {
    name: 'New Folder',
    parentFolder: parent ? parent._id : null,
  }
  folderStore.createFolder(folderData)
}

function handleKeyDown(e) {
  if (e.repeat) return
  if (['INPUT', 'TEXTAREA'].includes(
        document.activeElement.tagName)) return

  if (e.ctrlKey) {
    const key = e.key.toLowerCase()
    if (key === 'q') {
      e.preventDefault()
      createFolder(null)
    } else if (key === 'p') {
      e.preventDefault()
      createNote(null)
    }
  }
}

onMounted(() => {
  
  if (!window.__sidebarKeydownAttached) {
    window.addEventListener('keydown', handleKeyDown)
    window.__sidebarKeydownAttached = true
  }

  folderStore.fetchFolders()
  noteStore.fetchNotes()
})

provide('createFolder', createFolder)
provide('createNote', createNote)

async function handleDelete({ type, id }) {
  try {
    if (type === 'folder') {
      await folderStore.deleteFolder(id);
      await folderStore.fetchFolders();
      await noteStore.fetchNotes();
    } else {
      await noteStore.deleteNote(id);
      await folderStore.fetchFolders();
      await noteStore.fetchNotes();
    }
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
  }
}

async function handleRename(payload) {
  try {
    if (payload.type === 'folder') {
      const { node, newName } = payload;
      await folderStore.updateFolder(node._id, { name: newName, parentFolder: node.parentFolder });
      await folderStore.fetchFolders();
    } else {
      const { node, newTitle } = payload;
      await noteStore.updateNote(node._id, { title: newTitle });
      await folderStore.fetchFolders();
    }
  } catch (error) {
    console.error(`Error renaming ${payload.type}:`, error);
  }
}


function moveItem({ siblings, index, direction }) {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= siblings.length) return
  const temp = siblings[index]
  siblings[index] = siblings[newIndex]
  siblings[newIndex] = temp
}

function onRequestMove({ node, siblings, position }) {
  moveCandidate.value = { node, siblings, position }
}

async function moveNode({ node, newParentId }) {
  try {
    if (node.type === 'folder') {
      await folderStore.moveFolder(node._id, newParentId);
    } else {
      await noteStore.moveNote(node._id, newParentId);
    }
    moveCandidate.value = null;
    
    
  } catch (error) {
    notification.showNotification(error.response?.data?.error || 'Error moving item.');
    console.error('Error moving item:', error);

  } finally {
    await folderStore.fetchFolders();
    await noteStore.fetchNotes();
  }
}


const showUserOptions = ref(false)

function toggleUserOptions() {
  showUserOptions.value = !showUserOptions.value
}

function closeOptions() {
  showUserOptions.value = false
}

function logout() {
  userStore.logout()
  router.push({ name: 'home' })
}

function handleSelectNote(note) {
  noteStore.selectedNote = note;
}

function createNote(parent) {
  const noteData = {
    title: 'New Note',                   
    keyPoints: 'Your Keywords Are Here',                       
    detailedNotes: 'Your Notes Come Here',  
    summary: 'Your Summary Should Be Here',                         
    folderId: parent ? parent._id : null, 
  }
  noteStore.createNote(noteData)
    .then(() => {
      console.log('New note created:', noteData)
      folderStore.fetchFolders()
    })
    .catch(error => {
      console.error('Error creating note:', error)
    })
}

const otherNotes = computed(() => {
  return noteStore.notes
    .filter(note => !note.folderId)
    .map(note => ({
      ...note,
      type: 'note',
    }));
});



const nestedFolders = computed(() => {
  const foldersWithChildren = folderStore.folders.map(folder => {
    const folderCopy = {
      ...folder,
      children: [],
      type: folder.type || 'folder',
    };
   
    if (folder.notes && folder.notes.length) {
      folderCopy.children = folder.notes.map(note => ({
        ...note,
        type: 'note',
      }));
    }
    return folderCopy;
  });


  const map = {};
  foldersWithChildren.forEach(folder => {
    map[folder._id] = folder;
  });

  const tree = [];
  foldersWithChildren.forEach(folder => {
    if (folder.parentFolder) {
      if (map[folder.parentFolder]) {
        map[folder.parentFolder].children.push(folder);
      } else {
        tree.push(folder);
      }
    } else {
      tree.push(folder);
    }
  });
  return tree;
});


const allFolders = computed(() => {
  const list = []
  function traverse(items) {
    for (const it of items) {
      list.push(it)
      if (it.children && it.children.length) traverse(it.children)
    }
  }
  traverse(folderStore.folders)
  return list
})


</script>

<template>
  <div class="pt-4 pb-6 px-2 font-Poppins select-none">
    <!-- Top bar with logo and user icon -->
    <div class="flex justify-between py-3 px-1 2xl:px-4 items-center">
      <RouterLink class="flex items-center" to="/">
        <img class="h-6 2xl:h-8 w-auto" :src="logo" alt="Logo" />
        <span class="text-2xl 2xl:text-3xl text-orange-600 font-bold ml-1">C</span>
        <span class="text-2xl 2xl:text-3xl text-slate-800 font-bold">NOTE</span>
      </RouterLink>
      <!-- User icon with pop-up -->
      <div class="relative" v-click-outside="closeOptions">
        <div
          class="h-8 w-8 2xl:h-10 2xl:w-10 xl:hover:bg-orange-500 flex justify-center cursor-pointer items-center xl:hover:text-gray-200 text-gray-700 border xl:hover:border-slate-200 rounded-full bg-gray-200 border-none transition"
          @click="toggleUserOptions"
        >
          <i class="pi pi-user 2xl:text-xl"></i>
        </div>
        <!-- User options dropdown -->
        <transition name="fade">
          <div
            v-if="showUserOptions"
            class="absolute top-8 right-6 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-md z-10"
          >
            <ul class="py-1 text-gray-700 text-sm">
              <li class="px-4 py-2 border-b">
                Username: {{ userStore.user?.username || 'Guest' }}
              </li>
              <li
                @click="logout"
                class="px-4 py-2 hover:bg-red-100 cursor-pointer text-red-600"
              >
              <i class="pi pi-sign-out mr-2"></i>
                Logout
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>

    <!-- Buttons for creating new items -->
    <div class="mx-1 2xl:mx-4 p-3 my-3 2xl:my-6 flex flex-col justify-around items-center gap-3">
      <button @click="createFolder(null)" class="text-sm 2xl:text-base px-4 2xl:px-6 py-3 w-full bg-orange-500 text-white rounded-3xl hover:bg-gray-300  hover:text-gray-800 transition">
       New Folder +
      </button>
      <button @click="createNote(null)" class="text-sm 2xl:text-base px-4 2xl:px-6 py-3 w-full bg-gray-500 text-white rounded-3xl hover:bg-gray-300  hover:text-gray-800 transition">
        New Note +
      </button>
    </div>

    <h1 class="-mb-[1px] px-5 2xl:px-7 mt-8 text-gray-800 text-sm font-medium">My Note System</h1>

    <!-- Render folders using FolderItem -->
    <div v-for="(node, index) in nestedFolders" :key="node._id" class="mr-2 2xl:mr-4">
      <FolderItem
        :node="node"
        :level="0"
        :index="index"
        :siblings="folders"
        @move-item="moveItem"
        @delete-node="handleDelete"
        @rename-node="handleRename"
        @request-move="onRequestMove"
        @select-note="handleSelectNote" 
      />
    </div>

    <h1 class="-mb-[1px] px-5 2xl:px-7 mt-14 2xl:mt-16 text-gray-800 text-sm font-medium">Others</h1>
    
    <div v-for="(node, index) in otherNotes" :key="node._id" class="mr-2 2xl:mr-4">
      <FolderItem
        :node="node"
        :level="0"
        :index="index"
        :siblings="folders"
        @move-item="moveItem"
        @delete-node="handleDelete"
        @rename-node="handleRename"
        @request-move="onRequestMove"
        @select-note="handleSelectNote" 
      />
    </div>

    <!-- Modal for moving an item -->
    <MoveItemPopup
      v-if="moveCandidate"
      :move-candidate="moveCandidate"
      :all-folders="allFolders"
      @close="moveCandidate = null"
      @confirm-move="moveNode"
    />
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

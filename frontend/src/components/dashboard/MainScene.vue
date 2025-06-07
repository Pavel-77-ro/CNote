<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { useNoteStore } from '@/stores/noteStore';
import { useFolderStore } from '../../stores/folderStore';

const noteStore = useNoteStore();
const folderStore = useFolderStore();

const toolbarOpen = ref(false);
function toggleToolbar() {
  toolbarOpen.value = !toolbarOpen.value;
}

const mediaQuery = window.matchMedia('(min-width: 1024px)')

const focusEditor = (section) => {
  activeSection.value = section;
  editors.value[section]?.commands.focus();
};

function handleMediaChange(e) {
  if (e.matches) {
    toolbarOpen.value = false
  }
}

function saveCurrentNote() {
  if (noteStore.selectedNote) {
    const updatedNoteData = {
      title: noteStore.selectedNote.title,  
      keyPoints: cornellNotes.value.keywords,
      detailedNotes: cornellNotes.value.mainNotes,
      summary: cornellNotes.value.summary,
      folderId: noteStore.selectedNote.folderId,
    };
    noteStore.updateNote(noteStore.selectedNote._id, updatedNoteData)
      .then(() => {
        console.log('Note saved successfully.');
        noteStore.fetchNotes(); 
        if (noteStore.selectedNote.folderId) {
          folderStore.fetchFolders();
        }
      })
      .catch((error) => {
        console.error('Error saving note:', error);
      });
  }
}

function handleKeyDown(event) {
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault();
    saveCurrentNote();
  }
}

window.addEventListener('keydown', handleKeyDown);
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});


onMounted(() => {
  noteStore.fetchNotes();
  mediaQuery.addEventListener('change', handleMediaChange)
});

const cornellNotes = ref({
  keywords: '<p>Click here to add keywords...</p>',
  mainNotes: '<p>Click here to add notes...</p>',
  summary: '<p>Click here to add a summary...</p>',
});

const activeSection = ref('keywords');
const editors = ref({
  keywords: null,
  mainNotes: null,
  summary: null,
});

// Initialize TipTap editors for each section
onMounted(() => {
  ['keywords', 'mainNotes', 'summary'].forEach((section) => {
    editors.value[section] = new Editor({
      content: cornellNotes.value[section],
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3, 4, 5, 6] },
        }),
        TextAlign.configure({ types: ['heading', 'paragraph', 'listItem'] }),
        Underline,
        Color,
        TextStyle,
        Highlight.configure({ multicolor: true }),
      ],
      onUpdate: () => {
        cornellNotes.value[section] = editors.value[section].getHTML();
      },
      onFocus: () => {
        activeSection.value = section;
      },
    });
  });
});

onBeforeUnmount(() => {
  mediaQuery.removeEventListener('change', handleMediaChange);
  Object.values(editors.value).forEach((editor) => {
    if (editor) editor.destroy();
  });
});



watch(
  () => noteStore.selectedNote,
  (newNote) => {
    if (newNote) {
      cornellNotes.value.keywords = newNote.keyPoints || '<p></p>';
      cornellNotes.value.mainNotes = newNote.detailedNotes || '<p></p>';
      cornellNotes.value.summary = newNote.summary || '<p></p>';
      
      if (editors.value.keywords) {
        editors.value.keywords.commands.setContent(cornellNotes.value.keywords);
      }
      if (editors.value.mainNotes) {
        editors.value.mainNotes.commands.setContent(cornellNotes.value.mainNotes);
      }
      if (editors.value.summary) {
        editors.value.summary.commands.setContent(cornellNotes.value.summary);
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <main class="font-Poppins h-full w-full p-6 lg:pr-0 lg:pt-6 lg:pb-6 lg:pl-4 tt">
    
    <button
      class="absolute top-1/2 right-0 bg-orange-400 py-2 rounded-full z-50 block lg:hidden "
      @click="toggleToolbar"
      :class="{'transform -translate-x-20':toolbarOpen}"
    >
      <i v-if="!toolbarOpen" class="pi pi-angle-left text-gray-100"></i>
      <i v-else class="pi pi-angle-right text-gray-100"></i>
    </button>
    
    <!-- Cornell Notes Grid -->
    <div
      class="grid h-full gap-4 grid-cols-1 grid-rows-6 lg:grid-cols-11 2xl:grid-cols-15 lg:grid-rows-10 rounded-xl"
    >
      <!-- Keywords Section -->
      <div
        class="bg-gray-100 p-4 rounded-xl h-full overflow-y-auto col-span-1 row-span-2 lg:col-span-3 lg:row-span-8 cursor-text"
        @click="focusEditor('keywords')"
      >
        <EditorContent :editor="editors.keywords" class="h-full rounded-md focus:outline-none" />
      </div>
      <!-- Main Notes Section -->
      <div
        class="bg-gray-200 p-4 rounded-xl col-span-1 h-full overflow-y-auto row-span-3 lg:col-span-7 2xl:col-span-11 lg:row-span-8 cursor-text"
        @click="focusEditor('mainNotes')"
      >
        <EditorContent
          :editor="editors.mainNotes"
          class="h-full rounded-md focus:outline-none tiptap"
        />
      </div>
      <!-- Summary Section -->
      <div
        class="bg-gray-300 p-4 rounded-xl col-span-1 row-span-1 h-full overflow-y-auto lg:col-span-10 2xl:col-span-14 lg:row-span-2 cursor-text"
        @click="focusEditor('summary')"
      >
        <EditorContent :editor="editors.summary" class="h-full rounded-md focus:outline-none" />
      </div>
      <!-- Toolbar for active editor -->
      <div
      class="
          overflow-y-auto 
          bg-white 
          border-l border-orange-200
          pb-4 pt-6
          2xl:pb-3 2xl:pt-2 px-2 2xl:px-3
          lg:col-start-11 2xl:col-start-15 lg:col-span-1 lg:row-span-10 lg:row-start-1
          lg:block
          
        "
        :class="{
          'hidden': !toolbarOpen, 
          'block absolute right-0 top-0 max-w-20 z-50 h-full ': toolbarOpen, 
          'lg:block': true
        }">
        <div v-if="editors[activeSection]" class="flex flex-col items-center gap-2 2xl:gap-3">
          <section class="flex flex-nowrap flex-col gap-2 items-center">
            <button @click="saveCurrentNote" class="font-Poppins text-sm bg-orange-500 text-white lg:hover:font-medium hover:bg-[#ff956e] hover:text-gray-800 mb-2 px-2 py-3 rounded-xl">Save</button>
            <button
              @click="editors[activeSection].chain().focus().toggleBold().run()"
              :class="{ 'is-active': editors[activeSection]?.isActive('bold') }"
              class="toolbar-btn"
            >
              B
            </button>
            <button
              @click="editors[activeSection].chain().focus().toggleItalic().run()"
              :class="{ 'is-active': editors[activeSection]?.isActive('italic') }"
              class="toolbar-btn"
            >
              I
            </button>
            <button
              @click="editors[activeSection].chain().focus().toggleUnderline().run()"
              :class="{ 'is-active': editors[activeSection]?.isActive('underline') }"
              class="toolbar-btn"
            >
              U
            </button>
            <button
              @click="editors[activeSection].chain().focus().toggleStrike().run()"
              :class="{ 'is-active': editors[activeSection]?.isActive('strike') }"
              class="toolbar-btn"
            >
              S
            </button>
          </section>
          <hr class="w-5/6 rounded-xl border-slate-800 border-1 my-3" />
          <section class="flex flex-nowrap flex-col gap-2 items-center">
            <button
              @click="editors[activeSection].chain().focus().toggleHeading({ level: 1 }).run()"
              :class="{ 'is-active': editors[activeSection]?.isActive('heading', { level: 1 }) }"
              class="toolbar-btn"
            >
              H1
            </button>
            <button
              @click="editors[activeSection].chain().focus().toggleHeading({ level: 2 }).run()"
              :class="{ 'is-active': editors[activeSection]?.isActive('heading', { level: 2 }) }"
              class="toolbar-btn"
            >
              H2
            </button>
            <button
              @click="editors[activeSection].chain().focus().toggleHeading({ level: 3 }).run()"
              :class="{ 'is-active': editors[activeSection]?.isActive('heading', { level: 3 }) }"
              class="toolbar-btn"
            >
              H3
            </button>
            <button
              @click="editors[activeSection].chain().focus().toggleHeading({ level: 4 }).run()"
              :class="{ 'is-active': editors[activeSection]?.isActive('heading', { level: 4 }) }"
              class="toolbar-btn"
            >
              H4
            </button>
            <button
              @click="editors[activeSection].chain().focus().toggleHeading({ level: 5 }).run()"
              :class="{ 'is-active': editors[activeSection]?.isActive('heading', { level: 5 }) }"
              class="toolbar-btn"
            >
              H5
            </button>
            <button
              @click="editors[activeSection].chain().focus().toggleHeading({ level: 6 }).run()"
              :class="{ 'is-active': editors[activeSection]?.isActive('heading', { level: 6 }) }"
              class="toolbar-btn"
            >
              H6
            </button>
          </section>
          <hr class="w-5/6 rounded-xl border-slate-800 border-1 my-3" />
          <section class="flex flex-nowrap flex-col gap-2 items-center">
            <button
              @click="
                editors[activeSection].chain().focus().toggleHighlight({ color: '#ffc078' }).run()
              "
              :class="{
                'is-active': editors[activeSection]?.isActive('highlight', { color: '#ffc078' }),
              }"
              class="toolbar-btn"
            >
              <div class="h-5 w-5 rounded-full bg-orange-500"></div>
            </button>
            <button
              @click="
                editors[activeSection].chain().focus().toggleHighlight({ color: '#8ce99a' }).run()
              "
              :class="{
                'is-active': editors[activeSection]?.isActive('highlight', { color: '#8ce99a' }),
              }"
              class="toolbar-btn"
            >
              <div class="h-5 w-5 rounded-full bg-green-500"></div>
            </button>
            <button
              @click="
                editors[activeSection].chain().focus().toggleHighlight({ color: '#74c0fc' }).run()
              "
              :class="{
                'is-active': editors[activeSection]?.isActive('highlight', { color: '#74c0fc' }),
              }"
              class="toolbar-btn"
            >
              <div class="h-5 w-5 rounded-full bg-blue-500"></div>
            </button>
            <button
              @click="
                editors[activeSection].chain().focus().toggleHighlight({ color: '#b197fc' }).run()
              "
              :class="{
                'is-active': editors[activeSection]?.isActive('highlight', { color: '#b197fc' }),
              }"
              class="toolbar-btn"
            >
              <div class="h-5 w-5 rounded-full bg-purple-500"></div>
            </button>
            <button
              @click="
                editors[activeSection].chain().focus().toggleHighlight({ color: 'red' }).run()
              "
              :class="{
                'is-active': editors[activeSection]?.isActive('highlight', { color: 'red' }),
              }"
              class="toolbar-btn"
            >
              <div class="h-5 w-5 rounded-full bg-red-500"></div>
            </button>
            <button
              @click="
                editors[activeSection].chain().focus().toggleHighlight({ color: '#ff8fa3' }).run()
              "
              :class="{
                'is-active': editors[activeSection]?.isActive('highlight', { color: '#ff8fa3' }),
              }"
              class="toolbar-btn"
            >
              <div class="h-5 w-5 rounded-full bg-rose-400"></div>
            </button>
          </section>
          <hr class="w-5/6 rounded-xl border-slate-800 border-1 my-3" />
          <section class="flex flex-nowrap flex-col gap-2 items-center">
            <button
              @click="editors[activeSection].chain().focus().setTextAlign('left').run()"
              :class="{ 'is-active': editors[activeSection]?.isActive({ textAlign: 'left' }) }"
              class="toolbar-btn"
            >
              <i class="pi pi-align-left text-xl"></i>
            </button>
            <button
              @click="editors[activeSection].chain().focus().setTextAlign('center').run()"
              :class="{ 'is-active': editors[activeSection]?.isActive({ textAlign: 'center' }) }"
              class="toolbar-btn"
            >
              <i class="pi pi-align-center text-xl"></i>
            </button>
            <button
              @click="editors[activeSection].chain().focus().setTextAlign('right').run()"
              :class="{ 'is-active': editors[activeSection]?.isActive({ textAlign: 'right' }) }"
              class="toolbar-btn"
            >
              <i class="pi pi-align-right text-xl"></i>
            </button>
            <button
              @click="editors[activeSection].chain().focus().setTextAlign('justify').run()"
              :class="{ 'is-active': editors[activeSection]?.isActive({ textAlign: 'justify' }) }"
              class="toolbar-btn"
            >
              <i class="pi pi-align-justify text-xl"></i>
            </button>
          </section>
          <hr class="w-5/6 rounded-xl border-slate-800 border-1 my-3" />
          <section class="flex flex-wrap gap-2 justify-center">
            <button
              @click="editors[activeSection].chain().focus().toggleBulletList().run()"
              :class="{ 'is-active': editors[activeSection]?.isActive('bulletList') }"
              class="toolbar-btn"
            >
              <i class="pi pi-list text-xl"></i>
            </button>
            <button
              @click="editors[activeSection].chain().focus().toggleOrderedList().run()"
              :class="{ 'is-active': editors[activeSection]?.isActive('orderedList') }"
              class="toolbar-btn"
            >
              <i class="pi pi-sort-numeric-down text-xl text-gray-600"></i>
            </button>
            <button
              @click="editors[activeSection].chain().focus().toggleBlockquote().run()"
              :class="{ 'is-active': editors[activeSection]?.isActive('blockquote') }"
              class="toolbar-btn"
            >
              <i class="pi pi-pen-to-square text-xl"></i>
            </button>
            <button
              @click="editors[activeSection].chain().focus().toggleCodeBlock().run()"
              :class="{ 'is-active': editors[activeSection]?.isActive('codeBlock') }"
              class="toolbar-btn"
            >
              <i class="pi pi-code text-xl"></i>
            </button>
            <button
              @click="editors[activeSection].chain().focus().undo().run()"
              class="toolbar-btn"
            >
              <i class="pi pi-arrow-circle-left text-xl"></i>
            </button>
            <button
              @click="editors[activeSection].chain().focus().redo().run()"
              class="toolbar-btn"
            >
              <i class="pi pi-arrow-circle-right text-xl"></i>
            </button>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.toolbar-btn {
  width: 44px;
  height: 44px;
  font-size: 17px;
  font-weight: 500;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #f0f0f0;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}
.toolbar-btn:hover {
  background: #ff956e;
}
button.is-active {
  font-weight: bold;
  color: black;
  background: #ff956e;
}
.tiptap ul {
  list-style-type: disc;
  margin-left: 1.5rem;
}
.tiptap ol {
  list-style-type: decimal;
  margin-left: 1.5rem;
}


</style>

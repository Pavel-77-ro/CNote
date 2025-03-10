// src/stores/noteStore.js
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { apiFetchNotes, apiCreateNote, apiMoveNote, apiUpdateNote, apiDeleteNote } from '@/services/noteService';

export const useNoteStore = defineStore('note', () => {
  const notes = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const selectedNote = ref(null);

  async function fetchNotes() {
    loading.value = true;
    try {
      const response = await apiFetchNotes();
      notes.value = response.data;
    } catch (err) {
      error.value = err;
      console.error('Error fetching notes:', err);
    } finally {
      loading.value = false;
    }
  }

  async function createNote(noteData) {
    try {
      const response = await apiCreateNote(noteData);
      notes.value.push(response.data);
      return response.data;
    } catch (err) {
      console.error('Error creating note:', err);
      throw err;
    }
  }

  async function moveNote(noteId, newFolderId) {
    try {
      const response = await apiMoveNote(noteId, newFolderId);
      return response.data;
    } catch (err) {
      console.error('Error moving note folder:', err);
      throw err;
    }
  }

  async function updateNote(noteId, noteData) {
    try {
      const response = await apiUpdateNote(noteId, noteData);
      const index = notes.value.findIndex(note => note._id === noteId);
      if (index !== -1) {
        notes.value[index] = response.data;
      }
      return response.data;
    } catch (err) {
      console.error('Error updating note:', err);
      throw err;
    }
  }

  async function deleteNote(noteId) {
    try {
      await apiDeleteNote(noteId);
      notes.value = notes.value.filter(note => note._id !== noteId);
    } catch (err) {
      console.error('Error deleting note:', err);
      throw err;
    }
  }

  return { notes, loading, error, selectedNote, fetchNotes, createNote, moveNote, updateNote, deleteNote };
});

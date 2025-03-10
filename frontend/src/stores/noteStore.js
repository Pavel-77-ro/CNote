import { ref } from 'vue'
import { defineStore } from 'pinia'
import axiosInstance from '@/services/axiosInstance'

export const useNoteStore = defineStore('note', () => {
  // State
  const notes = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedNote = ref(null)  // New property for the currently selected note

  // Actions
  async function fetchNotes() {
    loading.value = true
    try {
      const response = await axiosInstance.get('/notes')
      // Assuming the API returns an array of notes
      notes.value = response.data
    } catch (err) {
      error.value = err
      console.error('Error fetching notes:', err)
    } finally {
      loading.value = false
    }
  }

  async function createNote(noteData) {
    try {
      // noteData should include { title, keyPoints, detailedNotes, summary, folderId (optional) }
      const response = await axiosInstance.post('/notes', noteData)
      notes.value.push(response.data)
      return response.data
    } catch (err) {
      console.error('Error creating note:', err)
      throw err
    }
  }

  async function moveNote(noteId, newFolderId) {
    try {
      const response = await axiosInstance.patch(`/notes/${noteId}/folder`, { newFolderId })
      return response.data
    } catch (err) {
      console.error('Error moving note folder:', err)
      throw err
    }
  }

  async function updateNote(noteId, noteData) {
    try {
      const response = await axiosInstance.put(`/notes/${noteId}`, noteData)
      const index = notes.value.findIndex(note => note._id === noteId)
      if (index !== -1) {
        notes.value[index] = response.data
      }
      return response.data
    } catch (err) {
      console.error('Error updating note:', err)
      throw err
    }
  }

  async function deleteNote(noteId) {
    try {
      await axiosInstance.delete(`/notes/${noteId}`)
      notes.value = notes.value.filter(note => note._id !== noteId)
    } catch (err) {
      console.error('Error deleting note:', err)
      throw err
    }
  }

  return { notes, loading, error, selectedNote, fetchNotes, createNote, moveNote, updateNote, deleteNote }
})

// src/stores/folderStore.js
import { defineStore } from 'pinia';
import axiosInstance from '@/services/axiosInstance';

export const useFolderStore = defineStore('folder', {
  state: () => ({
    folders: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchFolders() {
      this.loading = true;
      try {
        const response = await axiosInstance.get('/folders');
        this.folders = response.data.map((folder) => ({
          ...folder,
          type: 'folder',
        }));
      } catch (error) {
        this.error = error;
        console.error('Error fetching folders:', error);
      } finally {
        this.loading = false;
      }
    },
    async createFolder(folderData) {
      try {
        const response = await axiosInstance.post('/folders', folderData);
        this.folders.push(response.data);
      } catch (error) {
        console.error('Error creating folder:', error);
        throw error;
      }
    },
    async deleteFolder(folderId) {
      try {
        await axiosInstance.delete(`/folders/${folderId}`);
        this.folders = this.folders.filter((folder) => folder._id !== folderId);
      } catch (error) {
        console.error('Error deleting folder:', error);
        throw error;
      }
    },
    async moveFolder(folderId, newParentId) {
      await axiosInstance.patch(`/folders/${folderId}/parent`, {
        newParentId,
      });
    },

    async updateFolder(folderId, updateData) {
      try {
        const response = await axiosInstance.put(`/folders/${folderId}`, updateData);
        return response.data;
      } catch (error) {
        console.error('Error updating folder:', error);
        throw error;
      }
    },
  },
});

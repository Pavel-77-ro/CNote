import { defineStore } from 'pinia';
import { fetchFoldersService, createFolderService, deleteFolderService, moveFolderService, updateFolderService } from '@/services/folderService';

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
        const response = await fetchFoldersService();
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
        const response = await createFolderService(folderData);
        this.folders.push(response.data);
      } catch (error) {
        console.error('Error creating folder:', error);
        throw error;
      }
    },
    async deleteFolder(folderId) {
      try {
        await deleteFolderService(folderId);
        this.folders = this.folders.filter((folder) => folder._id !== folderId);
      } catch (error) {
        console.error('Error deleting folder:', error);
        throw error;
      }
    },
    async moveFolder(folderId, newParentId) {
      try {
        await moveFolderService(folderId, newParentId);
      } catch (error) {
        console.error('Error moving folder:', error);
        throw error;
      }
    },
    async updateFolder(folderId, updateData) {
      try {
        const response = await updateFolderService(folderId, updateData);
        const index = this.folders.findIndex((folder) => folder._id === folderId);
        if (index !== -1) {
          this.folders[index] = response.data;
        }
        return response.data;
      } catch (error) {
        console.error('Error updating folder:', error);
        throw error;
      }
    },
  },
});

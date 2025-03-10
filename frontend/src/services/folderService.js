import axiosInstance from './axiosInstance';

export const fetchFoldersService = () => {
  return axiosInstance.get('/folders');
};

export const createFolderService = (folderData) => {
  return axiosInstance.post('/folders', folderData);
};

export const deleteFolderService = (folderId) => {
  return axiosInstance.delete(`/folders/${folderId}`);
};

export const moveFolderService = (folderId, newParentId) => {
  return axiosInstance.patch(`/folders/${folderId}/parent`, { newParentId });
};

export const updateFolderService = (folderId, updateData) => {
  return axiosInstance.put(`/folders/${folderId}`, updateData);
};

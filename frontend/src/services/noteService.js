import axiosInstance from './axiosInstance';

export const apiFetchNotes = () => {
  return axiosInstance.get('/notes');
};

export const apiCreateNote = (noteData) => {
  return axiosInstance.post('/notes', noteData);
};

export const apiMoveNote = (noteId, newFolderId) => {
  return axiosInstance.patch(`/notes/${noteId}/folder`, { newFolderId });
};

export const apiUpdateNote = (noteId, noteData) => {
  return axiosInstance.put(`/notes/${noteId}`, noteData);
};

export const apiDeleteNote = (noteId) => {
  return axiosInstance.delete(`/notes/${noteId}`);
};

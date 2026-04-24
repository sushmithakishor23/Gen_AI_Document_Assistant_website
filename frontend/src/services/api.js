import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Upload a document
export const uploadDocument = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });

  return response.data;
};

// Get list of uploaded documents
export const getDocuments = async () => {
  const response = await api.get('/documents');
  return response.data;
};

// Delete a document
export const deleteDocument = async (documentId) => {
  const response = await api.delete(`/documents/${documentId}`);
  return response.data;
};

// Send a chat message
export const sendMessage = async (message, documentId = null) => {
  const response = await api.post('/chat', {
    message,
    document_id: documentId,
  });
  return response.data;
};

// Get chat history
export const getChatHistory = async (documentId = null) => {
  const response = await api.get('/chat/history', {
    params: { document_id: documentId },
  });
  return response.data;
};

export default api;

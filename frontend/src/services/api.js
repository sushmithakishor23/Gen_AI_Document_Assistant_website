import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Add request interceptor for error logging
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      error.message = 'Request timeout. Please try again.';
    } else if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      if (status === 404) {
        error.message = 'Resource not found';
      } else if (status === 500) {
        error.message = 'Server error. Please try again later.';
      } else if (status === 413) {
        error.message = 'File too large';
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network error:', error);
      error.message = 'Network error. Please check your connection.';
    }
    return Promise.reject(error);
  }
);

// Upload a document
export const uploadDocument = async (file, onUploadProgress) => {
  try {
    // Validate file size (max 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 50MB limit');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
      timeout: 120000, // 2 minutes for large files
    });

    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Get list of uploaded documents
export const getDocuments = async () => {
  try {
    const response = await api.get('/documents');
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (documentId) => {
  try {
    if (!documentId) {
      throw new Error('Document ID is required');
    }
    const response = await api.delete(`/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// Send a chat message
export const sendMessage = async (message, documentId = null) => {
  try {
    if (!message || !message.trim()) {
      throw new Error('Message cannot be empty');
    }
    const response = await api.post('/chat', {
      message,
      document_id: documentId,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get chat history
export const getChatHistory = async (documentId = null) => {
  try {
    const response = await api.get('/chat/history', {
      params: { document_id: documentId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

// Query document with chat history
export const queryDocument = async (question, chatHistory = []) => {
  try {
    if (!question || !question.trim()) {
      throw new Error('Question cannot be empty');
    }
    const response = await api.post('/query', {
      question,
      chat_history: chatHistory,
    });
    return response.data;
  } catch (error) {
    console.error('Error querying document:', error);
    throw error;
  }
};

export default api;

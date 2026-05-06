import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, File, Trash2, X, Menu, RotateCcw } from 'lucide-react';
import { sendMessage, getChatHistory, getDocuments, deleteDocument } from '../services/api';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  // Reload chat history when document selection changes
  useEffect(() => {
    loadChatHistory();
  }, [selectedDocument]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadDocuments = async () => {
    try {
      setDocumentsLoading(true);
      const docs = await getDocuments();
      setDocuments(docs);
      setError(null);
    } catch (error) {
      console.error('Error loading documents:', error);
      setError('Failed to load documents');
    } finally {
      setDocumentsLoading(false);
    }
  };

  const loadChatHistory = async () => {
    try {
      setHistoryLoading(true);
      const history = await getChatHistory(selectedDocument);
      setMessages(history);
      setError(null);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setError('Failed to load chat history');
      setMessages([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    // Validate message length
    if (inputMessage.length > 5000) {
      setError('Message too long (max 5000 characters)');
      return;
    }

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await sendMessage(messageContent, selectedDocument);
      
      const assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.message || response.response || 'No response received',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update chat history with user question and assistant answer
      setChatHistory(prev => [
        ...prev,
        { role: 'user', content: messageContent },
        { role: 'assistant', content: assistantMessage.content }
      ]);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }

      const errorMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: error.message || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        error: true,
      };
      setMessages(prev => [...prev, errorMessage]);
      setError(error.message || 'Failed to send message');
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleSelectDocument = (docId) => {
    setSelectedDocument(docId === selectedDocument ? null : docId);
  };

  const handleDeleteDocument = async (docId, docName) => {
    if (!confirm(`Are you sure you want to delete "${docName}"?`)) {
      return;
    }

    try {
      await deleteDocument(docId);
      setSuccessMessage('Document deleted successfully');
      
      // If deleted document was selected, clear selection
      if (selectedDocument === docId) {
        setSelectedDocument(null);
      }
      
      // Reload documents list
      await loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      setError(error.message || 'Failed to delete document');
    }
  };

  const handleNewChat = () => {
    // Clear chat history and messages
    setChatHistory([]);
    setMessages([]);
    setError(null);
    setSuccessMessage('New chat started');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex-shrink-0`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Documents</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select a document to chat about
            </p>
          </div>

          {/* Documents List */}
          <div className="flex-1 overflow-y-auto p-4">
            {documentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Loading...</span>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8">
                <File className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No documents uploaded</p>
                <a
                  href="/upload"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-2 inline-block"
                >
                  Upload documents →
                </a>
              </div>
            ) : (
              <div className="space-y-2">
                {/* All Documents Option */}
                <button
                  onClick={() => handleSelectDocument(null)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedDocument === null
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400'
                      : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedDocument === null ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-200 dark:bg-gray-600'
                    }`}>
                      <File className={`w-5 h-5 ${
                        selectedDocument === null ? 'text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        selectedDocument === null ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        All Documents
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {documents.length} document{documents.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Individual Documents */}
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`relative group p-3 rounded-lg transition-colors ${
                      selectedDocument === doc.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400'
                        : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <button
                      onClick={() => handleSelectDocument(doc.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                          selectedDocument === doc.id ? 'bg-blue-100 dark:bg-blue-800' : 'bg-white dark:bg-gray-600'
                        }`}>
                          <File className={`w-5 h-5 ${
                            selectedDocument === doc.id ? 'text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0 pr-8">
                          <p className={`font-medium truncate ${
                            selectedDocument === doc.id ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
                          }`}>
                            {doc.filename}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDocument(doc.id, doc.filename);
                      }}
                      className="absolute top-3 right-3 p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Active Indicator */}
                    {selectedDocument === doc.id && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 dark:bg-blue-400 rounded-r"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  title="Show documents"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chat with AI</h1>
                {selectedDocument && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Chatting about:{' '}
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {documents.find((d) => d.id === selectedDocument)?.filename}
                    </span>
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              title="Start a new chat"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="font-medium hidden sm:inline">New Chat</span>
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Messages Container */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-y-auto p-6 mb-4">
          {historyLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">Loading chat history...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <Bot className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-lg">Start a conversation with the AI assistant</p>
              <p className="text-sm mt-2">
                {selectedDocument
                  ? 'Ask questions about the selected document'
                  : 'Ask questions about your documents or anything else!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex gap-3 max-w-[85%] md:max-w-[80%] ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user'
                          ? 'bg-blue-600 dark:bg-blue-500'
                          : message.error
                          ? 'bg-red-500 dark:bg-red-600'
                          : 'bg-gray-600 dark:bg-gray-700'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <MessageBubble message={message} isUser={message.role === 'user'} />
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 dark:bg-gray-700 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <TypingIndicator />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex gap-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none placeholder-gray-500 dark:placeholder-gray-400"
              rows="2"
              disabled={isLoading}
              maxLength={5000}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;

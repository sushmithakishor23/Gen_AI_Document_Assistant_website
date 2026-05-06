import { FileText, Sparkles, Upload, MessageSquare, Zap, Shield, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="dark:text-gray-100">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <FileText className="w-24 h-24 text-blue-600 dark:text-blue-400" />
            <Sparkles className="w-10 h-10 text-yellow-500 dark:text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to <span className="text-blue-600 dark:text-blue-400">DocAssist AI</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Your intelligent document assistant powered by Generative AI. Upload, analyze, and chat with your documents like never before.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/upload"
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Documents
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center px-8 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Start Chatting
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
              <Upload className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Easy Upload</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Drag and drop your PDF, DOC, DOCX, or TXT files with real-time progress tracking. Support for files up to 50MB.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-6">
              <Brain className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI-Powered Chat</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Ask questions about your documents and get intelligent answers with context-aware responses and chat history.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Lightning Fast</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get instant responses with advanced markdown rendering, syntax highlighting, and copy-to-clipboard functionality.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 px-4 bg-gray-50 dark:bg-gray-800/50">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          How It Works
        </h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              1
            </div>
            <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Upload Your Documents</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Drag and drop your files or click to browse. We support PDF, Word documents, and text files.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              2
            </div>
            <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Processing</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI analyzes your documents and creates a searchable knowledge base for intelligent conversations.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              3
            </div>
            <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Chat & Discover</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ask questions, get summaries, or explore insights. The AI remembers context for natural conversations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Upload your first document and experience the power of AI-assisted document analysis.
        </p>
        <Link
          to="/upload"
          className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl text-lg"
        >
          <Upload className="w-6 h-6 mr-2" />
          Get Started Now
        </Link>
      </div>
    </div>
  );
};

export default Home;

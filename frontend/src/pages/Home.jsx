import { FileText, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <FileText className="w-20 h-20 text-blue-600" />
          <Sparkles className="w-8 h-8 text-yellow-500 absolute -top-2-right-2" />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to DocAssist AI
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Your intelligent document assistant powered by Generative AI
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
          <p className="text-gray-600">
            Easily upload your documents for AI-powered analysis
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Smart Search</h3>
          <p className="text-gray-600">
            Find information quickly with intelligent search capabilities
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">AI Insights</h3>
          <p className="text-gray-600">
            Get valuable insights and summaries from your documents
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';

const MessageBubble = ({ message, isUser }) => {
  const [copied, setCopied] = useState(false);
  const { isDarkMode } = useDarkMode();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (isUser) {
    return (
      <div className="bg-blue-600 dark:bg-blue-500 text-white rounded-lg p-4 shadow-md">
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className="text-xs mt-2 text-blue-200">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    );
  }

  const isError = message.error;

  return (
    <div
      className={`rounded-lg p-4 shadow-md ${
        isError
          ? 'bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200 border border-red-200 dark:border-red-800'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
      }`}
    >
      <div className="relative group">
        {!isError && (
          <button
            onClick={handleCopy}
            className="absolute top-0 right-0 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        )}
        
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    {...props}
                    style={isDarkMode ? vscDarkPlus : oneLight}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-md my-2"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code {...props} className={`${className} px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-sm`}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
      
      <p
        className={`text-xs mt-2 ${
          isError ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        {new Date(message.timestamp).toLocaleTimeString()}
      </p>
    </div>
  );
};

export default MessageBubble;

import React from 'react';
import { useModels } from '../context/ModelContext';
import { useChat } from '../context/ChatContext';

const WelcomeScreen = () => {
  const { thinkingProvider, codingProvider } = useModels();
  const { setUserPrompt, handleThinkingRequest } = useChat();

  const examples = [
    {
      title: "Web Development",
      prompts: [
        {
          text: "Create a responsive navbar with Tailwind CSS",
          prompt: "Create a responsive navigation bar using Tailwind CSS that includes a logo, menu items, and a mobile hamburger menu. The navbar should collapse into a mobile menu on smaller screens."
        },
        {
          text: "Implement user authentication with JWT",
          prompt: "Create a complete user authentication system using JWT tokens with Node.js and Express. Include signup, login, and protected routes with proper error handling."
        }
      ]
    },
    {
      title: "Data & APIs",
      prompts: [
        {
          text: "Optimize database queries for performance",
          prompt: "Help me optimize these database queries for better performance:\n1. User posts with comments\n2. Product catalog with categories\n3. Order history with user details"
        },
        {
          text: "Build a RESTful API with Express",
          prompt: "Create a RESTful API using Express.js for a blog platform with endpoints for posts, comments, and user management. Include proper error handling and validation."
        }
      ]
    }
  ];

  const handlePromptClick = (prompt) => {
    setUserPrompt(prompt);
    handleThinkingRequest(prompt);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Welcome to Dual-AI Chat
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            One AI thinks through the solution, while another implements it
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Configuration Status */}
          <div className="flex items-center justify-center gap-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">Thinking</div>
              <div className="font-medium text-gray-900 dark:text-white">{thinkingProvider}</div>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">Coding</div>
              <div className="font-medium text-gray-900 dark:text-white">{codingProvider}</div>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="space-y-6">
            {examples.map((category, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="text-sm font-medium text-gray-900 dark:text-white">
                  {category.title}
                </h2>
                <div className="grid gap-3">
                  {category.prompts.map((item, promptIdx) => (
                    <button
                      key={promptIdx}
                      onClick={() => handlePromptClick(item.prompt)}
                      className="group text-left p-4 bg-white dark:bg-gray-800 rounded-lg 
                               border border-gray-200 dark:border-gray-700
                               hover:border-primary-500 dark:hover:border-primary-500
                               hover:bg-gray-50 dark:hover:bg-gray-700/50
                               transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {item.text}
                      </span>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400 flex items-center gap-1">
                        <span>Click to start</span>
                        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <h3 className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">
              Quick Tips
            </h3>
            <ul className="text-sm text-primary-700 dark:text-primary-300 space-y-1 list-disc list-inside">
              <li>Click any example above to get started</li>
              <li>Or type your own request in the chat</li>
              <li>Configure AI models in the sidebar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
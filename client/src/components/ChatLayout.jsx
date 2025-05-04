import React from 'react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';
import { useChat } from '../context/ChatContext';
import { useModels } from '../context/ModelContext';

const ChatLayout = () => {
  const { messages, messagesEndRef } = useChat();
  const { thinkingApiValid, codingApiValid } = useModels();

  // Loading state while providers initialize
  if (!thinkingApiValid && !codingApiValid) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-gray-900 p-4 transition-colors duration-200">
        <div className="max-w-3xl w-full space-y-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Welcome to Dual-AI Chat
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please configure your AI providers in the sidebar to get started.
          </p>
          <div className="flex justify-center">
            <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 dark:text-primary-200 dark:bg-primary-900/20">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Initializing...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Main scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative min-h-full">
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <>
              {/* Messages container with consistent width */}
              <div className="w-full">
                <ChatMessageList 
                  messages={messages}
                  messagesEndRef={messagesEndRef}
                />
              </div>

              {/* Bottom spacing */}
              <div className="h-32" />
            </>
          )}
        </div>
      </div>

      {/* Fixed input container */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="w-full max-w-3xl mx-auto px-4 pb-8">
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
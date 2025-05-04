import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useModels } from '../context/ModelContext';
import ThemeToggle from './ThemeToggle';
import { ModelSection } from './Sidebar';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { startNewChat } = useChat();
  const {
    thinkingProvider,
    setThinkingProvider,
    thinkingModel,
    setThinkingModel,
    thinkingApiKey,
    setThinkingApiKey,
    thinkingModels,
    thinkingApiValid,
    thinkingError,
    loadingThinkingModels,
    
    codingProvider,
    setCodingProvider,
    codingModel,
    setCodingModel,
    codingApiKey,
    setCodingApiKey,
    codingModels,
    codingApiValid,
    codingError,
    loadingCodingModels,
  } = useModels();

  // Search states
  const [thinkingSearch, setThinkingSearch] = useState('');
  const [codingSearch, setCodingSearch] = useState('');
  const [showThinkingSearch, setShowThinkingSearch] = useState(false);
  const [showCodingSearch, setShowCodingSearch] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest('.mobile-nav')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close menu when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
        aria-label="Menu"
      >
        <svg className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile navigation overlay */}
      <div className={`lg:hidden fixed inset-0 z-40 ${isOpen ? 'block' : 'hidden'}`}>
        <div
          className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Navigation panel */}
        <div className={`mobile-nav fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Dual-AI Chat
            </h2>
          </div>

          {/* New Chat Button */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                startNewChat();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          </div>

          {/* Model Configurations */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Thinking Model */}
            <ModelSection
              title="Thinking Model"
              provider={thinkingProvider}
              setProvider={setThinkingProvider}
              apiKey={thinkingApiKey}
              setApiKey={setThinkingApiKey}
              model={thinkingModel}
              setModel={setThinkingModel}
              models={thinkingModels}
              apiValid={thinkingApiValid}
              error={thinkingError}
              loading={loadingThinkingModels}
              searchTerm={thinkingSearch}
              setSearchTerm={setThinkingSearch}
              showSearch={showThinkingSearch}
              setShowSearch={setShowThinkingSearch}
            />

            {/* Coding Model */}
            <ModelSection
              title="Coding Model"
              provider={codingProvider}
              setProvider={setCodingProvider}
              apiKey={codingApiKey}
              setApiKey={setCodingApiKey}
              model={codingModel}
              setModel={setCodingModel}
              models={codingModels}
              apiValid={codingApiValid}
              error={codingError}
              loading={loadingCodingModels}
              searchTerm={codingSearch}
              setSearchTerm={setCodingSearch}
              showSearch={showCodingSearch}
              setShowSearch={setShowCodingSearch}
            />
          </div>

          {/* Footer */}
          <div className="mt-auto border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-xs mx-auto">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
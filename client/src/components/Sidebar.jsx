import React, { useEffect, useState, useMemo } from 'react';
import { useChat } from '../context/ChatContext';
import { useModels } from '../context/ModelContext';
import ThemeToggle from './ThemeToggle';
import { getProviders } from '../services/api';

const ModelSection = ({ 
  title, 
  provider, 
  setProvider, 
  apiKey, 
  setApiKey, 
  model, 
  setModel, 
  models = [], 
  apiValid,
  error,
  loading,
  searchTerm,
  setSearchTerm,
  showSearch,
  setShowSearch
}) => {
  // Filter models based on search
  const filteredModels = useMemo(() => {
    return models.filter(m => {
      if (!searchTerm) return true;
      const searchStr = searchTerm.toLowerCase();
      const modelName = (m.name || m.id || m).toLowerCase();
      const modelProvider = (m.provider || provider).toLowerCase();
      return modelName.includes(searchStr) || modelProvider.includes(searchStr);
    });
  }, [models, searchTerm, provider]);

  const selectedModel = model ? filteredModels.find(m => (m.id || m) === model) : null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      
      <div className="space-y-2">
        <label className="block text-sm text-gray-700 dark:text-gray-300">
          Provider
        </label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2"
        >
          {getProviders().map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-gray-700 dark:text-gray-300">
          API Key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={`Enter ${getProviders().find(p => p.id === provider)?.name} API Key`}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2"
        />
        <div className="text-sm">
          {loading ? (
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Validating API key...
            </div>
          ) : error ? (
            <span className="text-red-500">{error}</span>
          ) : apiValid ? (
            <span className="text-green-600 dark:text-green-400">✓ Connected</span>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Enter API key to fetch models</span>
          )}
        </div>
      </div>

      <div className="relative">
        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
          Model
        </label>
        <button
          type="button"
          onClick={() => setShowSearch(!showSearch)}
          className={`
            w-full flex items-center justify-between
            rounded-md border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
            p-2 hover:border-primary-500 dark:hover:border-primary-500
            transition-colors
          `}
        >
          <div className="flex items-center gap-2 truncate">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="truncate">
              {selectedModel ? selectedModel.name || selectedModel.id : 'Click to search models...'}
            </span>
          </div>
          <svg 
            className={`h-4 w-4 text-gray-400 transform transition-transform ${showSearch ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showSearch && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 shadow-lg">
            <div className="p-2 border-b border-gray-200 dark:border-gray-600">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Type to search models..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading models...</div>
              ) : filteredModels.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">No models found</div>
              ) : (
                filteredModels.map(m => (
                  <button
                    key={m.id || m}
                    onClick={() => {
                      setModel(m.id || m);
                      setShowSearch(false);
                    }}
                    className={`
                      w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600
                      ${(m.id || m) === model ? 'bg-gray-100 dark:bg-gray-600' : ''}
                    `}
                  >
                    <div className="font-medium">{m.name || m.id || m}</div>
                    {m.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{m.description}</div>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span className="font-medium">{m.provider || provider}</span>
                      {m.context_length && ` • ${m.context_length} tokens`}
                      {m.pricing && ` • ${m.pricing}`}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Sidebar = () => {
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
    validateThinkingApiKey,
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
    validateCodingApiKey,
    loadingCodingModels,
  } = useModels();

  // Search states
  const [thinkingSearch, setThinkingSearch] = useState('');
  const [codingSearch, setCodingSearch] = useState('');
  const [showThinkingSearch, setShowThinkingSearch] = useState(false);
  const [showCodingSearch, setShowCodingSearch] = useState(false);

  // Close search dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setShowThinkingSearch(false);
        setShowCodingSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={startNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Sidebar;
import React, { useState, useEffect, useMemo } from 'react';
import { useModels } from '../context/ModelContext';

const ModelConfigSection = ({
  title,
  provider,
  setProvider,
  apiKey,
  setApiKey,
  model,
  setModel,
  models,
  loadingModels,
  isDisabled
}) => {
  const { providers, getProviderName, getProviderDescription, modelErrors } = useModels();
  const [showApiKey, setShowApiKey] = useState(false);
  const [isEditing, setIsEditing] = useState(!apiKey);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModelList, setShowModelList] = useState(false);

  // Error message for this section (thinking or coding)
  const error = modelErrors?.[title.toLowerCase().split(' ')[0]];

  // Filter models based on search term
  const filteredModels = useMemo(() => {
    if (!searchTerm) return models;
    return models.filter(modelId => 
      modelId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [models, searchTerm]);

  // Close model list when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.model-selector')) {
        setShowModelList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProviderChange = (e) => {
    const newProvider = e.target.value;
    setProvider(newProvider);
    setModel(''); // Reset model when provider changes
    setSearchTerm(''); // Reset search term
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
    // Reset model selection when API key changes
    setModel('');
    setSearchTerm('');
  };

  const handleModelSelect = (modelId) => {
    setModel(modelId);
    setShowModelList(false);
    setSearchTerm('');
  };

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {error && (
          <span className="text-sm text-red-400">
            {error}
          </span>
        )}
      </div>

      {/* Provider Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Provider
        </label>
        <select
          value={provider}
          onChange={handleProviderChange}
          disabled={isDisabled}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {Object.keys(providers).map((providerId) => (
            <option key={providerId} value={providerId}>
              {getProviderName(providerId)}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-400">
          {getProviderDescription(provider)}
        </p>
      </div>

      {/* API Key Input */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-300">
            API Key
          </label>
          {apiKey && (
            <button
              onClick={toggleEditing}
              className="text-xs text-primary-400 hover:text-primary-300"
            >
              {isEditing ? 'Save' : 'Change'}
            </button>
          )}
        </div>
        <div className="relative">
          {isEditing ? (
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={handleApiKeyChange}
              disabled={isDisabled}
              placeholder={`Enter your ${getProviderName(provider)} API key`}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10"
            />
          ) : (
            <div className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-300">
              {showApiKey ? apiKey : '••••••••••••••••'}
            </div>
          )}
          <button
            type="button"
            onClick={toggleApiKeyVisibility}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-300"
          >
            {showApiKey ? (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Model Selection with Search */}
      <div className="space-y-2 model-selector">
        <label className="block text-sm font-medium text-gray-300">
          Model
        </label>
        
        {loadingModels ? (
          <div className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-400">
            Loading available models...
          </div>
        ) : models.length === 0 ? (
          <div className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-400">
            {apiKey ? 'No models available' : 'Enter API key to load models'}
          </div>
        ) : (
          <div className="relative">
            {/* Selected Model Display / Search Input */}
            <input
              type="text"
              value={showModelList ? searchTerm : model || ''}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowModelList(true);
              }}
              onClick={() => setShowModelList(true)}
              placeholder={showModelList ? "Search models..." : "Select a model"}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />

            {/* Dropdown Arrow */}
            <button
              onClick={() => setShowModelList(!showModelList)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-300"
            >
              <svg className={`h-5 w-5 transition-transform ${showModelList ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Model List Dropdown */}
            {showModelList && (
              <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredModels.length > 0 ? (
                  filteredModels.map((modelId) => (
                    <button
                      key={modelId}
                      onClick={() => handleModelSelect(modelId)}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-600 ${
                        modelId === model ? 'bg-gray-600 text-white' : 'text-gray-300'
                      }`}
                    >
                      {modelId}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-400">
                    No models match your search
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelConfigSection;
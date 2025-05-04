import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { fetchAvailableModels, validateApiKey, getProviders, AI_PROVIDERS } from '../services/api';

const ModelContext = createContext();

// Get default provider
const getDefaultProvider = () => {
  const providers = getProviders();
  return providers[0]?.id || 'openai';
};

export function ModelProvider({ children }) {
  // Thinking model state
  const [thinkingProvider, setThinkingProvider] = useLocalStorage('thinkingProvider', getDefaultProvider());
  const [thinkingModel, setThinkingModel] = useLocalStorage('thinkingModel', '');
  const [thinkingApiKey, setThinkingApiKey] = useLocalStorage('thinkingApiKey', '');
  const [thinkingModels, setThinkingModels] = useState([]);
  const [loadingThinkingModels, setLoadingThinkingModels] = useState(false);
  const [thinkingApiValid, setThinkingApiValid] = useState(false);
  const [thinkingError, setThinkingError] = useState(null);

  // Coding model state
  const [codingProvider, setCodingProvider] = useLocalStorage('codingProvider', getDefaultProvider());
  const [codingModel, setCodingModel] = useLocalStorage('codingModel', '');
  const [codingApiKey, setCodingApiKey] = useLocalStorage('codingApiKey', '');
  const [codingModels, setCodingModels] = useState([]);
  const [loadingCodingModels, setLoadingCodingModels] = useState(false);
  const [codingApiValid, setCodingApiValid] = useState(false);
  const [codingError, setCodingError] = useState(null);

  // Reset states when provider changes
  useEffect(() => {
    setThinkingModels([]);
    setThinkingModel('');
    setThinkingApiValid(false);
    setThinkingError(null);
  }, [thinkingProvider, setThinkingModel]);

  useEffect(() => {
    setCodingModels([]);
    setCodingModel('');
    setCodingApiValid(false);
    setCodingError(null);
  }, [codingProvider, setCodingModel]);

  // Validate and fetch models for thinking provider
  const validateThinkingApiKey = useCallback(async () => {
    if (!thinkingApiKey) {
      setThinkingApiValid(false);
      setThinkingModels([]);
      setThinkingError('API key is required');
      return false;
    }

    setLoadingThinkingModels(true);
    setThinkingError(null);
    
    try {
      const result = await validateApiKey(thinkingProvider, thinkingApiKey);
      console.log('Thinking validation result:', result);

      setThinkingApiValid(true);
      if (result.models?.length > 0) {
        setThinkingModels(result.models);
        if (!thinkingModel) {
          setThinkingModel(result.models[0].id);
        }
      }
      return true;
    } catch (error) {
      console.error('Thinking API key validation failed:', error);
      setThinkingError(error.message);
      setThinkingApiValid(false);
      setThinkingModels([]);
      return false;
    } finally {
      setLoadingThinkingModels(false);
    }
  }, [thinkingProvider, thinkingApiKey, thinkingModel, setThinkingModel]);

  // Validate and fetch models for coding provider
  const validateCodingApiKey = useCallback(async () => {
    if (!codingApiKey) {
      setCodingApiValid(false);
      setCodingModels([]);
      setCodingError('API key is required');
      return false;
    }

    setLoadingCodingModels(true);
    setCodingError(null);
    
    try {
      const result = await validateApiKey(codingProvider, codingApiKey);
      console.log('Coding validation result:', result);

      setCodingApiValid(true);
      if (result.models?.length > 0) {
        setCodingModels(result.models);
        if (!codingModel) {
          setCodingModel(result.models[0].id);
        }
      }
      return true;
    } catch (error) {
      console.error('Coding API key validation failed:', error);
      setCodingError(error.message);
      setCodingApiValid(false);
      setCodingModels([]);
      return false;
    } finally {
      setLoadingCodingModels(false);
    }
  }, [codingProvider, codingApiKey, codingModel, setCodingModel]);

  // Load models
  const loadThinkingModels = useCallback(async () => {
    if (!thinkingApiKey || !thinkingProvider) {
      setThinkingModels([]);
      return;
    }

    setLoadingThinkingModels(true);
    setThinkingError(null);
    
    try {
      const models = await fetchAvailableModels(thinkingProvider, thinkingApiKey);
      console.log('Thinking models loaded:', models);
      
      if (models?.length > 0) {
        setThinkingModels(models);
        if (!thinkingModel || !models.find(m => m.id === thinkingModel)) {
          setThinkingModel(models[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load thinking models:', error);
      setThinkingError(error.message);
      setThinkingModels([]);
    } finally {
      setLoadingThinkingModels(false);
    }
  }, [thinkingProvider, thinkingApiKey, thinkingModel, setThinkingModel]);

  const loadCodingModels = useCallback(async () => {
    if (!codingApiKey || !codingProvider) {
      setCodingModels([]);
      return;
    }

    setLoadingCodingModels(true);
    setCodingError(null);
    
    try {
      const models = await fetchAvailableModels(codingProvider, codingApiKey);
      console.log('Coding models loaded:', models);
      
      if (models?.length > 0) {
        setCodingModels(models);
        if (!codingModel || !models.find(m => m.id === codingModel)) {
          setCodingModel(models[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load coding models:', error);
      setCodingError(error.message);
      setCodingModels([]);
    } finally {
      setLoadingCodingModels(false);
    }
  }, [codingProvider, codingApiKey, codingModel, setCodingModel]);

  // Auto-validate API keys when they change
  useEffect(() => {
    if (thinkingApiKey) {
      validateThinkingApiKey();
    }
  }, [thinkingApiKey, validateThinkingApiKey]);

  useEffect(() => {
    if (codingApiKey) {
      validateCodingApiKey();
    }
  }, [codingApiKey, validateCodingApiKey]);

  const value = {
    thinkingProvider,
    setThinkingProvider,
    thinkingModel,
    setThinkingModel,
    thinkingApiKey,
    setThinkingApiKey,
    thinkingModels,
    loadingThinkingModels,
    thinkingApiValid,
    thinkingError,
    validateThinkingApiKey,
    loadThinkingModels,

    codingProvider,
    setCodingProvider,
    codingModel,
    setCodingModel,
    codingApiKey,
    setCodingApiKey,
    codingModels,
    loadingCodingModels,
    codingApiValid,
    codingError,
    validateCodingApiKey,
    loadCodingModels
  };

  return (
    <ModelContext.Provider value={value}>
      {children}
    </ModelContext.Provider>
  );
}

export const useModels = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useModels must be used within a ModelProvider');
  }
  return context;
};
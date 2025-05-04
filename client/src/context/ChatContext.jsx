import React, { createContext, useContext, useCallback, useMemo, useReducer, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';
import { sendRequest } from '../services/api';
import { useModels } from './ModelContext';

const ChatContext = createContext();

const ACTIONS = {
  SET_USER_PROMPT: 'SET_USER_PROMPT',
  SET_IS_GENERATING: 'SET_IS_GENERATING',
  ADD_MESSAGE: 'ADD_MESSAGE',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  SET_ACTIVE_CHAT: 'SET_ACTIVE_CHAT',
  START_NEW_CHAT: 'START_NEW_CHAT',
  DELETE_CHAT: 'DELETE_CHAT',
  STOP_GENERATION: 'STOP_GENERATION'
};

const initialState = {
  userPrompt: '',
  isGenerating: false,
  messages: [],
  savedChats: [],
  activeChat: null,
  abortController: null
};

function chatReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USER_PROMPT:
      return { ...state, userPrompt: action.payload };
    
    case ACTIONS.SET_IS_GENERATING:
      return { 
        ...state, 
        isGenerating: action.payload,
        abortController: action.payload ? new AbortController() : null
      };
    
    case ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, {
          ...action.payload,
          id: action.payload.id || uuidv4(),
          timestamp: action.payload.timestamp || Date.now()
        }]
      };
    
    case ACTIONS.UPDATE_MESSAGE:
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id ? { ...msg, ...action.payload.updates } : msg
        )
      };
    
    case ACTIONS.SET_ACTIVE_CHAT:
      return { ...state, activeChat: action.payload };
    
    case ACTIONS.START_NEW_CHAT:
      return {
        ...state,
        messages: [],
        activeChat: uuidv4(),
        isGenerating: false,
        abortController: null
      };
    
    case ACTIONS.DELETE_CHAT:
      return {
        ...state,
        savedChats: state.savedChats.filter(chat => chat.id !== action.payload),
        activeChat: state.activeChat === action.payload ? null : state.activeChat
      };

    case ACTIONS.STOP_GENERATION:
      if (state.abortController) {
        state.abortController.abort();
      }
      return {
        ...state,
        isGenerating: false,
        abortController: null
      };
    
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const messagesEndRef = useRef(null);

  const {
    thinkingProvider,
    thinkingModel,
    thinkingApiKey,
    codingProvider,
    codingModel,
    codingApiKey
  } = useModels();

  const setUserPrompt = useCallback((prompt) => {
    dispatch({ type: ACTIONS.SET_USER_PROMPT, payload: prompt });
  }, []);

  const setIsGenerating = useCallback((isGenerating) => {
    dispatch({ type: ACTIONS.SET_IS_GENERATING, payload: isGenerating });
  }, []);

  const addMessage = useCallback((message) => {
    const messageId = uuidv4();
    dispatch({
      type: ACTIONS.ADD_MESSAGE,
      payload: { ...message, id: messageId }
    });
    return messageId;
  }, []);

  const updateMessage = useCallback((id, updates) => {
    dispatch({ type: ACTIONS.UPDATE_MESSAGE, payload: { id, updates } });
  }, []);

  const stopGeneration = useCallback(() => {
    dispatch({ type: ACTIONS.STOP_GENERATION });
  }, []);

  const regenerateResponse = useCallback(async (messageId) => {
    const messageToRegenerate = state.messages.find(m => m.id === messageId);
    if (!messageToRegenerate) return;

    // Find the last user message before this one
    const messageIndex = state.messages.findIndex(m => m.id === messageId);
    const lastUserMessage = state.messages.slice(0, messageIndex).reverse()
      .find(m => m.role === 'user');

    if (!lastUserMessage) return;

    // Remove messages after the user message
    dispatch({
      type: ACTIONS.UPDATE_MESSAGE,
      payload: {
        id: messageId,
        updates: {
          content: 'Regenerating response...',
          status: 'generating'
        }
      }
    });

    // Regenerate the response
    await handleThinkingRequest(lastUserMessage.content);
  }, [state.messages]);

  const handleThinkingRequest = useCallback(async (prompt) => {
    if (!prompt.trim() || state.isGenerating) return;

    setIsGenerating(true);
    const userMessageId = addMessage({
      role: 'user',
      content: prompt,
      status: 'complete'
    });

    try {
      // Stage 1: Thinking Phase
      const thinkingMessageId = addMessage({
        role: 'assistant',
        content: 'Analyzing the request...',
        status: 'generating',
        model: thinkingModel
      });

      const thinkingResponse = await sendRequest(
        prompt,
        thinkingModel,
        thinkingProvider,
        true,
        thinkingApiKey
      );

      if (state.abortController?.signal.aborted) {
        updateMessage(thinkingMessageId, {
          content: 'Generation stopped.',
          status: 'stopped'
        });
        return;
      }

      updateMessage(thinkingMessageId, {
        content: thinkingResponse.content,
        status: 'complete'
      });

      // Stage 2: Coding Phase
      const codingMessageId = addMessage({
        role: 'assistant',
        content: 'Implementing the solution...',
        status: 'generating',
        model: codingModel
      });

      const codingResponse = await sendRequest(
        thinkingResponse.nextPrompt,
        codingModel,
        codingProvider,
        false,
        codingApiKey
      );

      if (state.abortController?.signal.aborted) {
        updateMessage(codingMessageId, {
          content: 'Generation stopped.',
          status: 'stopped'
        });
        return;
      }

      updateMessage(codingMessageId, {
        content: codingResponse.content,
        status: 'complete'
      });

    } catch (error) {
      console.error('Request failed:', error);
      const errorMessage = error.message || 'An error occurred while processing your request.';
      
      updateMessage(userMessageId, {
        status: 'error',
        error: errorMessage
      });
    } finally {
      setIsGenerating(false);
      setUserPrompt('');
    }
  }, [
    state.isGenerating,
    state.abortController,
    thinkingModel,
    thinkingProvider,
    thinkingApiKey,
    codingModel,
    codingProvider,
    codingApiKey,
    addMessage,
    updateMessage,
    setIsGenerating,
    setUserPrompt
  ]);

  const startNewChat = useCallback(() => {
    dispatch({ type: ACTIONS.START_NEW_CHAT });
  }, []);

  const deleteChat = useCallback((chatId) => {
    dispatch({ type: ACTIONS.DELETE_CHAT, payload: chatId });
  }, []);

  const value = useMemo(() => ({
    userPrompt: state.userPrompt,
    setUserPrompt,
    isGenerating: state.isGenerating,
    messages: state.messages || [],
    savedChats: state.savedChats || [],
    activeChat: state.activeChat,
    messagesEndRef,
    handleThinkingRequest,
    startNewChat,
    deleteChat,
    stopGeneration,
    regenerateResponse
  }), [
    state.userPrompt,
    state.isGenerating,
    state.messages,
    state.savedChats,
    state.activeChat,
    setUserPrompt,
    handleThinkingRequest,
    startNewChat,
    deleteChat,
    stopGeneration,
    regenerateResponse
  ]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
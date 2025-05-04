import React, { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';

const ChatInput = () => {
  const {
    userPrompt,
    setUserPrompt,
    handleThinkingRequest,
    isGenerating
  } = useChat();
  
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, [userPrompt]);

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userPrompt.trim() || isGenerating) return;
    handleThinkingRequest(userPrompt);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-black/10 dark:border-gray-700 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.3)]">
        <textarea
          ref={textareaRef}
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Dual-AI..."
          rows={1}
          className={`
            w-full pr-14 pl-4 py-3
            bg-transparent
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            resize-none
            focus:outline-none
            disabled:opacity-60 disabled:cursor-not-allowed
            text-base leading-6
          `}
          style={{
            minHeight: '24px',
            maxHeight: '200px'
          }}
          disabled={isGenerating}
        />
        
        <button
          type="submit"
          disabled={!userPrompt.trim() || isGenerating}
          className={`
            absolute right-2 bottom-2
            p-2 rounded-lg
            transition-all duration-200
            ${userPrompt.trim() && !isGenerating
              ? 'text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      {/* Input help text */}
      <div className="absolute bottom-full left-0 right-0 mb-2 px-1">
        <div className="flex justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono">Enter ↵</kbd>
            <span>to send</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono">Shift + Enter</kbd>
            <span>for new line</span>
          </span>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
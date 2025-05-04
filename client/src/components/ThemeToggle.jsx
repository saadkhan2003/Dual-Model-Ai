import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="flex items-center justify-between p-4 relative">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className={`
            relative inline-flex h-7 w-12 items-center rounded-full
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            ${darkMode ? 'bg-primary-600' : 'bg-gray-200'}
          `}
          role="switch"
          aria-checked={darkMode}
          aria-label="Toggle dark mode"
        >
          <div className="flex items-center justify-center w-full">
            {/* Sun icon */}
            <svg
              className={`absolute h-4 w-4 text-gray-400 transition-opacity duration-200 ${darkMode ? 'opacity-0' : 'opacity-100 left-2'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            
            {/* Moon icon */}
            <svg
              className={`absolute h-4 w-4 text-white transition-opacity duration-200 ${darkMode ? 'opacity-100 right-2' : 'opacity-0'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          
          <span
            className={`
              inline-block h-5 w-5 transform rounded-full bg-white shadow-lg
              transition-all duration-200 ease-in-out
              ${darkMode ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
        
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {darkMode ? 'Dark' : 'Light'} Mode
        </span>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
        <span>Shortcut:</span>
        <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          Ctrl + D
        </kbd>
      </div>
    </div>
  );
};

export default ThemeToggle;
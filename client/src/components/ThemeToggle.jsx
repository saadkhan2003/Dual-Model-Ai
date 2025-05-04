import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="p-4 flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Dark Mode
      </span>
      <button
        onClick={toggleDarkMode}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full 
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${darkMode ? 'bg-primary-600' : 'bg-gray-200'}
        `}
      >
        <span className="sr-only">
          {darkMode ? 'Disable dark mode' : 'Enable dark mode'}
        </span>
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow 
            transition-transform duration-200 ease-in-out
            ${darkMode ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>

      {/* Keyboard shortcut hint */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Shortcut: <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded">Ctrl + D</kbd>
        </span>
      </div>
    </div>
  );
};

export default ThemeToggle;
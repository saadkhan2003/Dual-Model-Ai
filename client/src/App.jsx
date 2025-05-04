import React, { useEffect } from 'react';
import ChatLayout from './components/ChatLayout';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import { useTheme } from './context/ThemeContext';

const App = () => {
  const { darkMode } = useTheme();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="h-full w-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <Sidebar />
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen min-w-0">
        <ChatLayout />
      </div>
    </div>
  );
};

export default App;
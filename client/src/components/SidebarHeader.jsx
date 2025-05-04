import React from 'react';

const SidebarHeader = ({ closeSidebar, isMobile, startNewChat }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <h1 className="text-xl font-bold">Dual Mode AI</h1>
      
      <div className="flex space-x-2">
        <button
          onClick={startNewChat}
          className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-md"
          title="New chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        {isMobile && (
          <button
            onClick={closeSidebar}
            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md"
            title="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SidebarHeader;
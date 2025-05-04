import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/chat.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { ModelProvider } from './context/ModelContext';
import { ChatProvider } from './context/ChatContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ModelProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </ModelProvider>
    </ThemeProvider>
  </React.StrictMode>
);
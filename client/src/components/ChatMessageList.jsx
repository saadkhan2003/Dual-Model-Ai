import React, { useEffect } from 'react';
import ChatMessage from './ChatMessage';

const ChatMessageList = ({ messages = [], messagesEndRef }) => {
  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // If no messages, return null
  if (!messages || messages.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-3xl mx-auto">
        {messages.map((message, index) => (
          message && (
            <div key={message.id || index} className="w-full">
              <ChatMessage message={message} />
            </div>
          )
        ))}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
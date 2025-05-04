import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/chat.css';

const ChatMessage = ({ message }) => {
  const { regenerateResponse, stopGeneration } = useChat();
  const [showActions, setShowActions] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedBlocks, setCopiedBlocks] = useState({});

  if (!message) return null;

  const copyToClipboard = async (text, blockId = null) => {
    try {
      await navigator.clipboard.writeText(text);
      if (blockId) {
        setCopiedBlocks(prev => ({ ...prev, [blockId]: true }));
        setTimeout(() => {
          setCopiedBlocks(prev => ({ ...prev, [blockId]: false }));
        }, 2000);
      } else {
        setCopiedMessage(true);
        setTimeout(() => setCopiedMessage(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRegenerate = () => {
    regenerateResponse(message.id);
  };

  const formatTimestamp = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  // Custom renderer for code blocks
  const renderers = {
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const lang = match ? match[1] : '';
      const codeString = String(children).replace(/\n$/, '');
      const blockId = `${message.id}-${node.position || Math.random()}`;

      if (!inline && lang) {
        return (
          <div className="code-block">
            <div className="code-header">
              <span className="language-tag">{lang}</span>
              <button
                onClick={() => copyToClipboard(codeString, blockId)}
                className={`copy-button action-button ${
                  copiedBlocks[blockId] ? 'bg-green-500/20 text-green-400' : 'bg-black/20 text-gray-400'
                }`}
                title={copiedBlocks[blockId] ? "Copied!" : "Copy code"}
              >
                {copiedBlocks[blockId] ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )}
              </button>
            </div>
            <div className="p-4">
              <SyntaxHighlighter
                language={lang}
                style={vscDarkPlus}
                showLineNumbers={true}
                startingLineNumber={1}
                customStyle={{
                  margin: 0,
                  padding: 0,
                  background: 'transparent',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                }}
                lineNumberStyle={{
                  minWidth: '2.5em',
                  paddingRight: '1em',
                  fontSize: '0.85rem',
                  opacity: '0.5',
                  textAlign: 'right',
                  userSelect: 'none',
                }}
                {...props}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          </div>
        );
      }

      return (
        <code className="px-1.5 py-0.5 mx-0.5 rounded bg-[#2d2d2d] font-mono text-[0.9em]">
          {children}
        </code>
      );
    }
  };

  return (
    <div className={`message message-${message.role} message-fade-in`}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className={`avatar avatar-${message.role}`}>
              {message.role === 'user' ? (
                <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {message.status === 'error' ? (
              <div className="text-red-400 bg-red-500/10 p-4 rounded-xl">
                Error: {message.error}
              </div>
            ) : message.status === 'generating' ? (
              <div className="flex items-center gap-2">
                <span>{message.content || 'Generating response...'}</span>
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ) : (
              <>
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown components={renderers}>{message.content}</ReactMarkdown>
                </div>

                <div className="message-timestamp">
                  {formatTimestamp(message.timestamp)}
                </div>

                {message.role === 'assistant' && message.status === 'complete' && (
                  <div className="flex items-center gap-2 mt-6">
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className={`action-button ${
                        copiedMessage ? 'bg-green-500/20 text-green-400' : 'bg-[#2d2d2d] text-gray-300'
                      }`}
                    >
                      {copiedMessage ? (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Copy response
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleRegenerate}
                      className="action-button bg-[#2d2d2d] text-gray-300"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Regenerate response
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {message.status === 'generating' && (
        <button
          onClick={() => stopGeneration()}
          className="absolute right-4 top-4 p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-black/30"
          title="Stop generating"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatMessage;
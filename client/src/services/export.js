const formatMessagesAsText = (messages) => {
  return messages
    .map(msg => {
      const role = msg.role === 'user' ? 'User' : 'Assistant';
      return `${role}:\n${msg.content}\n`;
    })
    .join('\n---\n\n');
};

const formatMessagesAsMarkdown = (messages) => {
  return messages
    .map(msg => {
      const role = msg.role === 'user' ? '### 👤 User' : `### 🤖 Assistant (${msg.model})`;
      return `${role}\n\n${msg.content}`;
    })
    .join('\n\n---\n\n');
};

const formatMessagesAsHTML = (messages) => {
  const html = messages
    .map(msg => {
      const role = msg.role === 'user' ? 'User' : `Assistant (${msg.model})`;
      const icon = msg.role === 'user' ? '👤' : '🤖';
      return `
        <div class="message ${msg.role}">
          <h3>${icon} ${role}</h3>
          <div class="content">
            ${msg.content}
          </div>
        </div>
      `;
    })
    .join('\n<hr>\n');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Chat Export</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.5;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: #f9fafb;
          color: #111827;
        }
        .message {
          margin: 2rem 0;
          padding: 1rem;
          border-radius: 0.5rem;
        }
        .message h3 {
          margin-top: 0;
          color: #4b5563;
        }
        .user {
          background: #f3f4f6;
        }
        .assistant {
          background: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .content {
          white-space: pre-wrap;
        }
        pre {
          background: #1e1e1e;
          color: #d4d4d4;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
        }
        hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2rem 0;
        }
        @media (prefers-color-scheme: dark) {
          body {
            background: #111827;
            color: #f9fafb;
          }
          .message h3 {
            color: #9ca3af;
          }
          .user {
            background: #1f2937;
          }
          .assistant {
            background: #374151;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          }
          hr {
            border-top-color: #374151;
          }
        }
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `;
};

export const exportChat = (messages, format) => {
  let content;
  let filename;
  let type;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  switch (format) {
    case 'text':
      content = formatMessagesAsText(messages);
      filename = `chat-export-${timestamp}.txt`;
      type = 'text/plain';
      break;
    case 'markdown':
      content = formatMessagesAsMarkdown(messages);
      filename = `chat-export-${timestamp}.md`;
      type = 'text/markdown';
      break;
    case 'html':
      content = formatMessagesAsHTML(messages);
      filename = `chat-export-${timestamp}.html`;
      type = 'text/html';
      break;
    default:
      throw new Error('Unsupported export format');
  }

  // Create download link
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  // Cleanup
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
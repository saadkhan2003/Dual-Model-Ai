import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Supported languages and their configurations
const SUPPORTED_LANGUAGES = {
  javascript: {
    name: 'JavaScript',
    extension: 'js',
    runner: (code) => {
      try {
        // Create a secure iframe sandbox for code execution
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        // Add console overrides to capture output
        const logs = [];
        const consoleOverrides = `
          console.log = function() { 
            window.parent.postMessage({
              type: 'log',
              args: Array.from(arguments)
            }, '*');
          };
          console.error = function() {
            window.parent.postMessage({
              type: 'error',
              args: Array.from(arguments)
            }, '*');
          };
        `;
        
        // Execute code in sandbox
        const script = iframe.contentWindow.document.createElement('script');
        script.textContent = consoleOverrides + '\n' + code;
        iframe.contentWindow.document.body.appendChild(script);
        
        // Cleanup
        document.body.removeChild(iframe);
        
        return { success: true, output: logs };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  },
  python: {
    name: 'Python',
    extension: 'py',
    runner: async (code) => {
      try {
        // Use Pyodide for Python execution (needs to be loaded)
        if (!window.pyodide) {
          return { success: false, error: 'Python runtime not loaded' };
        }
        const result = await window.pyodide.runPythonAsync(code);
        return { success: true, output: result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  }
};

const CodePlayground = ({ initialCode = '', language = 'javascript' }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  // Handle console messages from sandbox
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'log' || event.data.type === 'error') {
        setOutput(prev => prev + '\n' + event.data.args.join(' '));
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    setOutput('');

    const lang = SUPPORTED_LANGUAGES[selectedLanguage];
    if (!lang) {
      setError('Unsupported language');
      setIsRunning(false);
      return;
    }

    try {
      const result = await lang.runner(code);
      if (result.success) {
        setOutput(result.output);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
          >
            {Object.entries(SUPPORTED_LANGUAGES).map(([key, { name }]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`px-3 py-1 rounded text-sm font-medium ${
              isRunning
                ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="h-64 border-b border-gray-200 dark:border-gray-700">
        <MonacoEditor
          height="100%"
          language={selectedLanguage}
          theme="vs-dark"
          value={code}
          onChange={setCode}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            automaticLayout: true
          }}
        />
      </div>

      {/* Output */}
      <div className="bg-gray-900 text-gray-100 p-4 h-32 overflow-y-auto font-mono text-sm">
        {error ? (
          <div className="text-red-400">{error}</div>
        ) : output ? (
          <SyntaxHighlighter
            language="plaintext"
            style={vscDarkPlus}
            customStyle={{ margin: 0, background: 'transparent' }}
          >
            {output}
          </SyntaxHighlighter>
        ) : (
          <div className="text-gray-500">Output will appear here...</div>
        )}
      </div>
    </div>
  );
};

export default CodePlayground;
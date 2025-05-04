import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFileSelect }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = () => {
      // Do not process files larger than 10MB
      if (acceptedFiles[0].size > 10 * 1024 * 1024) {
        alert('File too large. Maximum size is 10MB.');
        return;
      }
      
      const fileContent = reader.result;
      onFileSelect({
        name: acceptedFiles[0].name,
        type: acceptedFiles[0].type,
        content: fileContent,
        size: acceptedFiles[0].size
      });
    };
    
    reader.readAsText(acceptedFiles[0]);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/*': ['.txt', '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.html', '.css', '.json'],
      'application/json': ['.json'],
      'application/javascript': ['.js', '.jsx'],
      'text/typescript': ['.ts', '.tsx'],
      'text/python': ['.py'],
      'text/html': ['.html'],
      'text/css': ['.css']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  return (
    <div 
      {...getRootProps()}
      className={`
        p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragActive 
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
          : 'border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        {isDragActive ? (
          <p className="text-primary-600 dark:text-primary-400">Drop the file here</p>
        ) : (
          <div className="space-y-2">
            <svg 
              className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">
              Drag & drop a file here, or click to select
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Supported files: .txt, .js, .jsx, .ts, .tsx, .py, .java, .cpp, .c, .cs, .html, .css, .json
              <br />
              Maximum size: 10MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
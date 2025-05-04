import { useState, useEffect } from 'react';

// Simple token counting function (approximate)
const countTokens = (text) => {
  if (!text) return 0;
  
  // Split on whitespace and punctuation
  const tokens = text.match(/\b\w+\b/g) || [];
  
  // Add additional tokens for code blocks, special characters, etc.
  const specialChars = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
  const codeBlocks = (text.match(/```[\s\S]*?```/g) || []).length;
  const newlines = (text.match(/\n/g) || []).length;
  
  // Approximate token count:
  // - Each word is roughly one token
  // - Special characters might be split into separate tokens
  // - Code blocks have additional overhead
  // - New lines and formatting contribute to token count
  const totalTokens = tokens.length + 
    Math.ceil(specialChars * 0.5) + 
    (codeBlocks * 3) + 
    Math.ceil(newlines * 0.5);

  return totalTokens;
};

export const useTokenCount = (text) => {
  const [tokenCount, setTokenCount] = useState(0);

  useEffect(() => {
    const count = countTokens(text);
    setTokenCount(count);
  }, [text]);

  return tokenCount;
};

// Utility function to format token count
export const formatTokenCount = (count) => {
  if (count < 1000) return count.toString();
  return `${(count / 1000).toFixed(1)}k`;
};

// Constants for token limits
export const TOKEN_LIMITS = {
  GPT3: 4096,
  GPT4: 8192,
  CLAUDE: 100000
};
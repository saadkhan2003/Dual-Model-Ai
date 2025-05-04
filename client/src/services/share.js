// Function to generate a unique share ID
const generateShareId = () => {
  return 'share_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Function to compress chat data for sharing
const compressChat = (messages) => {
  // Remove unnecessary fields and prepare for sharing
  const shareableMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content,
    model: msg.model,
    status: msg.status === 'complete' ? msg.status : undefined,
  })).filter(msg => msg.content && msg.role);

  // Convert to string and compress
  const chatString = JSON.stringify(shareableMessages);
  
  // Use base64 encoding for the compressed string
  return btoa(encodeURIComponent(chatString));
};

// Function to decompress shared chat data
const decompressChat = (compressed) => {
  try {
    // Decode the base64 string
    const chatString = decodeURIComponent(atob(compressed));
    
    // Parse the JSON data
    const messages = JSON.parse(chatString);
    
    // Validate the data structure
    if (!Array.isArray(messages)) {
      throw new Error('Invalid share data format');
    }
    
    // Add missing fields and validate messages
    return messages.map((msg, index) => ({
      id: Date.now() + index,
      role: msg.role,
      content: msg.content,
      model: msg.model || 'Unknown Model',
      status: msg.status || 'complete'
    }));
  } catch (error) {
    throw new Error('Failed to load shared chat: ' + error.message);
  }
};

// Function to create a shareable URL
const createShareableUrl = (chatData) => {
  const compressed = compressChat(chatData);
  const shareId = generateShareId();
  
  // Store in localStorage for temporary sharing
  const shareData = {
    id: shareId,
    data: compressed,
    createdAt: Date.now(),
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days expiry
  };
  
  // Get existing shares
  const existingShares = JSON.parse(localStorage.getItem('shares') || '[]');
  
  // Remove expired shares
  const validShares = existingShares.filter(share => share.expiresAt > Date.now());
  
  // Add new share
  validShares.push(shareData);
  
  // Update localStorage
  localStorage.setItem('shares', JSON.stringify(validShares));
  
  // Generate shareable URL
  const baseUrl = window.location.origin;
  return `${baseUrl}/share/${shareId}`;
};

// Function to load shared chat data
const loadSharedChat = (shareId) => {
  // Get shares from localStorage
  const shares = JSON.parse(localStorage.getItem('shares') || '[]');
  
  // Find the specific share
  const share = shares.find(s => s.id === shareId);
  
  if (!share) {
    throw new Error('Shared chat not found or has expired');
  }
  
  if (share.expiresAt < Date.now()) {
    // Remove expired share
    localStorage.setItem('shares', 
      JSON.stringify(shares.filter(s => s.id !== shareId))
    );
    throw new Error('Shared chat has expired');
  }
  
  // Decompress and return the chat data
  return decompressChat(share.data);
};

// Function to copy share link to clipboard
const copyShareLink = async (url) => {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Failed to copy share link:', error);
    return false;
  }
};

// Export functions
export {
  createShareableUrl,
  loadSharedChat,
  copyShareLink
};
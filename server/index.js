const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-netlify-app.netlify.app']  // Update with your Netlify URL
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(bodyParser.json());

// API key middleware
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required' });
  }
  // Add your API key validation logic here
  next();
};

// Basic health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Protected routes
app.use('/api', checkApiKey);

// Your existing route handlers
app.post('/api/chat/thinking', async (req, res) => {
  try {
    // Your thinking route logic
    res.json({ message: 'Thinking endpoint' });
  } catch (error) {
    console.error('Error in thinking endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/chat/coding', async (req, res) => {
  try {
    // Your coding route logic
    res.json({ message: 'Coding endpoint' });
  } catch (error) {
    console.error('Error in coding endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Environment:', process.env.NODE_ENV);
});

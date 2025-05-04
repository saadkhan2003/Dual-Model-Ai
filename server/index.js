const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: [
    'https://dualaimodel.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Pre-flight requests
app.options('*', cors(corsOptions));

app.use(bodyParser.json());

// API key middleware
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required' });
  }
  // Add your API key validation logic here
  if (apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid API key' });
  }
};

// Validate API key endpoint
app.post('/validate-key', cors(corsOptions), async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const { provider, apiKey: providerApiKey } = req.body;

  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required' });
  }
  
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  try {
    let models = [];
    const axios = require('axios');

    // Fetch models based on provider
    switch (provider) {
      case 'openai':
        const openaiResponse = await axios.get('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${providerApiKey}` }
        });
        models = openaiResponse.data.data.map(model => ({
          id: model.id,
          name: model.id,
          provider: 'OpenAI'
        }));
        break;

      case 'anthropic':
        models = [
          { id: 'claude-2', name: 'Claude 2', provider: 'Anthropic' },
          { id: 'claude-instant', name: 'Claude Instant', provider: 'Anthropic' }
        ];
        // Validate key by making a simple API call
        await axios.post('https://api.anthropic.com/v1/messages',
          { model: 'claude-2', max_tokens: 1, messages: [{ role: 'user', content: 'test' }] },
          { headers: { 'x-api-key': providerApiKey, 'anthropic-version': '2023-06-01' } }
        );
        break;

      case 'openrouter':
        const openrouterResponse = await axios.get('https://openrouter.ai/api/v1/models', {
          headers: { 'Authorization': `Bearer ${providerApiKey}` }
        });
        models = openrouterResponse.data.data.map(model => ({
          id: model.id,
          name: model.name,
          provider: 'OpenRouter'
        }));
        break;

      // Add other providers as needed

      default:
        // For testing, return mock models if provider not implemented
        models = [
          { id: `${provider}-model-1`, name: 'Model 1', provider },
          { id: `${provider}-model-2`, name: 'Model 2', provider }
        ];
    }

    res.json({ valid: true, models });
  } catch (error) {
    console.error('Provider API error:', error.response?.data || error.message);
    res.status(401).json({ error: 'Invalid provider API key' });
  }
});

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
  console.log('Allowed origins:', corsOptions.origin);
});

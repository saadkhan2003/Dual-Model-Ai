const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    headers: {
      ...req.headers,
      'x-api-key': req.headers['x-api-key'] ? '[REDACTED]' : undefined
    }
  });
  next();
});

// Provider configurations
const providerConfigs = {
  openrouter: {
    baseURL: 'https://openrouter.ai/api/v1',
    modelsEndpoint: '/models',
    headers: apiKey => ({
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000'
    })
  },
  openai: {
    baseURL: 'https://api.openai.com/v1',
    modelsEndpoint: '/models',
    headers: apiKey => ({ 'Authorization': `Bearer ${apiKey}` })
  },
  anthropic: {
    baseURL: 'https://api.anthropic.com/v1',
    modelsEndpoint: '/messages',
    headers: apiKey => ({
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    })
  },
  deepseek: {
    baseURL: 'https://api.deepseek.ai/v1',
    modelsEndpoint: '/models',
    headers: apiKey => ({ 'Authorization': `Bearer ${apiKey}` })
  },
  mistral: {
    baseURL: 'https://api.mistral.ai/v1',
    modelsEndpoint: '/models',
    headers: apiKey => ({ 'Authorization': `Bearer ${apiKey}` })
  },
  gemini: {
    baseURL: 'https://generativelanguage.googleapis.com/v1',
    modelsEndpoint: '/models',
    headers: apiKey => ({ 'x-goog-api-key': apiKey })
  },
  qwen: {
    baseURL: 'https://api.qwen.ai/v1',
    modelsEndpoint: '/models',
    headers: apiKey => ({ 'Authorization': `Bearer ${apiKey}` })
  }
};

// Fetch models from provider
async function fetchModelsFromProvider(provider, apiKey) {
  console.log(`Fetching models for provider: ${provider}`);
  const config = providerConfigs[provider];
  
  if (!config) {
    throw new Error(`Unsupported provider: ${provider}`);
  }

  try {
    const response = await axios.get(
      `${config.baseURL}${config.modelsEndpoint}`,
      { headers: config.headers(apiKey) }
    );

    console.log(`Models response from ${provider}:`, response.data);

    let models = [];
    if (provider === 'openrouter') {
      models = response.data.data;
    } else {
      models = response.data.data || response.data.models || [];
    }

    // Format all models consistently
    const formattedModels = models.map(model => ({
      id: model.id || model,
      name: model.name || model.id || model,
      provider: model.provider || provider,
      description: model.description,
      context_length: model.context_length,
      pricing: model.pricing
    }));

    console.log(`Processed models for ${provider}:`, formattedModels);
    return formattedModels;
  } catch (error) {
    console.error(`Error fetching models from ${provider}:`, error.response?.data || error);
    throw error;
  }
}

// Validate API key
app.post('/validate-key', async (req, res) => {
  const { provider, apiKey } = req.body;
  console.log(`Validating API key for provider: ${provider}`);

  try {
    const models = await fetchModelsFromProvider(provider, apiKey);
    console.log(`Validation successful for ${provider}, found ${models.length} models`);
    
    res.json({
      valid: true,
      models
    });
  } catch (error) {
    console.error(`Validation failed for ${provider}:`, error.response?.data || error);
    res.json({
      valid: false,
      models: [],
      error: error.response?.data?.error?.message || error.message
    });
  }
});

// Get models
app.post('/models', async (req, res) => {
  const { provider, apiKey } = req.body;
  console.log(`Fetching models for provider: ${provider}`);

  try {
    const models = await fetchModelsFromProvider(provider, apiKey);
    res.json(models);
  } catch (error) {
    console.error(`Failed to fetch models for ${provider}:`, error.response?.data || error);
    res.status(500).json({
      error: 'Failed to fetch models',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  const { prompt, model, provider, systemPrompt } = req.body;
  const apiKey = req.headers['x-api-key'];
  console.log(`Chat request for provider: ${provider}, model: ${model}`);

  try {
    const config = providerConfigs[provider];
    if (!config) {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    const response = await axios.post(
      `${config.baseURL}/chat/completions`,
      {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      },
      { headers: config.headers(apiKey) }
    );

    console.log(`Chat response received for ${provider}`);
    res.json({
      content: response.data.choices[0].message.content
    });
  } catch (error) {
    console.error(`Chat error for ${provider}:`, error.response?.data || error);
    res.status(500).json({
      error: 'Chat request failed',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Supported providers:', Object.keys(providerConfigs).join(', '));
});

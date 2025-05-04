const axios = require('axios');
require('dotenv').config();

// Test functions for each provider
const debugProviders = {
  async openai(apiKey) {
    const response = await axios.get('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    return response.data.data.map(model => model.id);
  },

  async anthropic(apiKey) {
    const response = await axios.get('https://api.anthropic.com/v1/models', {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }
    });
    return response.data.models.map(model => model.id);
  },

  async openrouter(apiKey) {
    const response = await axios.get('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000'
      }
    });
    return response.data.data.map(model => model.id);
  },

  async deepseek(apiKey) {
    const response = await axios.get('https://api.deepseek.com/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    return response.data.models.map(model => model.id);
  },

  async gemini(apiKey) {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    return response.data.models.map(model => model.name);
  },

  async mistral(apiKey) {
    const response = await axios.get('https://api.mistral.ai/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    return response.data.data.map(model => model.id);
  }
};

// Test a specific provider
async function testProvider(provider, apiKey) {
  try {
    console.log(`Testing ${provider}...`);
    const models = await debugProviders[provider](apiKey);
    console.log(`Success! Available models for ${provider}:`, models);
    return models;
  } catch (error) {
    console.error(`Error testing ${provider}:`, {
      message: error.message,
      response: error.response?.data
    });
    return null;
  }
}

// Test all providers
async function testAllProviders() {
  const results = {};
  for (const provider of Object.keys(debugProviders)) {
    const apiKey = process.env[`${provider.toUpperCase()}_API_KEY`];
    if (apiKey) {
      results[provider] = await testProvider(provider, apiKey);
    } else {
      console.log(`Skipping ${provider} - no API key found`);
    }
  }
  return results;
}

// Run tests if called directly
if (require.main === module) {
  console.log('Starting provider tests...');
  testAllProviders()
    .then(results => {
      console.log('\nTest Results:');
      Object.entries(results).forEach(([provider, models]) => {
        console.log(`\n${provider}:`);
        if (models) {
          console.log('✓ Success');
          console.log('Models:', models);
        } else {
          console.log('✗ Failed');
        }
      });
    })
    .catch(error => {
      console.error('Test failed:', error);
    });
}

module.exports = {
  testProvider,
  testAllProviders
};
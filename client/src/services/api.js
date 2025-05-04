import axios from 'axios';

const SERVER_API_KEY = 'dual_ai_chat_secret_key_2024';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'x-api-key': SERVER_API_KEY
  }
});

// Provider configurations
export const AI_PROVIDERS = {
  openrouter: {
    name: 'OpenRouter',
    baseURL: 'https://openrouter.ai/api/v1'
  },
  openai: {
    name: 'OpenAI',
    baseURL: 'https://api.openai.com/v1'
  },
  anthropic: {
    name: 'Anthropic',
    baseURL: 'https://api.anthropic.com/v1'
  },
  deepseek: {
    name: 'DeepSeek',
    baseURL: 'https://api.deepseek.ai/v1'
  },
  mistral: {
    name: 'Mistral AI',
    baseURL: 'https://api.mistral.ai/v1'
  },
  gemini: {
    name: 'Google Gemini',
    baseURL: 'https://generativelanguage.googleapis.com/v1'
  },
  qwen: {
    name: 'Qwen',
    baseURL: 'https://api.qwen.ai/v1'
  }
};

// System prompts
const THINKING_SYSTEM_PROMPT = `You are an expert system analyst and problem solver. Your role is to:
1. Break down the user's request into clear, logical steps
2. Identify potential challenges and considerations
3. Suggest best practices and approaches
4. Provide high-level architectural decisions
5. Focus on reasoning and analysis ONLY
6. DO NOT provide any actual code or implementation details`;

const CODING_SYSTEM_PROMPT = `You are an expert programmer. Using the analysis provided:
1. Implement the solution with clean, production-ready code
2. Follow best practices and conventions
3. Include helpful comments
4. Handle edge cases and errors
5. Structure the code logically`;

export const sendRequest = async (prompt, model, provider, isThinking = false, apiKey) => {
  console.log('Sending request:', { provider, model, isThinking });
  
  try {
    const response = await api.post('/chat', {
      prompt,
      model,
      provider,
      systemPrompt: isThinking ? THINKING_SYSTEM_PROMPT : CODING_SYSTEM_PROMPT
    }, {
      headers: { 'x-api-key': apiKey }
    });

    if (isThinking) {
      return {
        ...response.data,
        nextPrompt: `Based on this analysis:\n\n${response.data.content}\n\nImplement the solution with production-ready code.`
      };
    }

    return response.data;
  } catch (error) {
    console.error('API request failed:', error.response?.data || error);
    throw new Error(error.response?.data?.message || error.message || 'Request failed');
  }
};

export const validateApiKey = async (provider, apiKey) => {
  console.log('Validating API key:', { provider });
  
  try {
    const response = await api.post('/validate-key', {
      provider,
      apiKey
    });

    console.log('Validation response:', response.data);
    
    if (!response.data.valid) {
      throw new Error(response.data.error || 'Invalid API key');
    }

    return {
      valid: true,
      models: response.data.models
    };
  } catch (error) {
    console.error('API key validation failed:', error.response?.data || error);
    throw new Error(error.response?.data?.error || error.message || 'Validation failed');
  }
};

export const fetchAvailableModels = async (provider, apiKey) => {
  console.log('Fetching models:', { provider });
  
  try {
    const response = await api.post('/models', {
      provider,
      apiKey
    });

    console.log('Models response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch models:', error.response?.data || error);
    throw new Error(error.response?.data?.error || error.message || 'Failed to fetch models');
  }
};

// Get provider list
export const getProviders = () => {
  return Object.entries(AI_PROVIDERS).map(([id, data]) => ({
    id,
    name: data.name,
    baseURL: data.baseURL
  }));
};

// Add request/response logging
api.interceptors.request.use(request => {
  const { url, method, data, headers } = request;
  console.log('API Request:', {
    url,
    method,
    data,
    headers: {
      ...headers,
      'x-api-key': headers['x-api-key'] ? '[REDACTED]' : undefined
    }
  });
  return request;
});

api.interceptors.response.use(
  response => {
    const { config: { url }, status, data } = response;
    console.log('API Response:', { url, status, data });
    return response;
  },
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);
const { testAllProviders, testProvider } = require('./debug');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Test a specific provider if provided as argument
const providerArg = process.argv[2];

async function runTests() {
  console.log(`${colors.cyan}🔍 Starting API Provider Tests${colors.reset}\n`);

  if (providerArg) {
    // Test single provider
    console.log(`${colors.blue}Testing specific provider: ${providerArg}${colors.reset}`);
    const apiKey = process.env[`${providerArg.toUpperCase()}_API_KEY`];
    
    if (!apiKey) {
      console.log(`${colors.red}❌ No API key found for ${providerArg}${colors.reset}`);
      console.log(`Please set ${providerArg.toUpperCase()}_API_KEY in your .env file`);
      return;
    }

    const result = await testProvider(providerArg, apiKey);
    displayResult(providerArg, result);
  } else {
    // Test all providers
    console.log(`${colors.blue}Testing all configured providers...${colors.reset}\n`);
    const results = await testAllProviders();
    
    let successCount = 0;
    let failCount = 0;

    Object.entries(results).forEach(([provider, models]) => {
      if (models) {
        successCount++;
      } else {
        failCount++;
      }
      displayResult(provider, models);
    });

    // Display summary
    console.log('\n' + '='.repeat(50));
    console.log(`${colors.cyan}Test Summary:${colors.reset}`);
    console.log(`${colors.green}✓ Successful: ${successCount}${colors.reset}`);
    console.log(`${colors.red}✗ Failed: ${failCount}${colors.reset}`);
  }
}

function displayResult(provider, models) {
  console.log('\n' + '-'.repeat(50));
  console.log(`${colors.magenta}Provider: ${provider}${colors.reset}`);
  
  if (models) {
    console.log(`${colors.green}✓ Connection Successful${colors.reset}`);
    console.log('\nAvailable Models:');
    models.forEach(model => {
      console.log(`${colors.cyan}• ${model}${colors.reset}`);
    });
  } else {
    console.log(`${colors.red}✗ Connection Failed${colors.reset}`);
    console.log('Check your API key and network connection');
  }
}

// Run tests and handle errors
runTests().catch(error => {
  console.error(`${colors.red}Test execution failed:${colors.reset}`, error);
  process.exit(1);
});

// Usage instructions
if (process.argv.length > 3) {
  console.log(`
${colors.yellow}Usage:${colors.reset}
  Test all providers:
    node test-providers.js

  Test specific provider:
    node test-providers.js <provider>

${colors.yellow}Available providers:${colors.reset}
  • openai
  • anthropic
  • openrouter
  • deepseek
  • gemini
  • mistral

${colors.yellow}Example:${colors.reset}
  node test-providers.js openai
`);
  process.exit(0);
}
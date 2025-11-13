import { URL } from 'url';

interface Intent {
  keyword: string;
  response: string;
}

interface CustomerSupportBotOptions {
  pricingPageUrl?: string;
  helpCenterUrl?: string;
  maxLength?: number;
}

const defaultOptions: CustomerSupportBotOptions = {
  pricingPageUrl: 'https://climatescorepro.com/pricing',
  helpCenterUrl: 'https://climatescorepro.com/help-center',
  maxLength: 140,
};

/**
 * Simulates a customer support interaction.
 * It takes a user query and returns a canned response.
 * In a real application, this would be replaced with a more sophisticated AI-powered chatbot.
 *
 * @param {string} userQuery - The user's query.
 * @param {CustomerSupportBotOptions} options - Optional configuration for the bot.
 * @returns {string} - The bot's response.
 * @throws {TypeError} - If userQuery is not a string.
 */
function customerSupportBot(userQuery: string, options: CustomerSupportBotOptions = {}): string {
  if (typeof userQuery !== 'string') {
    throw new TypeError('userQuery must be a string.');
  }

  const mergedOptions: CustomerSupportBotOptions = {
    ...defaultOptions,
    ...options,
  };

  const { pricingPageUrl, helpCenterUrl, maxLength } = mergedOptions;

  const intents: Intent[] = [
    { keyword: 'carbon footprint', response: 'ClimateScore Pro helps small businesses calculate their carbon footprint and generate sustainability reports.' },
    { keyword: 'compliance', response: 'Our platform automates ESG reporting and helps you meet supplier requirements.' },
    { keyword: 'pricing', response: `Please visit our pricing page at ${pricingPageUrl} for detailed information.` },
    { keyword: 'certification badges', response: 'ClimateScore Pro provides certification badges to showcase your sustainability efforts.' },
    { keyword: 'green marketing', response: 'Unlock green marketing opportunities with our platform’s sustainability insights.' },
    { keyword: 'support|help', response: 'How can I help you today? Please be specific with your request.' },
    { keyword: 'hello|hi', response: 'Hello! Welcome to ClimateScore Pro support. How can I assist you?' },
  ];

  let response = intents
    .filter(({ keyword }) => {
      try {
        const regex = new RegExp(keyword, 'i'); // 'i' flag for case-insensitive matching
        return regex.test(userQuery);
      } catch (error) {
        console.error(`Invalid regex keyword: ${keyword}.  Error: ${error}`);
        return false; // Skip invalid regex patterns to prevent bot failure
      }
    })
    .map(({ response }) => response)
    .join('\n');

  // Handle unrecognized queries and provide a fallback response
  if (!response) {
    try {
      const helpCenterURL = new URL(helpCenterUrl || defaultOptions.helpCenterUrl!); // Use non-null assertion as defaultOptions provides a fallback
      response = `I'm sorry, I don't understand your request. Please try rephrasing your question or visit our help center at ${helpCenterURL.href}.`;
    } catch (error) {
      console.error(`Invalid helpCenterUrl: ${helpCenterUrl}. Error: ${error}`);
      response = 'I\'m sorry, I don\'t understand your request. Please try rephrasing your question.'; // Generic fallback
    }
  }

  // Add accessibility improvements by ensuring the response is meaningful and concise
  if (response.length > (maxLength || defaultOptions.maxLength!)) {
    response = response.slice(0, (maxLength || defaultOptions.maxLength!)) + '...';
  }

  return response;
}

export { customerSupportBot, CustomerSupportBotOptions };

import { URL } from 'url';

interface Intent {
  keyword: string;
  response: string;
}

interface CustomerSupportBotOptions {
  pricingPageUrl?: string;
  helpCenterUrl?: string;
  maxLength?: number;
}

const defaultOptions: CustomerSupportBotOptions = {
  pricingPageUrl: 'https://climatescorepro.com/pricing',
  helpCenterUrl: 'https://climatescorepro.com/help-center',
  maxLength: 140,
};

/**
 * Simulates a customer support interaction.
 * It takes a user query and returns a canned response.
 * In a real application, this would be replaced with a more sophisticated AI-powered chatbot.
 *
 * @param {string} userQuery - The user's query.
 * @param {CustomerSupportBotOptions} options - Optional configuration for the bot.
 * @returns {string} - The bot's response.
 * @throws {TypeError} - If userQuery is not a string.
 */
function customerSupportBot(userQuery: string, options: CustomerSupportBotOptions = {}): string {
  if (typeof userQuery !== 'string') {
    throw new TypeError('userQuery must be a string.');
  }

  const mergedOptions: CustomerSupportBotOptions = {
    ...defaultOptions,
    ...options,
  };

  const { pricingPageUrl, helpCenterUrl, maxLength } = mergedOptions;

  const intents: Intent[] = [
    { keyword: 'carbon footprint', response: 'ClimateScore Pro helps small businesses calculate their carbon footprint and generate sustainability reports.' },
    { keyword: 'compliance', response: 'Our platform automates ESG reporting and helps you meet supplier requirements.' },
    { keyword: 'pricing', response: `Please visit our pricing page at ${pricingPageUrl} for detailed information.` },
    { keyword: 'certification badges', response: 'ClimateScore Pro provides certification badges to showcase your sustainability efforts.' },
    { keyword: 'green marketing', response: 'Unlock green marketing opportunities with our platform’s sustainability insights.' },
    { keyword: 'support|help', response: 'How can I help you today? Please be specific with your request.' },
    { keyword: 'hello|hi', response: 'Hello! Welcome to ClimateScore Pro support. How can I assist you?' },
  ];

  let response = intents
    .filter(({ keyword }) => {
      try {
        const regex = new RegExp(keyword, 'i'); // 'i' flag for case-insensitive matching
        return regex.test(userQuery);
      } catch (error) {
        console.error(`Invalid regex keyword: ${keyword}.  Error: ${error}`);
        return false; // Skip invalid regex patterns to prevent bot failure
      }
    })
    .map(({ response }) => response)
    .join('\n');

  // Handle unrecognized queries and provide a fallback response
  if (!response) {
    try {
      const helpCenterURL = new URL(helpCenterUrl || defaultOptions.helpCenterUrl!); // Use non-null assertion as defaultOptions provides a fallback
      response = `I'm sorry, I don't understand your request. Please try rephrasing your question or visit our help center at ${helpCenterURL.href}.`;
    } catch (error) {
      console.error(`Invalid helpCenterUrl: ${helpCenterUrl}. Error: ${error}`);
      response = 'I\'m sorry, I don\'t understand your request. Please try rephrasing your question.'; // Generic fallback
    }
  }

  // Add accessibility improvements by ensuring the response is meaningful and concise
  if (response.length > (maxLength || defaultOptions.maxLength!)) {
    response = response.slice(0, (maxLength || defaultOptions.maxLength!)) + '...';
  }

  return response;
}

export { customerSupportBot, CustomerSupportBotOptions };
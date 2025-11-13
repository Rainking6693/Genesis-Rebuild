import { CleanWebpartMessage } from './CleanWebpartMessage'; // Assuming you have a utility function to clean the message

type UserMessage = {
  text: string;
  userId: string;
};

type Response = {
  text: string;
  userId: string;
};

function processUserMessage(message: UserMessage): Response | null {
  const cleanedMessage = CleanWebpartMessage(message.text);

  if (!cleanedMessage) {
    return null; // Return null if the message cannot be processed
  }

  // Edge cases handling
  const lowerCaseMessage = cleanedMessage.toLowerCase();

  if (lowerCaseMessage.includes('help') || lowerCaseMessage.includes('assistance')) {
    return {
      text: 'Welcome! I am here to help you with any questions or issues you might have. Please type your question or issue, and I will do my best to assist you.',
      userId: message.userId,
    };
  }

  if (lowerCaseMessage.includes('sign up') || lowerCaseMessage.includes('register')) {
    return {
      text: 'To sign up, please visit our website at [Your Website URL] and follow the registration process.',
      userId: message.userId,
    };
  }

  if (lowerCaseMessage.includes('login') || lowerCaseMessage.includes('account')) {
    return {
      text: 'To access your account, please visit our website at [Your Website URL] and log in using your credentials.',
      userId: message.userId,
    };
  }

  if (lowerCaseMessage.includes('content') || lowerCaseMessage.includes('subscription')) {
    return {
      text: 'For content-related inquiries, please visit our Help Center at [Your Help Center URL]. You can find answers to frequently asked questions and contact our support team if needed.',
      userId: message.userId,
    };
  }

  // Default response
  return {
    text: 'I'm sorry, I didn\'t understand that. Could you please rephrase your question or issue?',
    userId: message.userId,
  };
}

import { CleanWebpartMessage } from './CleanWebpartMessage'; // Assuming you have a utility function to clean the message

type UserMessage = {
  text: string;
  userId: string;
};

type Response = {
  text: string;
  userId: string;
};

function processUserMessage(message: UserMessage): Response | null {
  const cleanedMessage = CleanWebpartMessage(message.text);

  if (!cleanedMessage) {
    return null; // Return null if the message cannot be processed
  }

  // Edge cases handling
  const lowerCaseMessage = cleanedMessage.toLowerCase();

  if (lowerCaseMessage.includes('help') || lowerCaseMessage.includes('assistance')) {
    return {
      text: 'Welcome! I am here to help you with any questions or issues you might have. Please type your question or issue, and I will do my best to assist you.',
      userId: message.userId,
    };
  }

  if (lowerCaseMessage.includes('sign up') || lowerCaseMessage.includes('register')) {
    return {
      text: 'To sign up, please visit our website at [Your Website URL] and follow the registration process.',
      userId: message.userId,
    };
  }

  if (lowerCaseMessage.includes('login') || lowerCaseMessage.includes('account')) {
    return {
      text: 'To access your account, please visit our website at [Your Website URL] and log in using your credentials.',
      userId: message.userId,
    };
  }

  if (lowerCaseMessage.includes('content') || lowerCaseMessage.includes('subscription')) {
    return {
      text: 'For content-related inquiries, please visit our Help Center at [Your Help Center URL]. You can find answers to frequently asked questions and contact our support team if needed.',
      userId: message.userId,
    };
  }

  // Default response
  return {
    text: 'I'm sorry, I didn\'t understand that. Could you please rephrase your question or issue?',
    userId: message.userId,
  };
}
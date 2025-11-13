// src/components/CustomerSupportBot.tsx

import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial bot message
    addBotMessage("Hello! How can I help you today?");
  }, []);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const addUserMessage = (text: string) => {
    addMessage({ text, isUser: true });
  };

  const addBotMessage = (text: string) => {
    addMessage({ text, isUser: false });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputText.trim()) {
      return; // Prevent sending empty messages
    }

    const userMessage = inputText.trim();
    addUserMessage(userMessage);
    setInputText('');
    setIsLoading(true);

    try {
      // Simulate an API call to a backend service for bot response
      const botResponse = await getBotResponse(userMessage);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error fetching bot response:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate an API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple logic for demonstration purposes
        if (userMessage.toLowerCase().includes("order")) {
          resolve("I can help you with order tracking and returns. What's your order number?");
        } else if (userMessage.toLowerCase().includes("shipping")) {
          resolve("Our standard shipping time is 3-5 business days.");
        } else if (userMessage.toLowerCase().includes("return")) {
          resolve("You can initiate a return within 30 days of purchase. Please visit our returns page.");
        } else {
          resolve("I'm sorry, I don't understand. Please ask another question.");
        }
      }, 1500); // Simulate API delay
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
          >
            {message.text}
          </div>
        ))}
        {isLoading && <div className="bot-message">Loading...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default CustomerSupportBot;

// src/components/CustomerSupportBot.tsx

import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial bot message
    addBotMessage("Hello! How can I help you today?");
  }, []);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const addUserMessage = (text: string) => {
    addMessage({ text, isUser: true });
  };

  const addBotMessage = (text: string) => {
    addMessage({ text, isUser: false });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputText.trim()) {
      return; // Prevent sending empty messages
    }

    const userMessage = inputText.trim();
    addUserMessage(userMessage);
    setInputText('');
    setIsLoading(true);

    try {
      // Simulate an API call to a backend service for bot response
      const botResponse = await getBotResponse(userMessage);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error fetching bot response:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate an API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple logic for demonstration purposes
        if (userMessage.toLowerCase().includes("order")) {
          resolve("I can help you with order tracking and returns. What's your order number?");
        } else if (userMessage.toLowerCase().includes("shipping")) {
          resolve("Our standard shipping time is 3-5 business days.");
        } else if (userMessage.toLowerCase().includes("return")) {
          resolve("You can initiate a return within 30 days of purchase. Please visit our returns page.");
        } else {
          resolve("I'm sorry, I don't understand. Please ask another question.");
        }
      }, 1500); // Simulate API delay
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
          >
            {message.text}
          </div>
        ))}
        {isLoading && <div className="bot-message">Loading...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default CustomerSupportBot;
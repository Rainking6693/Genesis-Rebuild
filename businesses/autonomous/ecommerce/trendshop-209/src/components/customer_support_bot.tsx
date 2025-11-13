// src/components/CustomerSupportBot.tsx

import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial bot message
    addBotMessage("Welcome to our support! How can I help you today?");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    addUserMessage(input);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate an API call to a backend service for bot response
      const botResponse = await getBotResponse(input);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error fetching bot response:", error);
      addBotMessage("Sorry, I'm having trouble connecting. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple rule-based responses (replace with actual API call)
    if (userMessage.toLowerCase().includes("order status")) {
      return "To check your order status, please provide your order number.";
    } else if (userMessage.toLowerCase().includes("return policy")) {
      return "Our return policy allows returns within 30 days of purchase.";
    } else if (userMessage.toLowerCase().includes("shipping")) {
      return "We offer free shipping on orders over $50.";
    } else {
      return "I'm sorry, I don't understand. Please try rephrasing your question.";
    }
  };

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="bot-message">Loading...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-area">
        <input
          type="text"
          value={input}
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
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial bot message
    addBotMessage("Welcome to our support! How can I help you today?");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    addUserMessage(input);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate an API call to a backend service for bot response
      const botResponse = await getBotResponse(input);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error fetching bot response:", error);
      addBotMessage("Sorry, I'm having trouble connecting. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple rule-based responses (replace with actual API call)
    if (userMessage.toLowerCase().includes("order status")) {
      return "To check your order status, please provide your order number.";
    } else if (userMessage.toLowerCase().includes("return policy")) {
      return "Our return policy allows returns within 30 days of purchase.";
    } else if (userMessage.toLowerCase().includes("shipping")) {
      return "We offer free shipping on orders over $50.";
    } else {
      return "I'm sorry, I don't understand. Please try rephrasing your question.";
    }
  };

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="bot-message">Loading...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-area">
        <input
          type="text"
          value={input}
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
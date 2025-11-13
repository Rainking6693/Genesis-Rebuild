// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Hello! How can I help you today?");
  }, []);

  const addMessage = (text: string, isUser: boolean) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser }]);
  };

  const addBotMessage = (text: string) => {
    addMessage(text, false);
  };

  const addUserMessage = (text: string) => {
    addMessage(text, true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = input.trim();
    addUserMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await getBotResponse(userMessage);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error fetching bot response:", error);
      addBotMessage("Sorry, I'm having trouble connecting. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (message: string): Promise<string> => {
    // Simulate API call to a backend service or AI model
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple rule-based responses for demonstration
        if (message.toLowerCase().includes("order")) {
          resolve("To track your order, please provide your order number.");
        } else if (message.toLowerCase().includes("return")) {
          resolve("Our return policy allows returns within 30 days of purchase.");
        } else if (message.toLowerCase().includes("shipping")) {
          resolve("We offer standard and expedited shipping options.");
        } else {
          resolve("I'm sorry, I don't understand. Please ask another question.");
        }
      }, 1000); // Simulate network latency
    });
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

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Hello! How can I help you today?");
  }, []);

  const addMessage = (text: string, isUser: boolean) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser }]);
  };

  const addBotMessage = (text: string) => {
    addMessage(text, false);
  };

  const addUserMessage = (text: string) => {
    addMessage(text, true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = input.trim();
    addUserMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await getBotResponse(userMessage);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error fetching bot response:", error);
      addBotMessage("Sorry, I'm having trouble connecting. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (message: string): Promise<string> => {
    // Simulate API call to a backend service or AI model
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple rule-based responses for demonstration
        if (message.toLowerCase().includes("order")) {
          resolve("To track your order, please provide your order number.");
        } else if (message.toLowerCase().includes("return")) {
          resolve("Our return policy allows returns within 30 days of purchase.");
        } else if (message.toLowerCase().includes("shipping")) {
          resolve("We offer standard and expedited shipping options.");
        } else {
          resolve("I'm sorry, I don't understand. Please ask another question.");
        }
      }, 1000); // Simulate network latency
    });
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
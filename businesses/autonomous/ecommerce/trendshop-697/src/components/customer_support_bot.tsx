// src/components/CustomerSupportBot.tsx

import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching from a knowledge base
  const fetchAnswer = async (question: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Simulate a knowledge base lookup
        if (question.toLowerCase().includes('shipping')) {
          resolve("Shipping usually takes 3-5 business days.");
        } else if (question.toLowerCase().includes('return')) {
          resolve("Our return policy allows returns within 30 days.");
        } else {
          resolve("I'm sorry, I don't have information on that topic. Please contact our support team.");
        }
      }, 1000); // Simulate network latency
    });
  };

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userInput.trim()) {
      return; // Prevent sending empty messages
    }

    const userMessage: Message = { text: userInput, isUser: true };
    setMessages([...messages, userMessage]);
    setUserInput('');

    try {
      const answer = await fetchAnswer(userInput);
      const botMessage: Message = { text: answer, isUser: false };
      setMessages([...messages, userMessage, botMessage]);
      setError(null); // Clear any previous errors
    } catch (e: any) {
      console.error("Error fetching answer:", e);
      setError("Failed to get an answer. Please try again later.");
      const errorMessage: Message = { text: "I'm experiencing technical difficulties. Please try again later.", isUser: false };
      setMessages([...messages, userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial bot greeting
    const greetingMessage: Message = { text: "Hello! How can I help you today?", isUser: false };
    setMessages([greetingMessage]);
  }, []);

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="message bot-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          placeholder="Ask me anything..."
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
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching from a knowledge base
  const fetchAnswer = async (question: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Simulate a knowledge base lookup
        if (question.toLowerCase().includes('shipping')) {
          resolve("Shipping usually takes 3-5 business days.");
        } else if (question.toLowerCase().includes('return')) {
          resolve("Our return policy allows returns within 30 days.");
        } else {
          resolve("I'm sorry, I don't have information on that topic. Please contact our support team.");
        }
      }, 1000); // Simulate network latency
    });
  };

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userInput.trim()) {
      return; // Prevent sending empty messages
    }

    const userMessage: Message = { text: userInput, isUser: true };
    setMessages([...messages, userMessage]);
    setUserInput('');

    try {
      const answer = await fetchAnswer(userInput);
      const botMessage: Message = { text: answer, isUser: false };
      setMessages([...messages, userMessage, botMessage]);
      setError(null); // Clear any previous errors
    } catch (e: any) {
      console.error("Error fetching answer:", e);
      setError("Failed to get an answer. Please try again later.");
      const errorMessage: Message = { text: "I'm experiencing technical difficulties. Please try again later.", isUser: false };
      setMessages([...messages, userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial bot greeting
    const greetingMessage: Message = { text: "Hello! How can I help you today?", isUser: false };
    setMessages([greetingMessage]);
  }, []);

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="message bot-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          placeholder="Ask me anything..."
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
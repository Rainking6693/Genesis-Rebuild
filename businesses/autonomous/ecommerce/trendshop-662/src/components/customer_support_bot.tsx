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

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Hello! How can I help you today?");
  }, []);

  const addBotMessage = (text: string) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser: false }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser: true }]);
  };

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!userInput.trim()) return;

    addUserMessage(userInput);
    setUserInput('');
    setIsLoading(true);

    try {
      const botResponse = await processUserQuery(userInput);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error processing user query:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const processUserQuery = async (query: string): Promise<string> => {
    // Simulate an API call to a backend service or use a simple rule-based system
    // This is a placeholder and should be replaced with actual logic
    return new Promise((resolve) => {
      setTimeout(() => {
        if (query.toLowerCase().includes("order")) {
          resolve("To check your order status, please provide your order number.");
        } else if (query.toLowerCase().includes("return")) {
          resolve("Our return policy allows returns within 30 days of purchase.");
        } else {
          resolve("I'm sorry, I don't understand. Please try rephrasing your question.");
        }
      }, 500); // Simulate a delay
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
        {isLoading && <div className="bot-message">Thinking...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Send</button>
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

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Hello! How can I help you today?");
  }, []);

  const addBotMessage = (text: string) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser: false }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser: true }]);
  };

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!userInput.trim()) return;

    addUserMessage(userInput);
    setUserInput('');
    setIsLoading(true);

    try {
      const botResponse = await processUserQuery(userInput);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error processing user query:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const processUserQuery = async (query: string): Promise<string> => {
    // Simulate an API call to a backend service or use a simple rule-based system
    // This is a placeholder and should be replaced with actual logic
    return new Promise((resolve) => {
      setTimeout(() => {
        if (query.toLowerCase().includes("order")) {
          resolve("To check your order status, please provide your order number.");
        } else if (query.toLowerCase().includes("return")) {
          resolve("Our return policy allows returns within 30 days of purchase.");
        } else {
          resolve("I'm sorry, I don't understand. Please try rephrasing your question.");
        }
      }, 500); // Simulate a delay
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
        {isLoading && <div className="bot-message">Thinking...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
};

export default CustomerSupportBot;
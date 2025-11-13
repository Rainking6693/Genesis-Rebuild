// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Hi there! How can I help you today?");
  }, []);

  const addBotMessage = (text: string) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser: false }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser: true }]);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    addUserMessage(userInput);
    const userMessage = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate an API call to a backend service for processing the user's query
      const response = await simulateBackendCall(userMessage);
      addBotMessage(response);
    } catch (error: any) {
      console.error("Error processing user query:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBackendCall = async (query: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (query.toLowerCase().includes("order status")) {
          resolve("Your order is currently being processed and is expected to ship within 24 hours.");
        } else if (query.toLowerCase().includes("return policy")) {
          resolve("Our return policy allows for returns within 30 days of purchase.");
        } else {
          resolve("I'm sorry, I don't have information on that. Please contact our support team for further assistance.");
        }
      }, 500); // Simulate a 500ms delay
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user' : 'bot'}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="message bot">Loading...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-area">
        <input
          type="text"
          value={userInput}
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
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Hi there! How can I help you today?");
  }, []);

  const addBotMessage = (text: string) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser: false }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser: true }]);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    addUserMessage(userInput);
    const userMessage = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate an API call to a backend service for processing the user's query
      const response = await simulateBackendCall(userMessage);
      addBotMessage(response);
    } catch (error: any) {
      console.error("Error processing user query:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBackendCall = async (query: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (query.toLowerCase().includes("order status")) {
          resolve("Your order is currently being processed and is expected to ship within 24 hours.");
        } else if (query.toLowerCase().includes("return policy")) {
          resolve("Our return policy allows for returns within 30 days of purchase.");
        } else {
          resolve("I'm sorry, I don't have information on that. Please contact our support team for further assistance.");
        }
      }, 500); // Simulate a 500ms delay
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user' : 'bot'}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="message bot">Loading...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-area">
        <input
          type="text"
          value={userInput}
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
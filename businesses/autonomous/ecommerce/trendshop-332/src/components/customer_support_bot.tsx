// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Welcome to our support! How can I help you today?");
  }, []);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const addBotMessage = (text: string) => {
    addMessage({ text: text, sender: 'bot' });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userInput.trim()) {
      return; // Prevent sending empty messages
    }

    addUserMessage(userInput);
    setUserInput('');
    setIsLoading(true);

    try {
      const botResponse = await processUserMessage(userInput);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error processing user message:", error);
      addBotMessage("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addUserMessage = (text: string) => {
    addMessage({ text: text, sender: 'user' });
  };

  const processUserMessage = async (message: string): Promise<string> => {
    // Simulate API call to a backend service or NLP engine
    return new Promise((resolve) => {
      setTimeout(() => {
        // Placeholder for actual NLP processing and e-commerce integration
        if (message.toLowerCase().includes("order status")) {
          resolve("To check your order status, please provide your order number.");
        } else if (message.toLowerCase().includes("return policy")) {
          resolve("Our return policy allows returns within 30 days of purchase.");
        } else {
          resolve("I'm sorry, I don't understand.  Please try rephrasing your question.");
        }
      }, 500); // Simulate network latency
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
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
  sender: 'user' | 'bot';
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Welcome to our support! How can I help you today?");
  }, []);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const addBotMessage = (text: string) => {
    addMessage({ text: text, sender: 'bot' });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userInput.trim()) {
      return; // Prevent sending empty messages
    }

    addUserMessage(userInput);
    setUserInput('');
    setIsLoading(true);

    try {
      const botResponse = await processUserMessage(userInput);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error processing user message:", error);
      addBotMessage("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addUserMessage = (text: string) => {
    addMessage({ text: text, sender: 'user' });
  };

  const processUserMessage = async (message: string): Promise<string> => {
    // Simulate API call to a backend service or NLP engine
    return new Promise((resolve) => {
      setTimeout(() => {
        // Placeholder for actual NLP processing and e-commerce integration
        if (message.toLowerCase().includes("order status")) {
          resolve("To check your order status, please provide your order number.");
        } else if (message.toLowerCase().includes("return policy")) {
          resolve("Our return policy allows returns within 30 days of purchase.");
        } else {
          resolve("I'm sorry, I don't understand.  Please try rephrasing your question.");
        }
      }, 500); // Simulate network latency
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
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
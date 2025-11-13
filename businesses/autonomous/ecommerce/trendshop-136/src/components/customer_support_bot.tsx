// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Hello! How can I help you today?");
  }, []);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prevMessages => [...prevMessages, { text, sender }]);
  };

  const addBotMessage = (text: string) => {
    addMessage(text, 'bot');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    addMessage(userMessage, 'user');
    setInput('');
    setIsLoading(true);

    try {
      // Simulate API call to a backend service for bot response
      const botResponse = await getBotResponse(userMessage);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error getting bot response:", error);
      addBotMessage("Sorry, I'm having trouble understanding. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple logic for demonstration
        if (userMessage.toLowerCase().includes("track order")) {
          resolve("Please provide your order number.");
        } else if (userMessage.toLowerCase().includes("return")) {
          resolve("You can initiate a return from your order history page.");
        } else {
          resolve("I'm sorry, I don't have information on that.  Please contact our support team.");
        }
      }, 1000);
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="message bot">Loading...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
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
  sender: 'user' | 'bot';
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Hello! How can I help you today?");
  }, []);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prevMessages => [...prevMessages, { text, sender }]);
  };

  const addBotMessage = (text: string) => {
    addMessage(text, 'bot');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    addMessage(userMessage, 'user');
    setInput('');
    setIsLoading(true);

    try {
      // Simulate API call to a backend service for bot response
      const botResponse = await getBotResponse(userMessage);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error getting bot response:", error);
      addBotMessage("Sorry, I'm having trouble understanding. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple logic for demonstration
        if (userMessage.toLowerCase().includes("track order")) {
          resolve("Please provide your order number.");
        } else if (userMessage.toLowerCase().includes("return")) {
          resolve("You can initiate a return from your order history page.");
        } else {
          resolve("I'm sorry, I don't have information on that.  Please contact our support team.");
        }
      }, 1000);
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="message bot">Loading...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
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
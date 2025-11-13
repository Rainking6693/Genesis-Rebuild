// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Welcome to our e-commerce store! How can I help you today?");
  }, []);

  const addMessage = (sender: 'user' | 'bot', text: string) => {
    setMessages(prevMessages => [...prevMessages, { sender, text }]);
  };

  const addUserMessage = (text: string) => {
    addMessage('user', text);
  };

  const addBotMessage = (text: string) => {
    addMessage('bot', text);
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
      // Simulate an API call to a backend service for bot response
      const botResponse = await getBotResponse(userInput);
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
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Basic logic for bot responses (replace with actual API call)
          if (userMessage.toLowerCase().includes("order status")) {
            resolve("To check your order status, please provide your order number.");
          } else if (userMessage.toLowerCase().includes("return policy")) {
            resolve("Our return policy allows returns within 30 days of purchase.");
          } else if (userMessage.toLowerCase().includes("shipping")) {
            resolve("We offer standard and expedited shipping options.");
          } else {
            resolve("I'm sorry, I don't have information on that. Please contact our support team for further assistance.");
          }
        } catch (err) {
          reject("Error processing your request.");
        }

      }, 1500); // Simulate API latency
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
  sender: 'user' | 'bot';
  text: string;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Welcome to our e-commerce store! How can I help you today?");
  }, []);

  const addMessage = (sender: 'user' | 'bot', text: string) => {
    setMessages(prevMessages => [...prevMessages, { sender, text }]);
  };

  const addUserMessage = (text: string) => {
    addMessage('user', text);
  };

  const addBotMessage = (text: string) => {
    addMessage('bot', text);
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
      // Simulate an API call to a backend service for bot response
      const botResponse = await getBotResponse(userInput);
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
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Basic logic for bot responses (replace with actual API call)
          if (userMessage.toLowerCase().includes("order status")) {
            resolve("To check your order status, please provide your order number.");
          } else if (userMessage.toLowerCase().includes("return policy")) {
            resolve("Our return policy allows returns within 30 days of purchase.");
          } else if (userMessage.toLowerCase().includes("shipping")) {
            resolve("We offer standard and expedited shipping options.");
          } else {
            resolve("I'm sorry, I don't have information on that. Please contact our support team for further assistance.");
          }
        } catch (err) {
          reject("Error processing your request.");
        }

      }, 1500); // Simulate API latency
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
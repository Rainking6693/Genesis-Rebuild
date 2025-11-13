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
    addBotMessage("Welcome to our store! How can I help you today?");
  }, []);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const addBotMessage = (text: string) => {
    addMessage({ sender: 'bot', text: text });
  };

  const addUserMessage = (text: string) => {
    addMessage({ sender: 'user', text: text });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    addUserMessage(userMessage);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate fetching a response from a backend or AI model
      const botResponse = await simulateBotResponse(userMessage);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error fetching bot response:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate an API call or AI model processing
    return new Promise((resolve) => {
      setTimeout(() => {
        if (userMessage.toLowerCase().includes("order status")) {
          resolve("Your order is currently being processed and is expected to ship within 24 hours.");
        } else if (userMessage.toLowerCase().includes("return policy")) {
          resolve("Our return policy allows for returns within 30 days of purchase. Please see our website for details.");
        } else {
          resolve("I'm sorry, I don't have information on that. Please contact our support team for further assistance.");
        }
      }, 1000); // Simulate a 1-second delay
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="message-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.text}
          </div>
        ))}
        {isLoading && <div className="bot-message">Thinking...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
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
    addBotMessage("Welcome to our store! How can I help you today?");
  }, []);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const addBotMessage = (text: string) => {
    addMessage({ sender: 'bot', text: text });
  };

  const addUserMessage = (text: string) => {
    addMessage({ sender: 'user', text: text });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    addUserMessage(userMessage);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate fetching a response from a backend or AI model
      const botResponse = await simulateBotResponse(userMessage);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error fetching bot response:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate an API call or AI model processing
    return new Promise((resolve) => {
      setTimeout(() => {
        if (userMessage.toLowerCase().includes("order status")) {
          resolve("Your order is currently being processed and is expected to ship within 24 hours.");
        } else if (userMessage.toLowerCase().includes("return policy")) {
          resolve("Our return policy allows for returns within 30 days of purchase. Please see our website for details.");
        } else {
          resolve("I'm sorry, I don't have information on that. Please contact our support team for further assistance.");
        }
      }, 1000); // Simulate a 1-second delay
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="message-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.text}
          </div>
        ))}
        {isLoading && <div className="bot-message">Thinking...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
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
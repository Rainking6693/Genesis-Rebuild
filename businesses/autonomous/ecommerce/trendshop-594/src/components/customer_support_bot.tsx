// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    const userMessage: Message = { text: userInput, isUser: true };
    setMessages([...messages, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate an API call to a backend service for bot responses
      const botResponse = await getBotResponse(userInput);
      const botMessage: Message = { text: botResponse, isUser: false };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error: any) {
      console.error("Error getting bot response:", error);
      const errorMessage: Message = { text: "Sorry, I'm having trouble connecting. Please try again later.", isUser: false };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate an API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple keyword-based responses
        if (userMessage.toLowerCase().includes("order")) {
          resolve("To track your order, please provide your order number.");
        } else if (userMessage.toLowerCase().includes("return")) {
          resolve("To initiate a return, please visit our returns page.");
        } else if (userMessage.toLowerCase().includes("shipping")) {
          resolve("Shipping times vary depending on your location. Please check our shipping policy for more details.");
        } else {
          resolve("I'm sorry, I don't understand. Please try rephrasing your question.");
        }
      }, 1000); // Simulate API delay
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="bot-message">Thinking...</div>}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
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
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    const userMessage: Message = { text: userInput, isUser: true };
    setMessages([...messages, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate an API call to a backend service for bot responses
      const botResponse = await getBotResponse(userInput);
      const botMessage: Message = { text: botResponse, isUser: false };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error: any) {
      console.error("Error getting bot response:", error);
      const errorMessage: Message = { text: "Sorry, I'm having trouble connecting. Please try again later.", isUser: false };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate an API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple keyword-based responses
        if (userMessage.toLowerCase().includes("order")) {
          resolve("To track your order, please provide your order number.");
        } else if (userMessage.toLowerCase().includes("return")) {
          resolve("To initiate a return, please visit our returns page.");
        } else if (userMessage.toLowerCase().includes("shipping")) {
          resolve("Shipping times vary depending on your location. Please check our shipping policy for more details.");
        } else {
          resolve("I'm sorry, I don't understand. Please try rephrasing your question.");
        }
      }, 1000); // Simulate API delay
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="bot-message">Thinking...</div>}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default CustomerSupportBot;
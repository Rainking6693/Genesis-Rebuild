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
    if (!userInput.trim()) return;

    const userMessage: Message = { text: userInput, isUser: true };
    setMessages([...messages, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const botResponse = await getBotResponse(userInput);
      const botMessage: Message = { text: botResponse, isUser: false };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error: any) {
      console.error("Error getting bot response:", error);
      const errorMessage: Message = { text: "Sorry, I encountered an error. Please try again.", isUser: false };
      setMessages([...messages, userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (message: string): Promise<string> => {
    // Simulate API call to a backend service or use a pre-defined response based on keywords.
    // Replace this with actual API call to your backend.
    return new Promise((resolve) => {
      setTimeout(() => {
        if (message.toLowerCase().includes("order status")) {
          resolve("Your order is currently being processed and is expected to ship within 24 hours.");
        } else if (message.toLowerCase().includes("product information")) {
          resolve("Please provide the product name or ID for more information.");
        } else if (message.toLowerCase().includes("return policy")) {
          resolve("Our return policy allows returns within 30 days of purchase. Please see our website for details.");
        } else {
          resolve("I'm sorry, I don't understand. Please ask a different question.");
        }
      }, 500); // Simulate network latency
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
    if (!userInput.trim()) return;

    const userMessage: Message = { text: userInput, isUser: true };
    setMessages([...messages, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const botResponse = await getBotResponse(userInput);
      const botMessage: Message = { text: botResponse, isUser: false };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error: any) {
      console.error("Error getting bot response:", error);
      const errorMessage: Message = { text: "Sorry, I encountered an error. Please try again.", isUser: false };
      setMessages([...messages, userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (message: string): Promise<string> => {
    // Simulate API call to a backend service or use a pre-defined response based on keywords.
    // Replace this with actual API call to your backend.
    return new Promise((resolve) => {
      setTimeout(() => {
        if (message.toLowerCase().includes("order status")) {
          resolve("Your order is currently being processed and is expected to ship within 24 hours.");
        } else if (message.toLowerCase().includes("product information")) {
          resolve("Please provide the product name or ID for more information.");
        } else if (message.toLowerCase().includes("return policy")) {
          resolve("Our return policy allows returns within 30 days of purchase. Please see our website for details.");
        } else {
          resolve("I'm sorry, I don't understand. Please ask a different question.");
        }
      }, 500); // Simulate network latency
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
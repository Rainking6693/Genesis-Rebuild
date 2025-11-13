// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Welcome to our store! How can I help you today?");
  }, []);

  const addMessage = (message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const addBotMessage = (text: string) => {
    addMessage({ sender: 'bot', text: text, timestamp: new Date() });
  };

  const addUserMessage = (text: string) => {
    addMessage({ sender: 'user', text: text, timestamp: new Date() });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    addUserMessage(userMessage);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call to a backend service for bot response
      const botResponse = await getBotResponse(userMessage);
      addBotMessage(botResponse);
    } catch (err: any) {
      console.error("Error fetching bot response:", err);
      setError("Sorry, I'm having trouble connecting to the server. Please try again later.");
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate an API call to a backend service
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple rule-based responses for demonstration
        if (userMessage.toLowerCase().includes("order status")) {
          resolve("To check your order status, please provide your order number.");
        } else if (userMessage.toLowerCase().includes("return policy")) {
          resolve("Our return policy allows returns within 30 days of purchase.");
        } else if (userMessage.toLowerCase().includes("shipping")) {
          resolve("We offer free shipping on orders over $50.");
        } else {
          resolve("I'm sorry, I don't understand. Please try rephrasing your question or contact our support team.");
        }
      }, 1000); // Simulate network latency
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <span className="message-text">{message.text}</span>
            <span className="message-time">{message.timestamp.toLocaleTimeString()}</span>
          </div>
        ))}
        {isLoading && <div className="message bot">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
};

export default CustomerSupportBot;
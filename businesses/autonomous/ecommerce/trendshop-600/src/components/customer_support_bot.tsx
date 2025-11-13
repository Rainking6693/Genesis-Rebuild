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
    addBotMessage("Hello! How can I help you today?");
  }, []);

  const addMessage = (sender: 'user' | 'bot', text: string) => {
    setMessages(prevMessages => [...prevMessages, { sender, text }]);
  };

  const addBotMessage = (text: string) => {
    addMessage('bot', text);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    addUserMessage(userInput);
    setUserInput('');
    setIsLoading(true);

    try {
      const botResponse = await getBotResponse(userInput);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error getting bot response:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const addUserMessage = (text: string) => {
    addMessage('user', text);
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate API call to a backend service (replace with actual API endpoint)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Basic logic for responding to common questions
        if (userMessage.toLowerCase().includes("track order")) {
          resolve("Please provide your order number.");
        } else if (userMessage.toLowerCase().includes("return") || userMessage.toLowerCase().includes("refund")) {
          resolve("To initiate a return or refund, please visit our returns page.");
        } else if (userMessage.toLowerCase().includes("product inquiry")) {
          resolve("Please specify the product you are interested in.");
        } else {
          resolve("I'm sorry, I don't understand. Please rephrase your question.");
        }
      }, 1000); // Simulate API latency
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
      <form onSubmit={handleSubmit}>
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

// Basic CSS (you'd typically put this in a separate CSS file)
import './CustomerSupportBot.css'; // Create this file
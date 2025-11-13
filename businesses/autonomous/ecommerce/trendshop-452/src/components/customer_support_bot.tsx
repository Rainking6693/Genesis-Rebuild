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

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    addUserMessage(userInput);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate an API call to a backend service for bot responses
      const botResponse = await getBotResponse(userInput);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error fetching bot response:", error);
      addBotMessage("Sorry, I'm having trouble understanding. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    // Replace this with a real API call to your backend
    return new Promise((resolve) => {
      setTimeout(() => {
        if (userMessage.toLowerCase().includes("order")) {
          resolve("To track your order, please provide your order number.");
        } else if (userMessage.toLowerCase().includes("return")) {
          resolve("To initiate a return, please visit our returns portal on our website.");
        } else if (userMessage.toLowerCase().includes("product")) {
          resolve("Please specify which product you are inquiring about.");
        } else {
          resolve("I'm sorry, I don't understand. Please try rephrasing your question.");
        }
      }, 1000); // Simulate API latency
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
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
    // Initial greeting message from the bot
    addBotMessage("Hello! How can I help you today?");
  }, []);

  const addMessage = (text: string, isUser: boolean) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser }]);
  };

  const addBotMessage = (text: string) => {
    addMessage(text, false);
  };

  const addUserMessage = (text: string) => {
    addMessage(text, true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = userInput;
    addUserMessage(userMessage);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate an API call to a backend service for processing the user's message
      const botResponse = await simulateBotResponse(userMessage);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error processing user message:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBotResponse = async (userMessage: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (userMessage.toLowerCase().includes("order")) {
          resolve("To track your order, please provide your order number.");
        } else if (userMessage.toLowerCase().includes("return")) {
          resolve("To initiate a return, please visit our returns page.");
        } else if (userMessage.toLowerCase().includes("product")) {
          resolve("Please specify which product you are interested in.");
        } else {
          resolve("I'm sorry, I didn't understand your request. Please try again.");
        }
      }, 1000); // Simulate a 1-second delay for API processing
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
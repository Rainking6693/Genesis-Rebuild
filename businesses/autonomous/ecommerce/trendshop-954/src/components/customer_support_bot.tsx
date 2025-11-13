// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Welcome! How can I help you today?");
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
      // Simulate an API call to a backend service for processing the user's query
      const response = await simulateBackendCall(userInput);
      addBotMessage(response);
    } catch (error: any) {
      console.error("Error processing user input:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBackendCall = async (query: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Basic intent recognition (replace with a real NLP service)
        if (query.toLowerCase().includes("order")) {
          resolve("To track your order, please provide your order number.");
        } else if (query.toLowerCase().includes("return")) {
          resolve("To initiate a return, please visit our returns page.");
        } else if (query.toLowerCase().includes("faq")) {
          resolve("You can find answers to frequently asked questions on our FAQ page.");
        } else if (query.toLowerCase().includes("contact")) {
          resolve("You can contact us via email at support@example.com or by phone at 555-123-4567.");
        } else {
          resolve("I'm sorry, I don't understand. Please try rephrasing your question.");
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
      <form onSubmit={handleSubmit}>
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
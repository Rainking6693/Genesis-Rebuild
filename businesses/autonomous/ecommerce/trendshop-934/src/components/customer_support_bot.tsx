// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Hello! How can I help you today?");
  }, []);

  const addMessage = (message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const addBotMessage = (text: string) => {
    addMessage({ text: text, sender: 'bot' });
  };

  const addUserMessage = (text: string) => {
    addMessage({ text: text, sender: 'user' });
  };

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    addUserMessage(userInput);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate API call to a backend service for bot response
      const botResponse = await getBotResponse(userInput);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error getting bot response:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (userInput: string): Promise<string> => {
    // Simulate API call with a delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple logic for demonstration purposes
        if (userInput.toLowerCase().includes("order")) {
          resolve("To track your order, please provide your order number.");
        } else if (userInput.toLowerCase().includes("return")) {
          resolve("To initiate a return, please visit our returns page.");
        } else if (userInput.toLowerCase().includes("faq")) {
          resolve("You can find frequently asked questions on our FAQ page.");
        } else if (userInput.toLowerCase().includes("contact")) {
          resolve("You can contact us via email at support@example.com or by phone at 555-123-4567.");
        } else {
          resolve("I'm sorry, I don't understand. Please try rephrasing your question.");
        }
      }, 500); // Simulate API delay
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
          onChange={handleUserInput}
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
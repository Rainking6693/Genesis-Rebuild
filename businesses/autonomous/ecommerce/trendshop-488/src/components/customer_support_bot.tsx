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
    addBotMessage("Welcome to our store! How can I help you today?");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    addUserMessage(userInput);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate an API call to a backend service for processing the user's input
      const response = await simulateBackendCall(userInput);
      addBotMessage(response);
    } catch (error: any) {
      console.error("Error processing user input:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBackendCall = async (input: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate different responses based on user input
        if (input.toLowerCase().includes("order status")) {
          resolve("Your order is currently being processed and is expected to ship within 24 hours. You can track it with tracking number XYZ123.");
        } else if (input.toLowerCase().includes("return policy")) {
          resolve("Our return policy allows for returns within 30 days of purchase. Please visit our website for more details.");
        } else if (input.toLowerCase().includes("shipping")) {
          resolve("We offer standard and expedited shipping options. Shipping costs vary depending on the destination and shipping method.");
        } else {
          resolve("I'm sorry, I don't have information on that topic. Please contact our customer support team for further assistance.");
        }
      }, 1000); // Simulate a 1-second delay
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="bot-message">Loading...</div>}
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

**Action:**
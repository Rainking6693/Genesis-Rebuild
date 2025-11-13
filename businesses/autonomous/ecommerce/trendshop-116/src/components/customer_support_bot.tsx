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
    addBotMessage("Hello! How can I help you today?");
  }, []);

  const addMessage = (text: string, isUser: boolean) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser }]);
  };

  const addBotMessage = async (text: string) => {
    setIsLoading(true);
    // Simulate bot response delay
    await new Promise(resolve => setTimeout(resolve, 500));
    addMessage(text, false);
    setIsLoading(false);
  };

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = userInput;
    setUserInput('');
    addMessage(userMessage, true);

    try {
      setIsLoading(true);
      // Simulate API call to a backend service for bot response
      const botResponse = await getBotResponse(userMessage);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error fetching bot response:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    // Placeholder for actual API call to a backend service
    // This function should handle different user queries such as:
    // - Order tracking: "Where is my order?"
    // - Product information: "Tell me about [product name]"
    // - FAQs: "What is your return policy?"

    // Simulate different responses based on user input
    if (userMessage.toLowerCase().includes("order")) {
      return "Your order is currently being processed and is expected to arrive in 3-5 business days.";
    } else if (userMessage.toLowerCase().includes("return policy")) {
      return "Our return policy allows you to return items within 30 days of purchase.";
    } else {
      return "I'm sorry, I didn't understand your question. Please try rephrasing it.";
    }
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
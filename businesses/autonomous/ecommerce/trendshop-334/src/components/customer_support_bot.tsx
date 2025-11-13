// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Initial greeting from the bot
    addBotMessage("Hello! How can I help you today?");
  }, []);

  const addBotMessage = (text: string) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser: false }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser: true }]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    addUserMessage(input);
    processUserMessage(input);
    setInput('');
  };

  const processUserMessage = async (message: string) => {
    try {
      // Simulate processing the user's message (replace with actual logic)
      let response = "I'm sorry, I didn't understand that.  Please try again.";

      if (message.toLowerCase().includes("order tracking")) {
        response = "To track your order, please provide your order number.";
      } else if (message.toLowerCase().includes("return")) {
        response = "To initiate a return, please visit our returns page.";
      } else if (message.toLowerCase().includes("faq")) {
        response = "You can find answers to frequently asked questions on our FAQ page.";
      }

      // Simulate an API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      addBotMessage(response);

    } catch (error: any) {
      console.error("Error processing message:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
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
      </div>
      <form onSubmit={handleSubmit} className="input-area">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default CustomerSupportBot;
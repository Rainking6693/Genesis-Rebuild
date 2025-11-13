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
    // Initial bot message
    addBotMessage("Welcome to our store! How can I help you today?");
  }, []);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const addUserMessage = (text: string) => {
    addMessage({ text, sender: 'user' });
  };

  const addBotMessage = (text: string) => {
    addMessage({ text, sender: 'bot' });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    addUserMessage(userInput);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate bot response (replace with actual API call to a chatbot service)
      const botResponse = await simulateBotResponse(userInput);
      addBotMessage(botResponse);

    } catch (error: any) {
      console.error("Error processing user input:", error);
      addBotMessage("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBotResponse = async (userInput: string): Promise<string> => {
    // Simulate an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simple keyword-based responses (replace with a more sophisticated chatbot)
    if (userInput.toLowerCase().includes("order status")) {
      return "To check your order status, please provide your order number.";
    } else if (userInput.toLowerCase().includes("return policy")) {
      return "Our return policy allows returns within 30 days of purchase.";
    } else {
      return "I'm sorry, I don't understand. Please try rephrasing your question.";
    }
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
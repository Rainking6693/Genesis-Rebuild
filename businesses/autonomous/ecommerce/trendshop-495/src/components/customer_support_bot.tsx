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
    addMessage({ text, sender: 'bot' });
  };

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    addUserMessage(userMessage);
    setUserInput('');
    setIsLoading(true);

    try {
      const botResponse = await getBotResponse(userMessage);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error fetching bot response:", error);
      addBotMessage("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addUserMessage = (text: string) => {
    addMessage({ text, sender: 'user' });
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate API call to a backend service or LLM
    return new Promise((resolve) => {
      setTimeout(() => {
        let response = "I'm sorry, I don't understand.  Please try asking about order status, returns, or product information.";
        if (userMessage.toLowerCase().includes("order status")) {
          response = "Your order is currently being processed and is expected to ship within 24 hours.  You can track it at [tracking link]";
        } else if (userMessage.toLowerCase().includes("return")) {
          response = "To initiate a return, please visit our returns portal at [returns link] and follow the instructions.";
        } else if (userMessage.toLowerCase().includes("product information")) {
          response = "Please specify which product you are interested in, and I can provide more details.";
        }
        resolve(response);
      }, 1000); // Simulate network latency
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="message-container">
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
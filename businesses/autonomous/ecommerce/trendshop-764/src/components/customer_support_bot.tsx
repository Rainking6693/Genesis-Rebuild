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
    addBotMessage("Welcome to our e-commerce store! How can I help you today?");
  }, []);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const addBotMessage = (text: string) => {
    addMessage({ text, sender: 'bot' });
  };

  const addUserMessage = (text: string) => {
    addMessage({ text, sender: 'user' });
  };

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = userInput;
    addUserMessage(userMessage);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate API call to a backend service for processing the user's query
      const botResponse = await simulateBotResponse(userMessage);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error processing user input:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate a delay to mimic an API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simple logic for demonstration purposes
    if (userMessage.toLowerCase().includes("order status")) {
      return "To check your order status, please provide your order number.";
    } else if (userMessage.toLowerCase().includes("return policy")) {
      return "Our return policy allows returns within 30 days of purchase.";
    } else if (userMessage.toLowerCase().includes("contact")) {
      return "You can contact us via email at support@example.com or call us at 555-123-4567.";
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
    addBotMessage("Welcome to our e-commerce store! How can I help you today?");
  }, []);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const addBotMessage = (text: string) => {
    addMessage({ text, sender: 'bot' });
  };

  const addUserMessage = (text: string) => {
    addMessage({ text, sender: 'user' });
  };

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = userInput;
    addUserMessage(userMessage);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate API call to a backend service for processing the user's query
      const botResponse = await simulateBotResponse(userMessage);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error processing user input:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate a delay to mimic an API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simple logic for demonstration purposes
    if (userMessage.toLowerCase().includes("order status")) {
      return "To check your order status, please provide your order number.";
    } else if (userMessage.toLowerCase().includes("return policy")) {
      return "Our return policy allows returns within 30 days of purchase.";
    } else if (userMessage.toLowerCase().includes("contact")) {
      return "You can contact us via email at support@example.com or call us at 555-123-4567.";
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
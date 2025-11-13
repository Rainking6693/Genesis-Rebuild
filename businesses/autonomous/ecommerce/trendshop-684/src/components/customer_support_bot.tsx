// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Hi there! How can I help you today?");
  }, []);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prevMessages => [...prevMessages, { text, sender }]);
  };

  const addBotMessage = (text: string) => {
    addMessage(text, 'bot');
  };

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    addUserMessage(userMessage);
    setUserInput('');
    setIsLoading(true);

    try {
      const botResponse = await getBotResponse(userMessage);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error getting bot response:", error);
      addBotMessage("Sorry, I'm having trouble understanding. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addUserMessage = (text: string) => {
    addMessage(text, 'user');
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate API call to a backend service or use a simple rule-based system
    // Replace this with actual logic to process the user's message and generate a response.

    // Example: Simple rule-based response
    if (userMessage.toLowerCase().includes("order status")) {
      return "To check your order status, please provide your order number.";
    } else if (userMessage.toLowerCase().includes("return")) {
      return "To initiate a return, please visit our returns page.";
    } else if (userMessage.toLowerCase().includes("product information")) {
      return "Please specify which product you are interested in.";
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
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Hi there! How can I help you today?");
  }, []);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prevMessages => [...prevMessages, { text, sender }]);
  };

  const addBotMessage = (text: string) => {
    addMessage(text, 'bot');
  };

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    addUserMessage(userMessage);
    setUserInput('');
    setIsLoading(true);

    try {
      const botResponse = await getBotResponse(userMessage);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error getting bot response:", error);
      addBotMessage("Sorry, I'm having trouble understanding. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addUserMessage = (text: string) => {
    addMessage(text, 'user');
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate API call to a backend service or use a simple rule-based system
    // Replace this with actual logic to process the user's message and generate a response.

    // Example: Simple rule-based response
    if (userMessage.toLowerCase().includes("order status")) {
      return "To check your order status, please provide your order number.";
    } else if (userMessage.toLowerCase().includes("return")) {
      return "To initiate a return, please visit our returns page.";
    } else if (userMessage.toLowerCase().includes("product information")) {
      return "Please specify which product you are interested in.";
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

**Action:**
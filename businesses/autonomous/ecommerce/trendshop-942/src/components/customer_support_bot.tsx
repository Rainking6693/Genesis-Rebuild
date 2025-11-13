// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial greeting message
    addBotMessage("Welcome to our support! How can I help you today?");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    addUserMessage(input);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate API call to a backend service for processing the user's message
      const response = await simulateBackendResponse(input);
      addBotMessage(response);
    } catch (error: any) {
      console.error("Error processing message:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBackendResponse = async (message: string): Promise<string> => {
    // Simulate a delay to mimic a real API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simple logic to provide responses based on keywords
    if (message.toLowerCase().includes("order")) {
      return "To track your order, please provide your order number.";
    } else if (message.toLowerCase().includes("return")) {
      return "For returns, please visit our returns page or contact us with your order number.";
    } else if (message.toLowerCase().includes("faq")) {
      return "You can find frequently asked questions on our FAQ page.";
    } else if (message.toLowerCase().includes("contact")) {
      return "You can contact us via email at support@example.com or call us at 555-123-4567.";
    } else {
      return "I'm sorry, I don't understand. Please try rephrasing your question.";
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
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

// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial greeting message
    addBotMessage("Welcome to our support! How can I help you today?");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    addUserMessage(input);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate API call to a backend service for processing the user's message
      const response = await simulateBackendResponse(input);
      addBotMessage(response);
    } catch (error: any) {
      console.error("Error processing message:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBackendResponse = async (message: string): Promise<string> => {
    // Simulate a delay to mimic a real API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simple logic to provide responses based on keywords
    if (message.toLowerCase().includes("order")) {
      return "To track your order, please provide your order number.";
    } else if (message.toLowerCase().includes("return")) {
      return "For returns, please visit our returns page or contact us with your order number.";
    } else if (message.toLowerCase().includes("faq")) {
      return "You can find frequently asked questions on our FAQ page.";
    } else if (message.toLowerCase().includes("contact")) {
      return "You can contact us via email at support@example.com or call us at 555-123-4567.";
    } else {
      return "I'm sorry, I don't understand. Please try rephrasing your question.";
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
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
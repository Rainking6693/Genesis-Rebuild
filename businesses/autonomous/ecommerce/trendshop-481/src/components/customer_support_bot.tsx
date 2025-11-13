// src/components/CustomerSupportBot.tsx

import React, { useState, useEffect } from 'react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
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
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const addBotMessage = (text: string) => {
    addMessage({ sender: 'bot', text: text });
  };

  const addUserMessage = (text: string) => {
    addMessage({ sender: 'user', text: text });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userInput.trim()) {
      return; // Prevent sending empty messages
    }

    addUserMessage(userInput);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate bot response (replace with actual logic)
      const botResponse = await simulateBotResponse(userInput);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error processing user input:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBotResponse = async (userInput: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (userInput.toLowerCase().includes("order status")) {
          resolve("Your order is currently being processed and is expected to ship within 24 hours. You can track it with this link: [Tracking Link]");
        } else if (userInput.toLowerCase().includes("return")) {
          resolve("To initiate a return, please visit our returns portal: [Returns Portal Link]");
        } else if (userInput.toLowerCase().includes("shipping")) {
          resolve("We offer standard and express shipping options. Standard shipping takes 3-5 business days, and express shipping takes 1-2 business days.");
        } else {
          resolve("I'm sorry, I don't have information on that. Please try rephrasing your question or contact our support team.");
        }
      }, 1000); // Simulate API call delay
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.text}
          </div>
        ))}
        {isLoading && <div className="bot-message">Thinking...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
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
  sender: 'user' | 'bot';
  text: string;
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
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const addBotMessage = (text: string) => {
    addMessage({ sender: 'bot', text: text });
  };

  const addUserMessage = (text: string) => {
    addMessage({ sender: 'user', text: text });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userInput.trim()) {
      return; // Prevent sending empty messages
    }

    addUserMessage(userInput);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate bot response (replace with actual logic)
      const botResponse = await simulateBotResponse(userInput);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error processing user input:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBotResponse = async (userInput: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (userInput.toLowerCase().includes("order status")) {
          resolve("Your order is currently being processed and is expected to ship within 24 hours. You can track it with this link: [Tracking Link]");
        } else if (userInput.toLowerCase().includes("return")) {
          resolve("To initiate a return, please visit our returns portal: [Returns Portal Link]");
        } else if (userInput.toLowerCase().includes("shipping")) {
          resolve("We offer standard and express shipping options. Standard shipping takes 3-5 business days, and express shipping takes 1-2 business days.");
        } else {
          resolve("I'm sorry, I don't have information on that. Please try rephrasing your question or contact our support team.");
        }
      }, 1000); // Simulate API call delay
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.text}
          </div>
        ))}
        {isLoading && <div className="bot-message">Thinking...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
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
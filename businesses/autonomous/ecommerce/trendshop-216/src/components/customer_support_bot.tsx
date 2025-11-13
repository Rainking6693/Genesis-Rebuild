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

  const addMessage = (text: string, isUser: boolean) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser }]);
  };

  const addBotMessage = (text: string) => {
    addMessage(text, false);
  };

  const addUserMessage = (text: string) => {
    addMessage(text, true);
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
      // Simulate an API call to a knowledge base or FAQ system
      const botResponse = await getBotResponse(userInput);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error getting bot response:", error);
      addBotMessage("Sorry, I'm having trouble connecting. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (userInput: string): Promise<string> => {
    // Placeholder for API call to a knowledge base or FAQ system
    // Replace this with your actual API endpoint
    // Example:
    // const response = await fetch('/api/knowledge_base', {
    //   method: 'POST',
    //   body: JSON.stringify({ query: userInput }),
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // const data = await response.json();
    // return data.answer;

    // Simulate a response based on keywords
    if (userInput.toLowerCase().includes("shipping")) {
      return "Our standard shipping takes 3-5 business days.";
    } else if (userInput.toLowerCase().includes("return")) {
      return "We accept returns within 30 days of purchase.";
    } else {
      return "I'm sorry, I don't have information on that topic. Please contact our support team for further assistance.";
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
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Welcome to our store! How can I help you today?");
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
      // Simulate an API call to a knowledge base or FAQ system
      const botResponse = await getBotResponse(userInput);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error getting bot response:", error);
      addBotMessage("Sorry, I'm having trouble connecting. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (userInput: string): Promise<string> => {
    // Placeholder for API call to a knowledge base or FAQ system
    // Replace this with your actual API endpoint
    // Example:
    // const response = await fetch('/api/knowledge_base', {
    //   method: 'POST',
    //   body: JSON.stringify({ query: userInput }),
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // const data = await response.json();
    // return data.answer;

    // Simulate a response based on keywords
    if (userInput.toLowerCase().includes("shipping")) {
      return "Our standard shipping takes 3-5 business days.";
    } else if (userInput.toLowerCase().includes("return")) {
      return "We accept returns within 30 days of purchase.";
    } else {
      return "I'm sorry, I don't have information on that topic. Please contact our support team for further assistance.";
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
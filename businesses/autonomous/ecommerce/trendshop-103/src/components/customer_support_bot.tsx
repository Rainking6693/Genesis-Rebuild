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
    addBotMessage("Hello! How can I help you today?");
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
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userInput.trim()) {
      return; // Prevent sending empty messages
    }

    addUserMessage(userInput);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate an API call to a backend service for processing the user's message
      const response = await simulateBackendCall(userInput);
      addBotMessage(response);
    } catch (error: any) {
      console.error("Error processing user input:", error);
      addBotMessage("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate a backend API call (replace with actual API call)
  const simulateBackendCall = (message: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple logic to provide responses based on keywords
        if (message.toLowerCase().includes("order")) {
          resolve("To track your order, please provide your order number.");
        } else if (message.toLowerCase().includes("return")) {
          resolve("To initiate a return, please visit our returns page.");
        } else if (message.toLowerCase().includes("product")) {
          resolve("Please specify which product you are interested in.");
        } else {
          resolve("I'm sorry, I don't understand. Please try rephrasing your question.");
        }
      }, 1000); // Simulate a 1-second delay
    });
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
  isUser: boolean;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Hello! How can I help you today?");
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
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userInput.trim()) {
      return; // Prevent sending empty messages
    }

    addUserMessage(userInput);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate an API call to a backend service for processing the user's message
      const response = await simulateBackendCall(userInput);
      addBotMessage(response);
    } catch (error: any) {
      console.error("Error processing user input:", error);
      addBotMessage("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate a backend API call (replace with actual API call)
  const simulateBackendCall = (message: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple logic to provide responses based on keywords
        if (message.toLowerCase().includes("order")) {
          resolve("To track your order, please provide your order number.");
        } else if (message.toLowerCase().includes("return")) {
          resolve("To initiate a return, please visit our returns page.");
        } else if (message.toLowerCase().includes("product")) {
          resolve("Please specify which product you are interested in.");
        } else {
          resolve("I'm sorry, I don't understand. Please try rephrasing your question.");
        }
      }, 1000); // Simulate a 1-second delay
    });
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
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default CustomerSupportBot;

Now, I will write the code to a file and generate the build report.

**Action:**
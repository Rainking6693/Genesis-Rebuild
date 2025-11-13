// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect, useCallback } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const sendMessage = useCallback(async () => {
    if (!userInput.trim()) return;

    const userMessage: Message = { text: userInput, isUser: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate API call to a backend service for processing the user's message
      const response = await simulateBackendResponse(userInput);
      const botMessage: Message = { text: response, isUser: false };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error: any) {
      console.error("Error processing user message:", error);
      const errorMessage: Message = { text: "Sorry, I encountered an error. Please try again later.", isUser: false };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [userInput]);

  // Simulate backend processing and response
  const simulateBackendResponse = async (message: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const lowerCaseMessage = message.toLowerCase();

        if (lowerCaseMessage.includes("order status") || lowerCaseMessage.includes("track my order")) {
          resolve("Your order is currently being processed and is expected to ship within 24 hours. You can track it using tracking number XYZ123.");
        } else if (lowerCaseMessage.includes("return")) {
          resolve("To initiate a return, please visit our returns portal at example.com/returns and follow the instructions.");
        } else if (lowerCaseMessage.includes("faq") || lowerCaseMessage.includes("frequently asked questions")) {
          resolve("You can find answers to frequently asked questions on our FAQ page: example.com/faq");
        } else if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
          resolve("Hello! How can I assist you today?");
        }
        else {
          resolve("I'm sorry, I didn't understand your request. Please try rephrasing your question.");
        }
      }, 1500); // Simulate a 1.5 second delay for processing
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="message bot-message">Loading...</div>}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default CustomerSupportBot;

// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect, useCallback } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const sendMessage = useCallback(async () => {
    if (!userInput.trim()) return;

    const userMessage: Message = { text: userInput, isUser: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate API call to a backend service for processing the user's message
      const response = await simulateBackendResponse(userInput);
      const botMessage: Message = { text: response, isUser: false };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error: any) {
      console.error("Error processing user message:", error);
      const errorMessage: Message = { text: "Sorry, I encountered an error. Please try again later.", isUser: false };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [userInput]);

  // Simulate backend processing and response
  const simulateBackendResponse = async (message: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const lowerCaseMessage = message.toLowerCase();

        if (lowerCaseMessage.includes("order status") || lowerCaseMessage.includes("track my order")) {
          resolve("Your order is currently being processed and is expected to ship within 24 hours. You can track it using tracking number XYZ123.");
        } else if (lowerCaseMessage.includes("return")) {
          resolve("To initiate a return, please visit our returns portal at example.com/returns and follow the instructions.");
        } else if (lowerCaseMessage.includes("faq") || lowerCaseMessage.includes("frequently asked questions")) {
          resolve("You can find answers to frequently asked questions on our FAQ page: example.com/faq");
        } else if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
          resolve("Hello! How can I assist you today?");
        }
        else {
          resolve("I'm sorry, I didn't understand your request. Please try rephrasing your question.");
        }
      }, 1500); // Simulate a 1.5 second delay for processing
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="message bot-message">Loading...</div>}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default CustomerSupportBot;
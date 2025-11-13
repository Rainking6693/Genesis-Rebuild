// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: Error, errorInfo: React.ErrorInfo) => {
      console.error("Caught an error: ", error, errorInfo);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div>
        <h2>Something went wrong.</h2>
        <p>Please try again later.</p>
      </div>
    );
  }

  return children;
}

function CustomerSupportBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = { text: inputText, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Simulate API call to backend for bot response
      const botResponseText = await simulateBotResponse(inputText);

      const botMessage: Message = { text: botResponseText, sender: 'bot' };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error: any) {
      console.error("Error getting bot response:", error);
      const errorMessage: Message = { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'bot' };
      setMessages([...messages, userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate an API call to a backend service
  const simulateBotResponse = async (userMessage: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple logic for demonstration purposes
        if (userMessage.toLowerCase().includes("order")) {
          resolve("I can help you with order tracking and returns.");
        } else if (userMessage.toLowerCase().includes("shipping")) {
          resolve("Shipping usually takes 3-5 business days.");
        } else {
          resolve("I'm still learning, but I'll do my best to assist you.");
        }
      }, 1000); // Simulate network latency
    });
  };

  return (
    <ErrorBoundary>
      <div className="customer-support-bot">
        <div className="message-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
          {isLoading && <div className="message bot">Loading...</div>}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button onClick={sendMessage} disabled={isLoading}>
            Send
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default CustomerSupportBot;

// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: Error, errorInfo: React.ErrorInfo) => {
      console.error("Caught an error: ", error, errorInfo);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div>
        <h2>Something went wrong.</h2>
        <p>Please try again later.</p>
      </div>
    );
  }

  return children;
}

function CustomerSupportBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = { text: inputText, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Simulate API call to backend for bot response
      const botResponseText = await simulateBotResponse(inputText);

      const botMessage: Message = { text: botResponseText, sender: 'bot' };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error: any) {
      console.error("Error getting bot response:", error);
      const errorMessage: Message = { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'bot' };
      setMessages([...messages, userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate an API call to a backend service
  const simulateBotResponse = async (userMessage: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple logic for demonstration purposes
        if (userMessage.toLowerCase().includes("order")) {
          resolve("I can help you with order tracking and returns.");
        } else if (userMessage.toLowerCase().includes("shipping")) {
          resolve("Shipping usually takes 3-5 business days.");
        } else {
          resolve("I'm still learning, but I'll do my best to assist you.");
        }
      }, 1000); // Simulate network latency
    });
  };

  return (
    <ErrorBoundary>
      <div className="customer-support-bot">
        <div className="message-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
          {isLoading && <div className="message bot">Loading...</div>}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button onClick={sendMessage} disabled={isLoading}>
            Send
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default CustomerSupportBot;
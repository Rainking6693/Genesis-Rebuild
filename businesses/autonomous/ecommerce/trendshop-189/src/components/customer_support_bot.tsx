// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';
import { processQuery } from './nlpService'; // Placeholder for NLP integration
import { getOrderDetails, getProductDetails } from './ecommerceApi'; // Placeholder for e-commerce API integration

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
    addBotMessage("Welcome to our support! How can I help you today?");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    addUserMessage(userInput);
    setIsLoading(true);

    try {
      const response = await processQuery(userInput); // Replace with actual NLP processing
      const intent = response.intent; // Example: 'track_order', 'product_info'

      let botResponse = "I'm sorry, I didn't understand your request.";

      switch (intent) {
        case 'track_order':
          const orderId = response.orderId; // Extract order ID from NLP response
          if (orderId) {
            const orderDetails = await getOrderDetails(orderId);
            if (orderDetails) {
              botResponse = `Your order ${orderId} is currently ${orderDetails.status}.`;
            } else {
              botResponse = `Could not find order with ID ${orderId}.`;
            }
          } else {
            botResponse = "Please provide your order ID.";
          }
          break;
        case 'product_info':
          const productId = response.productId; // Extract product ID from NLP response
          if (productId) {
            const productDetails = await getProductDetails(productId);
            if (productDetails) {
              botResponse = `Product ${productId} is ${productDetails.description}.`;
            } else {
              botResponse = `Could not find product with ID ${productId}.`;
            }
          } else {
            botResponse = "Please provide the product ID.";
          }
          break;
        default:
          botResponse = "I'm sorry, I can't help with that request yet.";
      }

      addBotMessage(botResponse);

    } catch (error: any) {
      console.error("Error processing query:", error);
      addBotMessage("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
      setUserInput('');
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

// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';
import { processQuery } from './nlpService'; // Placeholder for NLP integration
import { getOrderDetails, getProductDetails } from './ecommerceApi'; // Placeholder for e-commerce API integration

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
    addBotMessage("Welcome to our support! How can I help you today?");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    addUserMessage(userInput);
    setIsLoading(true);

    try {
      const response = await processQuery(userInput); // Replace with actual NLP processing
      const intent = response.intent; // Example: 'track_order', 'product_info'

      let botResponse = "I'm sorry, I didn't understand your request.";

      switch (intent) {
        case 'track_order':
          const orderId = response.orderId; // Extract order ID from NLP response
          if (orderId) {
            const orderDetails = await getOrderDetails(orderId);
            if (orderDetails) {
              botResponse = `Your order ${orderId} is currently ${orderDetails.status}.`;
            } else {
              botResponse = `Could not find order with ID ${orderId}.`;
            }
          } else {
            botResponse = "Please provide your order ID.";
          }
          break;
        case 'product_info':
          const productId = response.productId; // Extract product ID from NLP response
          if (productId) {
            const productDetails = await getProductDetails(productId);
            if (productDetails) {
              botResponse = `Product ${productId} is ${productDetails.description}.`;
            } else {
              botResponse = `Could not find product with ID ${productId}.`;
            }
          } else {
            botResponse = "Please provide the product ID.";
          }
          break;
        default:
          botResponse = "I'm sorry, I can't help with that request yet.";
      }

      addBotMessage(botResponse);

    } catch (error: any) {
      console.error("Error processing query:", error);
      addBotMessage("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
      setUserInput('');
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
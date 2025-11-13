// src/components/CustomerSupportBot.tsx

import React, { useState, useEffect } from 'react';
import { DialogflowClient } from './DialogflowClient'; // Assuming a Dialogflow integration
import { ECommerceAPI } from './ECommerceAPI'; // Assuming an ECommerce API wrapper
import ErrorBoundary from './ErrorBoundary'; // Reusable ErrorBoundary component

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dialogflowClient = new DialogflowClient(); // Initialize Dialogflow client
  const eCommerceAPI = new ECommerceAPI(); // Initialize ECommerce API client

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Hello! How can I help you today?");
  }, []);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const addUserMessage = (text: string) => {
    addMessage({ text, isUser: true });
  };

  const addBotMessage = (text: string) => {
    addMessage({ text, isUser: false });
  };

  const handleUserInput = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!userInput.trim()) return;

    addUserMessage(userInput);
    setUserInput('');
    setIsLoading(true);

    try {
      const dialogflowResponse = await dialogflowClient.sendMessage(userInput);
      const intent = dialogflowResponse.intent;
      const parameters = dialogflowResponse.parameters;
      let botResponse = dialogflowResponse.fulfillmentText;

      // Handle specific intents with ECommerce API calls
      if (intent === 'order.status') {
        const orderId = parameters.order_id;
        if (orderId) {
          try {
            const order = await eCommerceAPI.getOrderStatus(orderId);
            botResponse = `Your order ${orderId} is currently ${order.status}.`;
          } catch (error: any) {
            console.error("Error fetching order status:", error);
            botResponse = `Sorry, I couldn't retrieve the status for order ${orderId}. Please try again later.`;
          }
        } else {
          botResponse = "Please provide an order ID.";
        }
      } else if (intent === 'product.inquiry') {
        const productId = parameters.product_id;
        if (productId) {
          try {
            const product = await eCommerceAPI.getProductDetails(productId);
            botResponse = `Product ${product.name} is ${product.description}.`;
          } catch (error: any) {
            console.error("Error fetching product details:", error);
            botResponse = `Sorry, I couldn't retrieve details for product ${productId}. Please try again later.`;
          }
        } else {
          botResponse = "Please provide a product ID.";
        }
      }

      addBotMessage(botResponse);

    } catch (error: any) {
      console.error("Error processing user input:", error);
      addBotMessage("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="customer-support-bot">
        <div className="chat-window">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
            >
              {message.text}
            </div>
          ))}
          {isLoading && <div className="bot-message">Loading...</div>}
        </div>
        <form onSubmit={handleUserInput} className="input-area">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            Send
          </button>
        </form>
      </div>
    </ErrorBoundary>
  );
};

export default CustomerSupportBot;

// Mock DialogflowClient (replace with actual Dialogflow integration)
class DialogflowClient {
  async sendMessage(message: string): Promise<any> {
    // Simulate Dialogflow response
    console.log(`Simulating Dialogflow processing: ${message}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

    if (message.includes("order")) {
      return {
        intent: 'order.status',
        parameters: { order_id: "12345" },
        fulfillmentText: "Checking your order status..."
      };
    } else if (message.includes("product")) {
      return {
        intent: 'product.inquiry',
        parameters: { product_id: "67890" },
        fulfillmentText: "Fetching product details..."
      };
    }
    return {
      intent: 'default.fallback',
      parameters: {},
      fulfillmentText: "I'm sorry, I didn't understand that.  Please try again."
    };
  }
}

// Mock ECommerceAPI (replace with actual ECommerce API integration)
class ECommerceAPI {
  async getOrderStatus(orderId: string): Promise<any> {
    console.log(`Simulating ECommerce API call for order: ${orderId}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

    if (orderId === "12345") {
      return {
        status: "Shipped"
      };
    } else {
      throw new Error("Order not found"); // Simulate API error
    }
  }

  async getProductDetails(productId: string): Promise<any> {
    console.log(`Simulating ECommerce API call for product: ${productId}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

    if (productId === "67890") {
      return {
        name: "Awesome Product",
        description: "This is a great product!"
      };
    } else {
      throw new Error("Product not found"); // Simulate API error
    }
  }
}

// Mock ErrorBoundary (replace with a real implementation)
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: any, errorInfo: any) => {
      console.error("Caught an error in ErrorBoundary:", error, errorInfo);
      setHasError(true);
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (hasError) {
    return <div>Something went wrong.  Please try again later.</div>;
  }

  return children;
};

export { DialogflowClient, ECommerceAPI, ErrorBoundary };

// src/components/CustomerSupportBot.tsx

import React, { useState, useEffect } from 'react';
import { DialogflowClient } from './DialogflowClient'; // Assuming a Dialogflow integration
import { ECommerceAPI } from './ECommerceAPI'; // Assuming an ECommerce API wrapper
import ErrorBoundary from './ErrorBoundary'; // Reusable ErrorBoundary component

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dialogflowClient = new DialogflowClient(); // Initialize Dialogflow client
  const eCommerceAPI = new ECommerceAPI(); // Initialize ECommerce API client

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Hello! How can I help you today?");
  }, []);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const addUserMessage = (text: string) => {
    addMessage({ text, isUser: true });
  };

  const addBotMessage = (text: string) => {
    addMessage({ text, isUser: false });
  };

  const handleUserInput = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!userInput.trim()) return;

    addUserMessage(userInput);
    setUserInput('');
    setIsLoading(true);

    try {
      const dialogflowResponse = await dialogflowClient.sendMessage(userInput);
      const intent = dialogflowResponse.intent;
      const parameters = dialogflowResponse.parameters;
      let botResponse = dialogflowResponse.fulfillmentText;

      // Handle specific intents with ECommerce API calls
      if (intent === 'order.status') {
        const orderId = parameters.order_id;
        if (orderId) {
          try {
            const order = await eCommerceAPI.getOrderStatus(orderId);
            botResponse = `Your order ${orderId} is currently ${order.status}.`;
          } catch (error: any) {
            console.error("Error fetching order status:", error);
            botResponse = `Sorry, I couldn't retrieve the status for order ${orderId}. Please try again later.`;
          }
        } else {
          botResponse = "Please provide an order ID.";
        }
      } else if (intent === 'product.inquiry') {
        const productId = parameters.product_id;
        if (productId) {
          try {
            const product = await eCommerceAPI.getProductDetails(productId);
            botResponse = `Product ${product.name} is ${product.description}.`;
          } catch (error: any) {
            console.error("Error fetching product details:", error);
            botResponse = `Sorry, I couldn't retrieve details for product ${productId}. Please try again later.`;
          }
        } else {
          botResponse = "Please provide a product ID.";
        }
      }

      addBotMessage(botResponse);

    } catch (error: any) {
      console.error("Error processing user input:", error);
      addBotMessage("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="customer-support-bot">
        <div className="chat-window">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
            >
              {message.text}
            </div>
          ))}
          {isLoading && <div className="bot-message">Loading...</div>}
        </div>
        <form onSubmit={handleUserInput} className="input-area">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            Send
          </button>
        </form>
      </div>
    </ErrorBoundary>
  );
};

export default CustomerSupportBot;

// Mock DialogflowClient (replace with actual Dialogflow integration)
class DialogflowClient {
  async sendMessage(message: string): Promise<any> {
    // Simulate Dialogflow response
    console.log(`Simulating Dialogflow processing: ${message}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

    if (message.includes("order")) {
      return {
        intent: 'order.status',
        parameters: { order_id: "12345" },
        fulfillmentText: "Checking your order status..."
      };
    } else if (message.includes("product")) {
      return {
        intent: 'product.inquiry',
        parameters: { product_id: "67890" },
        fulfillmentText: "Fetching product details..."
      };
    }
    return {
      intent: 'default.fallback',
      parameters: {},
      fulfillmentText: "I'm sorry, I didn't understand that.  Please try again."
    };
  }
}

// Mock ECommerceAPI (replace with actual ECommerce API integration)
class ECommerceAPI {
  async getOrderStatus(orderId: string): Promise<any> {
    console.log(`Simulating ECommerce API call for order: ${orderId}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

    if (orderId === "12345") {
      return {
        status: "Shipped"
      };
    } else {
      throw new Error("Order not found"); // Simulate API error
    }
  }

  async getProductDetails(productId: string): Promise<any> {
    console.log(`Simulating ECommerce API call for product: ${productId}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

    if (productId === "67890") {
      return {
        name: "Awesome Product",
        description: "This is a great product!"
      };
    } else {
      throw new Error("Product not found"); // Simulate API error
    }
  }
}

// Mock ErrorBoundary (replace with a real implementation)
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: any, errorInfo: any) => {
      console.error("Caught an error in ErrorBoundary:", error, errorInfo);
      setHasError(true);
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (hasError) {
    return <div>Something went wrong.  Please try again later.</div>;
  }

  return children;
};

export { DialogflowClient, ECommerceAPI, ErrorBoundary };
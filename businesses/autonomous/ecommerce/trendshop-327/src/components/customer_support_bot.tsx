// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';
import ECommerceService from '../services/ECommerceService';
import OrderInquiryHandler from './OrderInquiryHandler';
import ReturnsHandler from './ReturnsHandler';
import ProductInformationHandler from './ProductInformationHandler';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eCommerceService = new ECommerceService(); // Instantiate the service

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Hello! How can I help you today?");
  }, []);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const addBotMessage = (text: string) => {
    addMessage({ text, sender: 'bot' });
  };

  const handleUserInput = async () => {
    if (!userInput.trim()) return;

    const userMessage: Message = { text: userInput, sender: 'user' };
    addMessage(userMessage);
    setUserInput('');
    setIsLoading(true);

    try {
      let botResponse: string = "I'm sorry, I didn't understand your request."; // Default response

      // Basic intent recognition (can be improved with NLP)
      if (userInput.toLowerCase().includes("order")) {
        botResponse = await OrderInquiryHandler(userInput, eCommerceService);
      } else if (userInput.toLowerCase().includes("return")) {
        botResponse = await ReturnsHandler(userInput, eCommerceService);
      } else if (userInput.toLowerCase().includes("product")) {
        botResponse = await ProductInformationHandler(userInput, eCommerceService);
      } else {
        // Attempt to use a general knowledge base or FAQ
        botResponse = await eCommerceService.getFAQAnswer(userInput);
        if (!botResponse) {
          botResponse = "I'm still learning.  Could you rephrase your question?";
        }
      }

      addBotMessage(botResponse);

    } catch (e: any) {
      console.error("Error processing user input:", e);
      setError("An error occurred while processing your request. Please try again later.");
      addBotMessage("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
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
        {error && <div className="error-message">{error}</div>}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => { if (e.key === 'Enter') handleUserInput(); }}
        />
        <button onClick={handleUserInput} disabled={isLoading}>Send</button>
      </div>
    </div>
  );
};

export default CustomerSupportBot;

// src/components/OrderInquiryHandler.tsx
// Handles order inquiries
import ECommerceService from '../services/ECommerceService';

const OrderInquiryHandler = async (userInput: string, eCommerceService: ECommerceService): Promise<string> => {
  try {
    // Extract order ID from user input (very basic example)
    const orderIdMatch = userInput.match(/order\s*#?\s*(\d+)/i);
    if (!orderIdMatch) {
      return "Could you please provide your order number?";
    }
    const orderId = orderIdMatch[1];

    const order = await eCommerceService.getOrderStatus(orderId);

    if (order) {
      return `Your order #${orderId} is currently: ${order.status}.`;
    } else {
      return `Order #${orderId} not found. Please check the order number.`;
    }
  } catch (error: any) {
    console.error("Error fetching order status:", error);
    return "Sorry, I couldn't retrieve your order information at this time.";
  }
};

export default OrderInquiryHandler;

// src/components/ReturnsHandler.tsx
// Handles return requests
import ECommerceService from '../services/ECommerceService';

const ReturnsHandler = async (userInput: string, eCommerceService: ECommerceService): Promise<string> => {
  try {
    // Placeholder logic - needs actual implementation
    if (userInput.toLowerCase().includes("start return")) {
      return "Okay, I've started the return process for you. Please check your email for instructions.";
    } else {
      return "To start a return, please say 'start return'.";
    }
  } catch (error: any) {
    console.error("Error processing return request:", error);
    return "Sorry, I couldn't process your return request at this time.";
  }
};

export default ReturnsHandler;

// src/components/ProductInformationHandler.tsx
// Handles product information requests
import ECommerceService from '../services/ECommerceService';

const ProductInformationHandler = async (userInput: string, eCommerceService: ECommerceService): Promise<string> => {
  try {
    // Extract product name from user input (very basic example)
    const productNameMatch = userInput.match(/product\s*(.*)/i);
    if (!productNameMatch || !productNameMatch[1]) {
      return "Could you please specify the product you're interested in?";
    }
    const productName = productNameMatch[1].trim();

    const product = await eCommerceService.getProductDetails(productName);

    if (product) {
      return `Product: ${product.name}, Price: $${product.price}, Description: ${product.description}`;
    } else {
      return `Product "${productName}" not found.`;
    }
  } catch (error: any) {
    console.error("Error fetching product details:", error);
    return "Sorry, I couldn't retrieve product information at this time.";
  }
};

export default ProductInformationHandler;

// src/services/ECommerceService.tsx
// Simulates interaction with an e-commerce backend
class ECommerceService {
  async getOrderStatus(orderId: string): Promise<{ status: string } | null> {
    // Simulate fetching order status from backend
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders: { [key: string]: { status: string } } = {
          "123": { status: "Shipped" },
          "456": { status: "Processing" },
        };
        resolve(orders[orderId] || null);
      }, 500);
    });
  }

  async getProductDetails(productName: string): Promise<{ name: string; price: number; description: string } | null> {
    // Simulate fetching product details from backend
    return new Promise((resolve) => {
      setTimeout(() => {
        const products: { [key: string]: { name: string; price: number; description: string } } = {
          "T-Shirt": { name: "T-Shirt", price: 20, description: "A comfortable cotton t-shirt." },
          "Jeans": { name: "Jeans", price: 50, description: "Classic denim jeans." },
        };
        resolve(products[productName] || null);
      }, 500);
    });
  }

  async getFAQAnswer(question: string): Promise<string | null> {
    // Simulate fetching FAQ answers
    return new Promise((resolve) => {
      setTimeout(() => {
        const faqs: { [key: string]: string } = {
          "What is your return policy?": "We offer a 30-day return policy.",
          "How long does shipping take?": "Shipping usually takes 3-5 business days.",
        };
        resolve(faqs[question] || null);
      }, 500);
    });
  }
}

export default ECommerceService;

// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';
import ECommerceService from '../services/ECommerceService';
import OrderInquiryHandler from './OrderInquiryHandler';
import ReturnsHandler from './ReturnsHandler';
import ProductInformationHandler from './ProductInformationHandler';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eCommerceService = new ECommerceService(); // Instantiate the service

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Hello! How can I help you today?");
  }, []);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const addBotMessage = (text: string) => {
    addMessage({ text, sender: 'bot' });
  };

  const handleUserInput = async () => {
    if (!userInput.trim()) return;

    const userMessage: Message = { text: userInput, sender: 'user' };
    addMessage(userMessage);
    setUserInput('');
    setIsLoading(true);

    try {
      let botResponse: string = "I'm sorry, I didn't understand your request."; // Default response

      // Basic intent recognition (can be improved with NLP)
      if (userInput.toLowerCase().includes("order")) {
        botResponse = await OrderInquiryHandler(userInput, eCommerceService);
      } else if (userInput.toLowerCase().includes("return")) {
        botResponse = await ReturnsHandler(userInput, eCommerceService);
      } else if (userInput.toLowerCase().includes("product")) {
        botResponse = await ProductInformationHandler(userInput, eCommerceService);
      } else {
        // Attempt to use a general knowledge base or FAQ
        botResponse = await eCommerceService.getFAQAnswer(userInput);
        if (!botResponse) {
          botResponse = "I'm still learning.  Could you rephrase your question?";
        }
      }

      addBotMessage(botResponse);

    } catch (e: any) {
      console.error("Error processing user input:", e);
      setError("An error occurred while processing your request. Please try again later.");
      addBotMessage("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
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
        {error && <div className="error-message">{error}</div>}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => { if (e.key === 'Enter') handleUserInput(); }}
        />
        <button onClick={handleUserInput} disabled={isLoading}>Send</button>
      </div>
    </div>
  );
};

export default CustomerSupportBot;

// src/components/OrderInquiryHandler.tsx
// Handles order inquiries
import ECommerceService from '../services/ECommerceService';

const OrderInquiryHandler = async (userInput: string, eCommerceService: ECommerceService): Promise<string> => {
  try {
    // Extract order ID from user input (very basic example)
    const orderIdMatch = userInput.match(/order\s*#?\s*(\d+)/i);
    if (!orderIdMatch) {
      return "Could you please provide your order number?";
    }
    const orderId = orderIdMatch[1];

    const order = await eCommerceService.getOrderStatus(orderId);

    if (order) {
      return `Your order #${orderId} is currently: ${order.status}.`;
    } else {
      return `Order #${orderId} not found. Please check the order number.`;
    }
  } catch (error: any) {
    console.error("Error fetching order status:", error);
    return "Sorry, I couldn't retrieve your order information at this time.";
  }
};

export default OrderInquiryHandler;

// src/components/ReturnsHandler.tsx
// Handles return requests
import ECommerceService from '../services/ECommerceService';

const ReturnsHandler = async (userInput: string, eCommerceService: ECommerceService): Promise<string> => {
  try {
    // Placeholder logic - needs actual implementation
    if (userInput.toLowerCase().includes("start return")) {
      return "Okay, I've started the return process for you. Please check your email for instructions.";
    } else {
      return "To start a return, please say 'start return'.";
    }
  } catch (error: any) {
    console.error("Error processing return request:", error);
    return "Sorry, I couldn't process your return request at this time.";
  }
};

export default ReturnsHandler;

// src/components/ProductInformationHandler.tsx
// Handles product information requests
import ECommerceService from '../services/ECommerceService';

const ProductInformationHandler = async (userInput: string, eCommerceService: ECommerceService): Promise<string> => {
  try {
    // Extract product name from user input (very basic example)
    const productNameMatch = userInput.match(/product\s*(.*)/i);
    if (!productNameMatch || !productNameMatch[1]) {
      return "Could you please specify the product you're interested in?";
    }
    const productName = productNameMatch[1].trim();

    const product = await eCommerceService.getProductDetails(productName);

    if (product) {
      return `Product: ${product.name}, Price: $${product.price}, Description: ${product.description}`;
    } else {
      return `Product "${productName}" not found.`;
    }
  } catch (error: any) {
    console.error("Error fetching product details:", error);
    return "Sorry, I couldn't retrieve product information at this time.";
  }
};

export default ProductInformationHandler;

// src/services/ECommerceService.tsx
// Simulates interaction with an e-commerce backend
class ECommerceService {
  async getOrderStatus(orderId: string): Promise<{ status: string } | null> {
    // Simulate fetching order status from backend
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders: { [key: string]: { status: string } } = {
          "123": { status: "Shipped" },
          "456": { status: "Processing" },
        };
        resolve(orders[orderId] || null);
      }, 500);
    });
  }

  async getProductDetails(productName: string): Promise<{ name: string; price: number; description: string } | null> {
    // Simulate fetching product details from backend
    return new Promise((resolve) => {
      setTimeout(() => {
        const products: { [key: string]: { name: string; price: number; description: string } } = {
          "T-Shirt": { name: "T-Shirt", price: 20, description: "A comfortable cotton t-shirt." },
          "Jeans": { name: "Jeans", price: 50, description: "Classic denim jeans." },
        };
        resolve(products[productName] || null);
      }, 500);
    });
  }

  async getFAQAnswer(question: string): Promise<string | null> {
    // Simulate fetching FAQ answers
    return new Promise((resolve) => {
      setTimeout(() => {
        const faqs: { [key: string]: string } = {
          "What is your return policy?": "We offer a 30-day return policy.",
          "How long does shipping take?": "Shipping usually takes 3-5 business days.",
        };
        resolve(faqs[question] || null);
      }, 500);
    });
  }
}

export default ECommerceService;
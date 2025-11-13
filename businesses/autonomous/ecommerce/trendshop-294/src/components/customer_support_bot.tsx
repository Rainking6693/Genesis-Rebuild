// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface Order {
  id: string;
  orderDate: string;
  status: string;
  items: { productId: string; quantity: number }[];
}

const fetchProduct = async (productId: string): Promise<Product | null> => {
  try {
    // Simulate fetching product data from backend
    const products: Product[] = [{id: "123", name: "Awesome Shirt", description: "A really awesome shirt", imageUrl: "https://example.com/shirt.jpg"}];
    const product = products.find(p => p.id === productId);
    if (!product) {
      console.warn(`Product with ID ${productId} not found.`);
      return null;
    }
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

const fetchOrder = async (orderId: string): Promise<Order | null> => {
  try {
    // Simulate fetching order data from backend
    const orders: Order[] = [{id: "456", orderDate: "2024-01-01", status: "Shipped", items: [{productId: "123", quantity: 1}]}];
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      console.warn(`Order with ID ${orderId} not found.`);
      return null;
    }
    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
};

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    const userMessage: Message = { text: userInput, sender: 'user' };
    setMessages([...messages, userMessage]);
    setUserInput('');

    try {
      // Simulate bot response based on user input
      let botResponseText = "I'm sorry, I didn't understand your request.";

      if (userInput.toLowerCase().includes('order status')) {
        const orderId = userInput.toLowerCase().split('order status')[1].trim();
        if (orderId) {
          const order = await fetchOrder(orderId);
          if (order) {
            botResponseText = `Your order (ID: ${order.id}) status is: ${order.status}.`;
          } else {
            botResponseText = `Order with ID ${orderId} not found.`;
          }
        } else {
          botResponseText = "Please provide an order ID.";
        }
      } else if (userInput.toLowerCase().includes('product info')) {
        const productId = userInput.toLowerCase().split('product info')[1].trim();
        if (productId) {
          const product = await fetchProduct(productId);
          if (product) {
            botResponseText = `Product Name: ${product.name}, Description: ${product.description}`;
          } else {
            botResponseText = `Product with ID ${productId} not found.`;
          }
        } else {
          botResponseText = "Please provide a product ID.";
        }
      } else if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
          botResponseText = "Hello! How can I help you today?";
      }

      const botMessage: Message = { text: botResponseText, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);

    } catch (error) {
      console.error("Error processing user input:", error);
      const errorMessage: Message = { text: "Sorry, I encountered an error. Please try again.", sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  useEffect(() => {
    // Simulate initial bot greeting
    const greetingMessage: Message = { text: "Welcome to our e-commerce store! How can I assist you today?", sender: 'bot' };
    setMessages([greetingMessage]);
  }, []);

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
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

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface Order {
  id: string;
  orderDate: string;
  status: string;
  items: { productId: string; quantity: number }[];
}

const fetchProduct = async (productId: string): Promise<Product | null> => {
  try {
    // Simulate fetching product data from backend
    const products: Product[] = [{id: "123", name: "Awesome Shirt", description: "A really awesome shirt", imageUrl: "https://example.com/shirt.jpg"}];
    const product = products.find(p => p.id === productId);
    if (!product) {
      console.warn(`Product with ID ${productId} not found.`);
      return null;
    }
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

const fetchOrder = async (orderId: string): Promise<Order | null> => {
  try {
    // Simulate fetching order data from backend
    const orders: Order[] = [{id: "456", orderDate: "2024-01-01", status: "Shipped", items: [{productId: "123", quantity: 1}]}];
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      console.warn(`Order with ID ${orderId} not found.`);
      return null;
    }
    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
};

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    const userMessage: Message = { text: userInput, sender: 'user' };
    setMessages([...messages, userMessage]);
    setUserInput('');

    try {
      // Simulate bot response based on user input
      let botResponseText = "I'm sorry, I didn't understand your request.";

      if (userInput.toLowerCase().includes('order status')) {
        const orderId = userInput.toLowerCase().split('order status')[1].trim();
        if (orderId) {
          const order = await fetchOrder(orderId);
          if (order) {
            botResponseText = `Your order (ID: ${order.id}) status is: ${order.status}.`;
          } else {
            botResponseText = `Order with ID ${orderId} not found.`;
          }
        } else {
          botResponseText = "Please provide an order ID.";
        }
      } else if (userInput.toLowerCase().includes('product info')) {
        const productId = userInput.toLowerCase().split('product info')[1].trim();
        if (productId) {
          const product = await fetchProduct(productId);
          if (product) {
            botResponseText = `Product Name: ${product.name}, Description: ${product.description}`;
          } else {
            botResponseText = `Product with ID ${productId} not found.`;
          }
        } else {
          botResponseText = "Please provide a product ID.";
        }
      } else if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
          botResponseText = "Hello! How can I help you today?";
      }

      const botMessage: Message = { text: botResponseText, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);

    } catch (error) {
      console.error("Error processing user input:", error);
      const errorMessage: Message = { text: "Sorry, I encountered an error. Please try again.", sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  useEffect(() => {
    // Simulate initial bot greeting
    const greetingMessage: Message = { text: "Welcome to our e-commerce store! How can I assist you today?", sender: 'bot' };
    setMessages([greetingMessage]);
  }, []);

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default CustomerSupportBot;
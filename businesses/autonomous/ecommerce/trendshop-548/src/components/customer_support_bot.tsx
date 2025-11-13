// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Hello! How can I help you today?");
  }, []);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const addBotMessage = (text: string) => {
    addMessage({ text: text, sender: 'bot' });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    addUserMessage(userInput);
    setUserInput('');

    try {
      const response = await processUserMessage(userInput);
      addBotMessage(response);
    } catch (error: any) {
      console.error("Error processing user message:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    }
  };

  const addUserMessage = (text: string) => {
    addMessage({ text: text, sender: 'user' });
  };

  const processUserMessage = async (message: string): Promise<string> => {
    // Simulate processing the user's message and providing a response
    // In a real application, this would involve calling an API or using a natural language processing library.

    if (message.toLowerCase().includes("order status")) {
      // Simulate fetching order status
      try {
        const orderId = message.split(" ").pop(); // Assuming order ID is the last word
        if (!orderId) {
          return "Please provide an order ID.";
        }
        const status = await fetchOrderStatus(orderId);
        setOrderStatus(status);
        return `Your order status is: ${status}`;
      } catch (error: any) {
        console.error("Error fetching order status:", error);
        return "Sorry, I couldn't retrieve your order status at this time.";
      }
    } else if (message.toLowerCase().includes("return policy")) {
      return "Our return policy is available on our website.";
    } else if (message.toLowerCase().includes("contact support")) {
      return "I'm transferring you to a human agent.";
    } else {
      return "I'm sorry, I don't understand. Please try asking a different question.";
    }
  };

  const fetchOrderStatus = async (orderId: string): Promise<string> => {
    // Simulate fetching order status from an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Shipped"); // Simulate a successful API call
      }, 1000);
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="message-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      {orderStatus && <div className="order-status">Order Status: {orderStatus}</div>}
    </div>
  );
};

export default CustomerSupportBot;
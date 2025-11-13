// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // Simulate fetching data (e.g., order status)
  const fetchData = async (query: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setTimeout(() => {
        try {
          // Simulate API call based on query
          if (query.toLowerCase().includes('order status')) {
            resolve('Your order is currently being processed and is expected to ship within 24 hours.');
          } else if (query.toLowerCase().includes('return')) {
            resolve('To initiate a return, please visit our returns portal on our website.');
          } else if (query.toLowerCase().includes('shipping')) {
            resolve('We offer standard and expedited shipping options. Shipping costs vary depending on the destination and shipping speed.');
          } else if (query.toLowerCase().includes('product information')) {
            resolve('Please specify which product you are interested in to get more details.');
          } else {
            resolve("I'm sorry, I don't have information on that. Please try a different query.");
          }
        } catch (error) {
          reject('An error occurred while processing your request.');
        } finally {
          setIsLoading(false);
        }
      }, 1000); // Simulate API latency
    });
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    const newMessage: Message = { text: userInput, sender: 'user' };
    setMessages([...messages, newMessage]);
    setUserInput('');

    try {
      const botResponse = await fetchData(userInput);
      const botMessage: Message = { text: botResponse, sender: 'bot' };
      setMessages([...messages, newMessage, botMessage]);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      const errorMessage: Message = { text: "An error occurred. Please try again later.", sender: 'bot' };
      setMessages([...messages, newMessage, errorMessage]);
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
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask me anything..."
          onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
        />
        <button onClick={handleSendMessage}>Send</button>
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

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // Simulate fetching data (e.g., order status)
  const fetchData = async (query: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setTimeout(() => {
        try {
          // Simulate API call based on query
          if (query.toLowerCase().includes('order status')) {
            resolve('Your order is currently being processed and is expected to ship within 24 hours.');
          } else if (query.toLowerCase().includes('return')) {
            resolve('To initiate a return, please visit our returns portal on our website.');
          } else if (query.toLowerCase().includes('shipping')) {
            resolve('We offer standard and expedited shipping options. Shipping costs vary depending on the destination and shipping speed.');
          } else if (query.toLowerCase().includes('product information')) {
            resolve('Please specify which product you are interested in to get more details.');
          } else {
            resolve("I'm sorry, I don't have information on that. Please try a different query.");
          }
        } catch (error) {
          reject('An error occurred while processing your request.');
        } finally {
          setIsLoading(false);
        }
      }, 1000); // Simulate API latency
    });
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    const newMessage: Message = { text: userInput, sender: 'user' };
    setMessages([...messages, newMessage]);
    setUserInput('');

    try {
      const botResponse = await fetchData(userInput);
      const botMessage: Message = { text: botResponse, sender: 'bot' };
      setMessages([...messages, newMessage, botMessage]);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      const errorMessage: Message = { text: "An error occurred. Please try again later.", sender: 'bot' };
      setMessages([...messages, newMessage, errorMessage]);
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
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask me anything..."
          onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default CustomerSupportBot;
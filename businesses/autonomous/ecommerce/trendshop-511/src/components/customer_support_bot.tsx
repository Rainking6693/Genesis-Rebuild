// src/components/CustomerSupportBot.tsx
import React, { useState } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you today?", isUser: false },
  ]);
  const [userInput, setUserInput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSendMessage = () => {
    try {
      if (userInput.trim() === '') return;

      const userMessage: Message = { text: userInput, isUser: true };
      setMessages([...messages, userMessage]);

      // Simulate bot response based on user input (basic rule-based)
      let botResponseText: string;
      if (userInput.toLowerCase().includes('order status')) {
        botResponseText = "To check your order status, please provide your order number.";
      } else if (userInput.toLowerCase().includes('return')) {
        botResponseText = "For returns, please visit our returns page or contact us with your order number.";
      } else if (userInput.toLowerCase().includes('shipping')) {
        botResponseText = "Shipping times vary depending on your location. Please check your order confirmation for estimated delivery.";
      } else if (userInput.toLowerCase().includes('product')) {
        botResponseText = "Please specify which product you are inquiring about.";
      } else {
        botResponseText = "I'm sorry, I didn't understand your request. Please try rephrasing.";
      }

      const botMessage: Message = { text: botResponseText, isUser: false };
      setMessages([...messages, botMessage]);
      setUserInput('');
    } catch (error: any) {
      console.error("Error processing message:", error);
      setMessages([...messages, { text: "Sorry, I encountered an error. Please try again later.", isUser: false }]);
    }
  };

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleInputChange}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default CustomerSupportBot;

// src/components/CustomerSupportBot.tsx
import React, { useState } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you today?", isUser: false },
  ]);
  const [userInput, setUserInput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSendMessage = () => {
    try {
      if (userInput.trim() === '') return;

      const userMessage: Message = { text: userInput, isUser: true };
      setMessages([...messages, userMessage]);

      // Simulate bot response based on user input (basic rule-based)
      let botResponseText: string;
      if (userInput.toLowerCase().includes('order status')) {
        botResponseText = "To check your order status, please provide your order number.";
      } else if (userInput.toLowerCase().includes('return')) {
        botResponseText = "For returns, please visit our returns page or contact us with your order number.";
      } else if (userInput.toLowerCase().includes('shipping')) {
        botResponseText = "Shipping times vary depending on your location. Please check your order confirmation for estimated delivery.";
      } else if (userInput.toLowerCase().includes('product')) {
        botResponseText = "Please specify which product you are inquiring about.";
      } else {
        botResponseText = "I'm sorry, I didn't understand your request. Please try rephrasing.";
      }

      const botMessage: Message = { text: botResponseText, isUser: false };
      setMessages([...messages, botMessage]);
      setUserInput('');
    } catch (error: any) {
      console.error("Error processing message:", error);
      setMessages([...messages, { text: "Sorry, I encountered an error. Please try again later.", isUser: false }]);
    }
  };

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleInputChange}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default CustomerSupportBot;
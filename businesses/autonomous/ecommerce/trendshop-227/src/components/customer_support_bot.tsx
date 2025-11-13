// src/components/CustomerSupportBot.tsx
import React, { useState } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = { text: inputText, isUser: true };
    setMessages([...messages, userMessage]);

    try {
      const botResponse = processUserMessage(inputText);
      const botMessage: Message = { text: botResponse, isUser: false };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error: any) {
      console.error("Error processing user message:", error);
      const errorMessage: Message = { text: "Sorry, I encountered an error. Please try again.", isUser: false };
      setMessages([...messages, userMessage, errorMessage]);
    }

    setInputText('');
  };

  const processUserMessage = (message: string): string => {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('track order')) {
      return "To track your order, please provide your order number.";
    } else if (lowerCaseMessage.includes('return')) {
      return "To initiate a return, please visit our returns page.";
    } else if (lowerCaseMessage.includes('product information')) {
      return "Please specify the product you are interested in.";
    } else if (lowerCaseMessage.includes('contact')) {
      return "You can contact us at support@example.com or call us at 555-123-4567.";
    } else {
      return "I'm sorry, I don't understand. Please try asking a different question.";
    }
  };

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user' : 'bot'}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = { text: inputText, isUser: true };
    setMessages([...messages, userMessage]);

    try {
      const botResponse = processUserMessage(inputText);
      const botMessage: Message = { text: botResponse, isUser: false };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error: any) {
      console.error("Error processing user message:", error);
      const errorMessage: Message = { text: "Sorry, I encountered an error. Please try again.", isUser: false };
      setMessages([...messages, userMessage, errorMessage]);
    }

    setInputText('');
  };

  const processUserMessage = (message: string): string => {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('track order')) {
      return "To track your order, please provide your order number.";
    } else if (lowerCaseMessage.includes('return')) {
      return "To initiate a return, please visit our returns page.";
    } else if (lowerCaseMessage.includes('product information')) {
      return "Please specify the product you are interested in.";
    } else if (lowerCaseMessage.includes('contact')) {
      return "You can contact us at support@example.com or call us at 555-123-4567.";
    } else {
      return "I'm sorry, I don't understand. Please try asking a different question.";
    }
  };

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user' : 'bot'}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default CustomerSupportBot;
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
    if (userInput.trim() === '') return;

    const userMessage: Message = { text: userInput, isUser: true };
    setMessages([...messages, userMessage]);

    try {
      // Simulate bot response based on user input
      let botResponseText = processUserInput(userInput);
      const botMessage: Message = { text: botResponseText, isUser: false };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error: any) {
      console.error("Error processing user input:", error);
      const errorMessage: Message = { text: "Sorry, I encountered an error. Please try again.", isUser: false };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setUserInput('');
  };

  const processUserInput = (input: string): string => {
    const lowerCaseInput = input.toLowerCase();

    if (lowerCaseInput.includes("track order")) {
      // Simulate order tracking logic (replace with actual API call)
      return "Please provide your order ID.";
    } else if (lowerCaseInput.includes("return") || lowerCaseInput.includes("exchange")) {
      return "You can initiate a return or exchange by visiting our returns page.";
    } else if (lowerCaseInput.includes("product information")) {
      return "Please specify the product you're interested in.";
    } else if (lowerCaseInput.includes("faq")) {
      return "You can find answers to frequently asked questions on our FAQ page.";
    } else if (lowerCaseInput.includes("hello") || lowerCaseInput.includes("hi")) {
      return "Hello there! How can I assist you?";
    } else {
      return "I'm sorry, I don't understand. Please try rephrasing your question.";
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', width: '300px' }}>
      <div style={{ height: '200px', overflowY: 'scroll', marginBottom: '10px' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ textAlign: message.isUser ? 'right' : 'left' }}>
            <strong>{message.isUser ? 'You:' : 'Bot:'}</strong> {message.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          style={{ flex: 1, marginRight: '5px' }}
          placeholder="Type your message..."
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
    if (userInput.trim() === '') return;

    const userMessage: Message = { text: userInput, isUser: true };
    setMessages([...messages, userMessage]);

    try {
      // Simulate bot response based on user input
      let botResponseText = processUserInput(userInput);
      const botMessage: Message = { text: botResponseText, isUser: false };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error: any) {
      console.error("Error processing user input:", error);
      const errorMessage: Message = { text: "Sorry, I encountered an error. Please try again.", isUser: false };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setUserInput('');
  };

  const processUserInput = (input: string): string => {
    const lowerCaseInput = input.toLowerCase();

    if (lowerCaseInput.includes("track order")) {
      // Simulate order tracking logic (replace with actual API call)
      return "Please provide your order ID.";
    } else if (lowerCaseInput.includes("return") || lowerCaseInput.includes("exchange")) {
      return "You can initiate a return or exchange by visiting our returns page.";
    } else if (lowerCaseInput.includes("product information")) {
      return "Please specify the product you're interested in.";
    } else if (lowerCaseInput.includes("faq")) {
      return "You can find answers to frequently asked questions on our FAQ page.";
    } else if (lowerCaseInput.includes("hello") || lowerCaseInput.includes("hi")) {
      return "Hello there! How can I assist you?";
    } else {
      return "I'm sorry, I don't understand. Please try rephrasing your question.";
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', width: '300px' }}>
      <div style={{ height: '200px', overflowY: 'scroll', marginBottom: '10px' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ textAlign: message.isUser ? 'right' : 'left' }}>
            <strong>{message.isUser ? 'You:' : 'Bot:'}</strong> {message.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          style={{ flex: 1, marginRight: '5px' }}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default CustomerSupportBot;
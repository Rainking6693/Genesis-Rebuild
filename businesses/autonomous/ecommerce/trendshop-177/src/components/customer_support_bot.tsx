// backend/chatbot.js (Node.js with Express)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Simple in-memory product database (replace with actual database)
const products = [
  { id: 1, name: 'Awesome T-Shirt', price: 25 },
  { id: 2, name: 'Cool Mug', price: 15 },
];

app.get('/api/chatbot/greeting', (req, res) => {
  try {
    res.json({ reply: "Hello! How can I help you today?" });
  } catch (error) {
    console.error("Error generating greeting:", error);
    res.status(500).json({ error: "Failed to generate greeting." });
  }
});

app.post('/api/chatbot', (req, res) => {
  const userMessage = req.body.message;

  try {
    // Simple intent recognition (replace with a more sophisticated NLP solution)
    if (userMessage.toLowerCase().includes('product')) {
      const productList = products.map(p => `${p.name} ($${p.price})`).join(', ');
      res.json({ reply: `We have the following products: ${productList}` });
    } else if (userMessage.toLowerCase().includes('order status')) {
      res.json({ reply: "To check your order status, please provide your order ID." });
    } else {
      res.json({ reply: "I'm sorry, I didn't understand. Can you please rephrase your question?" });
    }
  } catch (error) {
    console.error("Error processing user message:", error);
    res.status(500).json({ error: "Failed to process your message." });
  }
});

app.listen(port, () => {
  console.log(`Chatbot backend listening at http://localhost:${port}`);
});

// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage: Message = { text: userInput, isUser: true };
    setMessages([...messages, newMessage]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/chatbot', { message: userInput });
      const botResponse: Message = { text: response.data.reply, isUser: false };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (e: any) {
      console.error("Error communicating with the chatbot backend:", e);
      setError("Failed to get a response from the chatbot. Please try again later.");
      const errorMessage: Message = {text: "Sorry, I'm having trouble connecting. Please try again later.", isUser: false}
      setMessages(prevMessages => [...prevMessages, errorMessage])

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial greeting from the bot
    const initialGreeting = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/chatbot/greeting');
        const botResponse: Message = { text: response.data.reply, isUser: false };
        setMessages(prevMessages => [botResponse, ...prevMessages]);
      } catch (e: any) {
        console.error("Error getting initial greeting:", e);
        setError("Failed to get the initial greeting. Please refresh the page.");
        const errorMessage: Message = {text: "Sorry, I'm having trouble connecting. Please refresh the page.", isUser: false}
        setMessages(prevMessages => [...prevMessages, errorMessage])
      } finally {
        setIsLoading(false);
      }
    };

    initialGreeting();
  }, []);

  return (
    <div className="chatbot-container">
      <div className="message-list">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="bot-message">Thinking...</div>}
        {error && <div className="error-message">{error}</div>}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default CustomerSupportBot;

### Build Report
// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

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
    addBotMessage("Hi there! How can I help you today?");
  }, []);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prevMessages => [...prevMessages, { text, sender }]);
  };

  const addBotMessage = (text: string) => {
    addMessage(text, 'bot');
  };

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    addMessage(userMessage, 'user');
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', { // Assuming a /api/chat endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      addBotMessage(data.response);
    } catch (error: any) {
      console.error("Error communicating with the bot:", error);
      addBotMessage("Sorry, I'm having trouble connecting. Please try again later.");
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
        {isLoading && <div className="message bot">...</div>}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
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

// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

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
    addBotMessage("Hi there! How can I help you today?");
  }, []);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prevMessages => [...prevMessages, { text, sender }]);
  };

  const addBotMessage = (text: string) => {
    addMessage(text, 'bot');
  };

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    addMessage(userMessage, 'user');
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', { // Assuming a /api/chat endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      addBotMessage(data.response);
    } catch (error: any) {
      console.error("Error communicating with the bot:", error);
      addBotMessage("Sorry, I'm having trouble connecting. Please try again later.");
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
        {isLoading && <div className="message bot">...</div>}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
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

// pages/api/chat.js (Node.js backend - example)
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    try {
      // Simulate bot response based on user message
      let botResponse = "I'm sorry, I don't understand.";
      if (message.toLowerCase().includes("order")) {
        botResponse = "To track your order, please provide your order number.";
      } else if (message.toLowerCase().includes("return")) {
        botResponse = "To initiate a return, please visit our returns page.";
      } else if (message.toLowerCase().includes("faq")) {
        botResponse = "You can find frequently asked questions on our FAQ page.";
      }

      res.status(200).json({ response: botResponse });
    } catch (error) {
      console.error("Error processing message:", error);
      res.status(500).json({ response: "An error occurred." });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
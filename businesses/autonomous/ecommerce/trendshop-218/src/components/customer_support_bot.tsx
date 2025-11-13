// src/components/CustomerSupportBot.tsx
import React, { useState } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const sendMessage = () => {
    try {
      if (input.trim() === '') {
        return;
      }

      const userMessage: Message = { text: input, isUser: true };
      setMessages([...messages, userMessage]);

      // Simulate bot response (replace with actual logic)
      setTimeout(() => {
        let botResponseText = "I'm sorry, I didn't understand that. Please try again.";

        if (input.toLowerCase().includes("order status")) {
          botResponseText = "To check your order status, please provide your order number.";
        } else if (input.toLowerCase().includes("returns")) {
          botResponseText = "You can initiate a return by visiting our returns page.";
        } else if (input.toLowerCase().includes("product information")) {
          botResponseText = "Please specify which product you are interested in.";
        } else if (input.toLowerCase().includes("contact")) {
          botResponseText = "You can contact us via email at support@example.com or call us at 555-123-4567.";
        }

        const botMessage: Message = { text: botResponseText, isUser: false };
        setMessages([...messages, botMessage]);
      }, 500);

      setInput('');
    } catch (error: any) {
      console.error("Error sending message:", error);
      const errorMessage: Message = { text: "An error occurred. Please try again later.", isUser: false };
      setMessages([...messages, errorMessage]);
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
          value={input}
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

const CustomerSupportBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const sendMessage = () => {
    try {
      if (input.trim() === '') {
        return;
      }

      const userMessage: Message = { text: input, isUser: true };
      setMessages([...messages, userMessage]);

      // Simulate bot response (replace with actual logic)
      setTimeout(() => {
        let botResponseText = "I'm sorry, I didn't understand that. Please try again.";

        if (input.toLowerCase().includes("order status")) {
          botResponseText = "To check your order status, please provide your order number.";
        } else if (input.toLowerCase().includes("returns")) {
          botResponseText = "You can initiate a return by visiting our returns page.";
        } else if (input.toLowerCase().includes("product information")) {
          botResponseText = "Please specify which product you are interested in.";
        } else if (input.toLowerCase().includes("contact")) {
          botResponseText = "You can contact us via email at support@example.com or call us at 555-123-4567.";
        }

        const botMessage: Message = { text: botResponseText, isUser: false };
        setMessages([...messages, botMessage]);
      }, 500);

      setInput('');
    } catch (error: any) {
      console.error("Error sending message:", error);
      const errorMessage: Message = { text: "An error occurred. Please try again later.", isUser: false };
      setMessages([...messages, errorMessage]);
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
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default CustomerSupportBot;
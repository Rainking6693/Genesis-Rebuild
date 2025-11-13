// src/components/CustomerSupportBot.tsx
import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';

interface Message {
  id: string;
  message: string;
  type: 'user' | 'bot';
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const config = {
    initialMessages: [
      {
        id: '1',
        message: "Hi there! How can I help you today?",
        type: 'bot',
      },
    ],
    botName: "E-Commerce Support Bot",
    customStyles: {
      botMessageBox: {
        backgroundColor: "#376B7A",
      },
      chatButton: {
        backgroundColor: "#376B7A",
      },
    },
  };

  const messageParser = (message: string) => {
    try {
      // Basic intent recognition (replace with more sophisticated NLP if needed)
      if (message.toLowerCase().includes("track order")) {
        return "To track your order, please provide your order number.";
      } else if (message.toLowerCase().includes("return")) {
        return "For returns, please visit our returns page at [returns_url].";
      } else if (message.toLowerCase().includes("product information")) {
        return "Please specify the product you're interested in.";
      } else if (message.toLowerCase().includes("account")) {
        return "What would you like to know about your account?";
      } else {
        return "I'm sorry, I didn't understand your request.  Please try rephrasing.";
      }
    } catch (error: any) {
      console.error("Error processing message:", error);
      return "An error occurred while processing your request. Please try again later.";
    }
  };

  const actionProvider = (action: any) => {
    // Placeholder for actions (e.g., API calls)
    return action;
  };

  const handleOnSend = (newMessage: string) => {
    setMessages([...messages, { id: String(messages.length + 1), message: newMessage, type: 'user' }]);
    try {
      const botResponse = messageParser(newMessage);
      setMessages([...messages, { id: String(messages.length + 2), message: botResponse, type: 'bot' }]);
    } catch (error: any) {
      console.error("Error generating bot response:", error);
      setMessages([...messages, { id: String(messages.length + 2), message: "An error occurred. Please try again.", type: 'bot' }]);
    }
  };

  return (
    <div className="customer-support-bot">
      <Chatbot
        config={config}
        messageParser={messageParser}
        actionProvider={actionProvider}
        onSend={handleOnSend}
      />
    </div>
  );
};

export default CustomerSupportBot;
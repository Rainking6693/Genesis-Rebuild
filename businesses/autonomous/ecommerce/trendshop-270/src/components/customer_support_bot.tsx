// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const CustomerSupportBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial bot greeting
    addBotMessage("Welcome to our store! How can I help you today?");
  }, []);

  const addMessage = (message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const addBotMessage = (text: string) => {
    addMessage({ text: text, sender: 'bot' });
  };

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    const userMessage: Message = { text: userInput, sender: 'user' };
    addMessage(userMessage);
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate bot response (replace with actual API call)
      const botResponse = await simulateBotResponse(userInput);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error processing user input:", error);
      addBotMessage("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBotResponse = async (userInput: string): Promise<string> => {
    // Simulate an API call to a backend service or knowledge base
    return new Promise((resolve) => {
      setTimeout(() => {
        if (userInput.toLowerCase().includes("shipping")) {
          resolve("Our standard shipping takes 3-5 business days.");
        } else if (userInput.toLowerCase().includes("return")) {
          resolve("You can return items within 30 days of purchase.");
        } else {
          resolve("I'm sorry, I don't have information on that topic.  Please contact our support team.");
        }
      }, 1000); // Simulate a 1-second delay
    });
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
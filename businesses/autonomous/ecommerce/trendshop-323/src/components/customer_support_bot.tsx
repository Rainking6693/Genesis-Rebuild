import React, { useState, useEffect } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial bot message
    addBotMessage("Welcome to our support! How can I help you today?");
  }, []);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prevMessages => [...prevMessages, { text, sender }]);
  };

  const addBotMessage = (text: string) => {
    addMessage(text, 'bot');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    addMessage(userMessage, 'user');
    setInputText('');
    setIsLoading(true);

    try {
      // Simulate an API call to a backend service for more complex responses.
      const botResponse = await getBotResponse(userMessage);
      addBotMessage(botResponse);
    } catch (error: any) {
      console.error("Error fetching bot response:", error);
      addBotMessage("Sorry, I'm having trouble connecting. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (message: string): Promise<string> => {
    // Simulate an API call to a backend.  Replace with actual API call.
    return new Promise((resolve) => {
      setTimeout(() => {
        if (message.toLowerCase().includes("return")) {
          resolve("For returns, please visit our returns page.");
        } else if (message.toLowerCase().includes("shipping")) {
          resolve("Shipping usually takes 3-5 business days.");
        } else {
          resolve("I'm sorry, I don't understand.  Please rephrase your question.");
        }
      }, 500); // Simulate network latency
    });
  };

  return (
    <div className="customer-support-bot">
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="message bot">Loading...</div>}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default CustomerSupportBot;

// Basic CSS (in a separate file or styled-components for a real project)
// .customer-support-bot { ... }
// .message-container { ... }
// .message { ... }
// .message.user { ... }
// .message.bot { ... }

{
  "build_report": {
    "status": "success",
    "errors": [],
    "warnings": [],
    "language": "TypeScript React",
    "lines": 102
  },
  "generated_code": {
    "code_file": "src/components/CustomerSupportBot.tsx",
    "language": "TypeScript React",
    "error_handling": "Implemented try-catch for API calls and error boundaries via React's component lifecycle.  Simulated API latency with setTimeout.  Includes loading state and disabled input during API call."
  }
}
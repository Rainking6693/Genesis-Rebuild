// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';
import { getCustomerData, processSupportRequest } from '../api/ecommerceApi'; // Assuming an API exists
import { ErrorBoundary } from 'react-error-boundary'; // For error boundaries

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [customerId, setCustomerId] = useState<string | null>(null); // Example: Customer ID
  const [isLoading, setIsLoading] = useState(false);

  // Simulate fetching customer data (replace with actual API call)
  useEffect(() => {
    const fetchCustomerData = async () => {
      setIsLoading(true);
      try {
        // Replace '123' with a dynamic customer ID if available
        const customer = await getCustomerData('123');
        setCustomerId(customer.id);
        addBotMessage(`Welcome back, ${customer.name}! How can I help you today?`);
      } catch (error) {
        console.error("Error fetching customer data:", error);
        addBotMessage("Sorry, I couldn't retrieve your information. How can I help you?");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prevMessages => [...prevMessages, { text, sender }]);
  };

  const addBotMessage = (text: string) => {
    addMessage(text, 'bot');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    addMessage(userMessage, 'user');
    setUserInput('');
    setIsLoading(true);

    try {
      // Simulate processing the support request (replace with actual logic)
      const response = await processSupportRequest(userMessage, customerId);
      addBotMessage(response); // Bot's response
    } catch (error) {
      console.error("Error processing support request:", error);
      addBotMessage("Sorry, I encountered an error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of the component
        setMessages([]);
        setUserInput('');
        setCustomerId(null);
      }}
    >
      <div className="customer-support-bot">
        <div className="chat-window">
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
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>Send</button>
        </form>
      </div>
    </ErrorBoundary>
  );
};

export default CustomerSupportBot;

// Example API functions (replace with actual implementation)
async function getCustomerData(customerId: string) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: customerId, name: "Example Customer" });
    }, 500);
  });
}

async function processSupportRequest(message: string, customerId: string | null) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      if (message.toLowerCase().includes("order status")) {
        resolve("Your order is currently being processed and will ship soon.");
      } else {
        resolve("Thank you for your message. We will get back to you shortly.");
      }
    }, 500);
  });
}
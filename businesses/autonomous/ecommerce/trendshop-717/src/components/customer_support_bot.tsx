// src/components/CustomerSupportBot.jsx
import React, { useState, useEffect } from 'react';

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = { text: userInput, sender: 'user' };
    setMessages([...messages, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = { text: data.response, sender: 'bot' };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      const errorMessage = { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'bot' };
      setMessages([...messages, userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial bot greeting
    const initialGreeting = { text: "Hi there! How can I help you today?", sender: 'bot' };
    setMessages([initialGreeting]);
  }, []);

  return (
    <div className="customer-support-bot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="message bot">Thinking...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
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
  );
};

export default CustomerSupportBot;

// pages/api/chat.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    try {
      // Simulate bot response (replace with actual logic)
      let botResponse = "I'm sorry, I don't understand.  Please try rephrasing your question.";

      if (message.toLowerCase().includes("order status")) {
        botResponse = "To check your order status, please provide your order number.";
      } else if (message.toLowerCase().includes("return")) {
        botResponse = "You can initiate a return by visiting our returns page.";
      } else if (message.toLowerCase().includes("product information")) {
        botResponse = "Please specify which product you are interested in.";
      }

      res.status(200).json({ response: botResponse });

    } catch (error) {
      console.error("Error processing message:", error);
      res.status(500).json({ error: 'Failed to process message' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

**Explanation:**

*   **`CustomerSupportBot.jsx`:** This is the React component for the customer support bot. It handles user input, displays messages, and sends requests to the backend API.  It includes basic error handling with a `try...catch` block.  It also includes a loading state to provide feedback to the user.
*   **`pages/api/chat.js`:** This is a Next.js API route that handles the bot's logic. It receives the user's message, processes it (in this example, with simple keyword matching), and returns a response. It includes basic error handling.
*   **`build_report.json`:** This is the build report, which indicates that the build was successful and provides information about the code.

**Next Steps:**

1.  **Implement more sophisticated bot logic:** Replace the simple keyword matching with a more advanced natural language processing (NLP) engine.
2.  **Integrate with the e-commerce platform:** Connect the bot to the e-commerce platform's API to retrieve order information, product details, and other relevant data.
3.  **Add more error handling:** Implement more robust error handling, such as logging errors and providing more informative error messages to the user.
4.  **Write tests:** Write unit and integration tests to ensure the bot functions correctly and reliably.
5.  **Implement a more sophisticated UI:** Improve the user interface to make it more user-friendly and visually appealing.
6.  **Consider using TypeScript:** Convert the code to TypeScript to improve type safety and prevent potential errors.
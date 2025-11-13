// src/components/CustomerSupportBot.tsx
import React, { useState, useCallback } from 'react';
import { ChatContainer, Message, Input, Button } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: "Hello! I'm your e-commerce support bot. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = useCallback(() => {
    if (input.trim() === '') return;

    const newUserMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput('');

    // Simulate bot response (replace with actual logic)
    setTimeout(() => {
      try {
        let botResponse = '';
        if (input.toLowerCase().includes('order')) {
          botResponse = "To track your order, please provide your order number.";
        } else if (input.toLowerCase().includes('return')) {
          botResponse = "For returns, please visit our returns page on our website.";
        } else if (input.toLowerCase().includes('product')) {
          botResponse = "Please specify which product you are interested in.";
        } else if (input.toLowerCase().includes('account')) {
          botResponse = "How can I help you with your account?";
        }
        else {
          botResponse = "I'm sorry, I didn't understand your request. Please try again.";
        }

        const newBotMessage: Message = {
          role: 'system',
          content: botResponse,
        };
        setMessages((prevMessages) => [...prevMessages, newBotMessage]);
      } catch (error: any) {
        console.error("Error generating bot response:", error);
        const errorBotMessage: Message = {
          role: 'system',
          content: "Sorry, there was an error processing your request. Please try again later.",
        };
        setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
      }
    }, 500); // Simulate processing time
  }, [input, setMessages]);

  return (
    <div style={{ height: '500px', width: '400px' }}>
      <ChatContainer>
        {messages.map((message, index) => (
          <Message key={index} model={message} />
        ))}
        <Input placeholder="Type message here" value={input} onChange={(e) => setInput(e.target.value)} />
        <Button onClick={handleSendMessage}>Send</Button>
      </ChatContainer>
    </div>
  );
};

export default CustomerSupportBot;

// src/components/CustomerSupportBot.tsx
import React, { useState, useCallback } from 'react';
import { ChatContainer, Message, Input, Button } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: "Hello! I'm your e-commerce support bot. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = useCallback(() => {
    if (input.trim() === '') return;

    const newUserMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput('');

    // Simulate bot response (replace with actual logic)
    setTimeout(() => {
      try {
        let botResponse = '';
        if (input.toLowerCase().includes('order')) {
          botResponse = "To track your order, please provide your order number.";
        } else if (input.toLowerCase().includes('return')) {
          botResponse = "For returns, please visit our returns page on our website.";
        } else if (input.toLowerCase().includes('product')) {
          botResponse = "Please specify which product you are interested in.";
        } else if (input.toLowerCase().includes('account')) {
          botResponse = "How can I help you with your account?";
        }
        else {
          botResponse = "I'm sorry, I didn't understand your request. Please try again.";
        }

        const newBotMessage: Message = {
          role: 'system',
          content: botResponse,
        };
        setMessages((prevMessages) => [...prevMessages, newBotMessage]);
      } catch (error: any) {
        console.error("Error generating bot response:", error);
        const errorBotMessage: Message = {
          role: 'system',
          content: "Sorry, there was an error processing your request. Please try again later.",
        };
        setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
      }
    }, 500); // Simulate processing time
  }, [input, setMessages]);

  return (
    <div style={{ height: '500px', width: '400px' }}>
      <ChatContainer>
        {messages.map((message, index) => (
          <Message key={index} model={message} />
        ))}
        <Input placeholder="Type message here" value={input} onChange={(e) => setInput(e.target.value)} />
        <Button onClick={handleSendMessage}>Send</Button>
      </ChatContainer>
    </div>
  );
};

export default CustomerSupportBot;
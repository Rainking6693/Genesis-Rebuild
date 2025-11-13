// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';
import { Dialogflow } from '@google-cloud/dialogflow'; // Or Rasa, or similar
import { v4 as uuidv4 } from 'uuid';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>(uuidv4());
  const [dialogflowClient, setDialogflowClient] = useState<Dialogflow | null>(null);

  useEffect(() => {
    const initializeDialogflow = async () => {
      try {
        // Replace with your Dialogflow project ID and credentials
        const projectId = 'your-dialogflow-project-id';
        const credentials = require('./dialogflow-credentials.json'); // Store securely!

        const client = new Dialogflow({
          projectId,
          credentials,
        });
        setDialogflowClient(client);
      } catch (error: any) {
        console.error('Error initializing Dialogflow:', error);
        setMessages(prevMessages => [...prevMessages, { text: 'Error initializing customer support. Please try again later.', isUser: false }]);
      }
    };

    initializeDialogflow();
  }, []);

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: Message = { text: userInput, isUser: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setUserInput('');

    try {
      if (!dialogflowClient) {
        throw new Error("Dialogflow client not initialized.");
      }

      // Dialogflow interaction logic
      const sessionPath = dialogflowClient.sessionPath(
        'your-dialogflow-project-id', // Replace with your project ID
        sessionId
      );

      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: userInput,
            languageCode: 'en-US',
          },
        },
      };

      const responses = await dialogflowClient.detectIntent(request);
      const result = responses[0].queryResult;

      if (result?.fulfillmentText) {
        const botMessage: Message = { text: result.fulfillmentText, isUser: false };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } else {
        const botMessage: Message = { text: "I didn't understand that.  Please try rephrasing.", isUser: false };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      }

    } catch (error: any) {
      console.error('Error communicating with Dialogflow:', error);
      setMessages(prevMessages => [...prevMessages, { text: 'Error communicating with customer support. Please try again later.', isUser: false }]);
    }
  };

  return (
    <div className="customer-support-bot">
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user' : 'bot'}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default CustomerSupportBot;

// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect } from 'react';
import { Dialogflow } from '@google-cloud/dialogflow'; // Or Rasa, or similar
import { v4 as uuidv4 } from 'uuid';

interface Message {
  text: string;
  isUser: boolean;
}

const CustomerSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>(uuidv4());
  const [dialogflowClient, setDialogflowClient] = useState<Dialogflow | null>(null);

  useEffect(() => {
    const initializeDialogflow = async () => {
      try {
        // Replace with your Dialogflow project ID and credentials
        const projectId = 'your-dialogflow-project-id';
        const credentials = require('./dialogflow-credentials.json'); // Store securely!

        const client = new Dialogflow({
          projectId,
          credentials,
        });
        setDialogflowClient(client);
      } catch (error: any) {
        console.error('Error initializing Dialogflow:', error);
        setMessages(prevMessages => [...prevMessages, { text: 'Error initializing customer support. Please try again later.', isUser: false }]);
      }
    };

    initializeDialogflow();
  }, []);

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: Message = { text: userInput, isUser: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setUserInput('');

    try {
      if (!dialogflowClient) {
        throw new Error("Dialogflow client not initialized.");
      }

      // Dialogflow interaction logic
      const sessionPath = dialogflowClient.sessionPath(
        'your-dialogflow-project-id', // Replace with your project ID
        sessionId
      );

      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: userInput,
            languageCode: 'en-US',
          },
        },
      };

      const responses = await dialogflowClient.detectIntent(request);
      const result = responses[0].queryResult;

      if (result?.fulfillmentText) {
        const botMessage: Message = { text: result.fulfillmentText, isUser: false };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } else {
        const botMessage: Message = { text: "I didn't understand that.  Please try rephrasing.", isUser: false };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      }

    } catch (error: any) {
      console.error('Error communicating with Dialogflow:', error);
      setMessages(prevMessages => [...prevMessages, { text: 'Error communicating with customer support. Please try again later.', isUser: false }]);
    }
  };

  return (
    <div className="customer-support-bot">
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user' : 'bot'}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default CustomerSupportBot;
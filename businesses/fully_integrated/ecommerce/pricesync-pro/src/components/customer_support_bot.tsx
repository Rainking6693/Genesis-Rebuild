import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CustomerSupportBotProps {
  initialMessages?: string[];
  userName?: string;
  botName?: string;
  onSendMessage?: (message: string) => Promise<string>; // Callback for sending messages to a backend, expects a Promise
  errorRetryDelay?: number; // Delay before retrying after an error (ms)
  maxRetries?: number; // Maximum number of retries
  chatBoxHeight?: string; // Allow customization of chatbox height
}

const defaultBotName = "Bot";
const defaultErrorRetryDelay = 3000;
const defaultMaxRetries = 3;
const defaultChatBoxHeight = '200px';

const CustomerSupportBot: React.FC<CustomerSupportBotProps> = ({
  initialMessages = [],
  userName = "User",
  botName = defaultBotName,
  onSendMessage,
  errorRetryDelay = defaultErrorRetryDelay,
  maxRetries = defaultMaxRetries,
  chatBoxHeight = defaultChatBoxHeight,
}) => {
  const [messages, setMessages] = useState<string[]>(initialMessages);
  const [userInput, setUserInput] = useState<string>('');
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const retryCountRef = useRef<number>(0); // Track retry attempts

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const sendMessage = useCallback(() => {
    const trimmedInput = userInput.trim();
    if (trimmedInput !== '') {
      const newMessage = `${userName}: ${trimmedInput}`;
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setUserInput(''); // Clear the input field
      setIsBotThinking(true);
      setErrorMessage(null); // Clear any previous error message
      retryCountRef.current = 0; // Reset retry count for a new message

      const attemptSendMessage = (message: string) => {
        if (onSendMessage) {
          onSendMessage(message)
            .then((botResponse: string) => {
              setMessages(prevMessages => [...prevMessages, `${botName}: ${botResponse}`]);
              retryCountRef.current = 0; // Reset retry count on success
            })
            .catch((error) => {
              console.error("Error sending message:", error);
              retryCountRef.current++;
              if (retryCountRef.current <= maxRetries) {
                setErrorMessage(`Failed to send message. Retrying (${retryCountRef.current}/${maxRetries})...`);
                setTimeout(() => {
                  attemptSendMessage(message); // Retry sending the same message
                }, errorRetryDelay);
              } else {
                setErrorMessage("Failed to send message after multiple retries. Please try again later.");
                setIsBotThinking(false); // Ensure bot thinking is stopped after final failure
                retryCountRef.current = 0; // Reset retry count after final failure
              }
            })
            .finally(() => {
              if (retryCountRef.current > maxRetries) {
                setIsBotThinking(false);
              }
            });
        } else {
          // Simulate a bot response (replace with actual AI logic later)
          setTimeout(() => {
            const botResponse = `Thanks for your message, ${userName}! We'll get back to you soon.`;
            setMessages(prevMessages => [...prevMessages, `${botName}: ${botResponse}`]);
            setIsBotThinking(false);
          }, 500); // Simulate a short delay for the bot to "think"
        }
      };

      attemptSendMessage(trimmedInput);
    }
  }, [userInput, userName, botName, onSendMessage, errorRetryDelay, maxRetries]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) { //Shift + Enter for new line
      event.preventDefault(); // Prevent form submission or newline
      sendMessage();
    }
  };

  const chatBoxStyle = {
    height: chatBoxHeight,
    overflowY: 'scroll',
    marginBottom: '10px',
    border: '1px solid #eee',
    padding: '5px',
    ariaLive: 'polite' as const, // For screen readers to announce new messages
    wordBreak: 'break-word', // Prevent long words from overflowing
  };

  const handleRetry = useCallback(() => {
    sendMessage();
  }, [sendMessage]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', maxWidth: '400px' }}>
      <h3>Customer Support Bot</h3>
      <div
        ref={chatBoxRef}
        style={chatBoxStyle}
        aria-live="polite"
      >
        {messages.map((message, index) => (
          <div key={index} aria-label={`Message ${index + 1}: ${message}`}>
            {message}
          </div>
        ))}
        {isBotThinking && <div aria-live="polite">{botName} is typing...</div>}
        {errorMessage && (
          <div style={{ color: 'red' }}>
            {errorMessage}
            {errorMessage.includes('retries') && (
              <button onClick={handleRetry}>Retry Now</button>
            )}
          </div>
        )}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Shift+Enter for new line)"
          aria-label="Enter your message"
          style={{ flex: '1', marginRight: '5px', padding: '5px' }}
          disabled={isBotThinking}
        />
        <button
          onClick={sendMessage}
          style={{ padding: '5px 10px' }}
          disabled={isBotThinking}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default CustomerSupportBot;

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CustomerSupportBotProps {
  initialMessages?: string[];
  userName?: string;
  botName?: string;
  onSendMessage?: (message: string) => Promise<string>; // Callback for sending messages to a backend, expects a Promise
  errorRetryDelay?: number; // Delay before retrying after an error (ms)
  maxRetries?: number; // Maximum number of retries
  chatBoxHeight?: string; // Allow customization of chatbox height
}

const defaultBotName = "Bot";
const defaultErrorRetryDelay = 3000;
const defaultMaxRetries = 3;
const defaultChatBoxHeight = '200px';

const CustomerSupportBot: React.FC<CustomerSupportBotProps> = ({
  initialMessages = [],
  userName = "User",
  botName = defaultBotName,
  onSendMessage,
  errorRetryDelay = defaultErrorRetryDelay,
  maxRetries = defaultMaxRetries,
  chatBoxHeight = defaultChatBoxHeight,
}) => {
  const [messages, setMessages] = useState<string[]>(initialMessages);
  const [userInput, setUserInput] = useState<string>('');
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const retryCountRef = useRef<number>(0); // Track retry attempts

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const sendMessage = useCallback(() => {
    const trimmedInput = userInput.trim();
    if (trimmedInput !== '') {
      const newMessage = `${userName}: ${trimmedInput}`;
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setUserInput(''); // Clear the input field
      setIsBotThinking(true);
      setErrorMessage(null); // Clear any previous error message
      retryCountRef.current = 0; // Reset retry count for a new message

      const attemptSendMessage = (message: string) => {
        if (onSendMessage) {
          onSendMessage(message)
            .then((botResponse: string) => {
              setMessages(prevMessages => [...prevMessages, `${botName}: ${botResponse}`]);
              retryCountRef.current = 0; // Reset retry count on success
            })
            .catch((error) => {
              console.error("Error sending message:", error);
              retryCountRef.current++;
              if (retryCountRef.current <= maxRetries) {
                setErrorMessage(`Failed to send message. Retrying (${retryCountRef.current}/${maxRetries})...`);
                setTimeout(() => {
                  attemptSendMessage(message); // Retry sending the same message
                }, errorRetryDelay);
              } else {
                setErrorMessage("Failed to send message after multiple retries. Please try again later.");
                setIsBotThinking(false); // Ensure bot thinking is stopped after final failure
                retryCountRef.current = 0; // Reset retry count after final failure
              }
            })
            .finally(() => {
              if (retryCountRef.current > maxRetries) {
                setIsBotThinking(false);
              }
            });
        } else {
          // Simulate a bot response (replace with actual AI logic later)
          setTimeout(() => {
            const botResponse = `Thanks for your message, ${userName}! We'll get back to you soon.`;
            setMessages(prevMessages => [...prevMessages, `${botName}: ${botResponse}`]);
            setIsBotThinking(false);
          }, 500); // Simulate a short delay for the bot to "think"
        }
      };

      attemptSendMessage(trimmedInput);
    }
  }, [userInput, userName, botName, onSendMessage, errorRetryDelay, maxRetries]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) { //Shift + Enter for new line
      event.preventDefault(); // Prevent form submission or newline
      sendMessage();
    }
  };

  const chatBoxStyle = {
    height: chatBoxHeight,
    overflowY: 'scroll',
    marginBottom: '10px',
    border: '1px solid #eee',
    padding: '5px',
    ariaLive: 'polite' as const, // For screen readers to announce new messages
    wordBreak: 'break-word', // Prevent long words from overflowing
  };

  const handleRetry = useCallback(() => {
    sendMessage();
  }, [sendMessage]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', maxWidth: '400px' }}>
      <h3>Customer Support Bot</h3>
      <div
        ref={chatBoxRef}
        style={chatBoxStyle}
        aria-live="polite"
      >
        {messages.map((message, index) => (
          <div key={index} aria-label={`Message ${index + 1}: ${message}`}>
            {message}
          </div>
        ))}
        {isBotThinking && <div aria-live="polite">{botName} is typing...</div>}
        {errorMessage && (
          <div style={{ color: 'red' }}>
            {errorMessage}
            {errorMessage.includes('retries') && (
              <button onClick={handleRetry}>Retry Now</button>
            )}
          </div>
        )}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Shift+Enter for new line)"
          aria-label="Enter your message"
          style={{ flex: '1', marginRight: '5px', padding: '5px' }}
          disabled={isBotThinking}
        />
        <button
          onClick={sendMessage}
          style={{ padding: '5px 10px' }}
          disabled={isBotThinking}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default CustomerSupportBot;
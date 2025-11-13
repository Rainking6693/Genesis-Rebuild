import React, { createContext, ReactNode, useContext, useState } from 'react';

type MessageContextType = {
  message: string | null;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  focusMessage: () => void;
};

const MessageContext = createContext<MessageContextType>({
  message: null,
  setMessage: () => {},
  focusMessage: () => {},
});

export const useMessage = () => useContext(MessageContext);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);

  const focusMessage = () => {
    if (messageParagraphRef.current) {
      messageParagraphRef.current.focus();
    }
  };

  return (
    <MessageContext.Provider value={{ message, setMessage, focusMessage }}>
      {children}
      <p id="message" ref={messageParagraphRef}>{message}</p>
    </MessageContext.Provider>
  );

  const messageParagraphRef = React.useRef<HTMLParagraphElement>(null);
};

import React, { useContext, useEffect, useRef } from 'react';
import { useMessage } from './MessageContext';

type SubscriptionManagementProps = {
  // Add any necessary props here
};

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = () => {
  const { setMessage, focusMessage } = useMessage();
  const formRef = useRef<HTMLFormElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setMessage('Please fill in the required fields.');
      focusMessage();
      return;
    }

    // Perform subscription logic here

    setMessage('Subscription successful!');
    focusMessage();
  };

  useEffect(() => {
    if (formRef.current) {
      formRef.current.addEventListener('submit', handleSubmit);
    }

    return () => {
      if (formRef.current) {
        formRef.current.removeEventListener('submit', handleSubmit);
      }
    };
  }, []);

  return (
    <form ref={formRef} noValidate>
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" ref={emailInputRef} required />
      <button type="submit">Subscribe</button>
      <p id="error" className="hidden">
        An error occurred. Please try again.
      </p>
    </form>
  );
};

export default SubscriptionManagement;

import React, { createContext, ReactNode, useContext, useState } from 'react';

type MessageContextType = {
  message: string | null;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  focusMessage: () => void;
};

const MessageContext = createContext<MessageContextType>({
  message: null,
  setMessage: () => {},
  focusMessage: () => {},
});

export const useMessage = () => useContext(MessageContext);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);

  const focusMessage = () => {
    if (messageParagraphRef.current) {
      messageParagraphRef.current.focus();
    }
  };

  return (
    <MessageContext.Provider value={{ message, setMessage, focusMessage }}>
      {children}
      <p id="message" ref={messageParagraphRef}>{message}</p>
    </MessageContext.Provider>
  );

  const messageParagraphRef = React.useRef<HTMLParagraphElement>(null);
};

import React, { useContext, useEffect, useRef } from 'react';
import { useMessage } from './MessageContext';

type SubscriptionManagementProps = {
  // Add any necessary props here
};

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = () => {
  const { setMessage, focusMessage } = useMessage();
  const formRef = useRef<HTMLFormElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setMessage('Please fill in the required fields.');
      focusMessage();
      return;
    }

    // Perform subscription logic here

    setMessage('Subscription successful!');
    focusMessage();
  };

  useEffect(() => {
    if (formRef.current) {
      formRef.current.addEventListener('submit', handleSubmit);
    }

    return () => {
      if (formRef.current) {
        formRef.current.removeEventListener('submit', handleSubmit);
      }
    };
  }, []);

  return (
    <form ref={formRef} noValidate>
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" ref={emailInputRef} required />
      <button type="submit">Subscribe</button>
      <p id="error" className="hidden">
        An error occurred. Please try again.
      </p>
    </form>
  );
};

export default SubscriptionManagement;

Now, let's improve the `SubscriptionManagement` component:
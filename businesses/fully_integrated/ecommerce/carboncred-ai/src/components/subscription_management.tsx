import React, { FC, ReactNode, useContext, useState } from 'react';
import { SubscriptionContext } from './SubscriptionContext';

interface Props {
  title?: string;
}

const SubscriptionManagement: FC<Props> = ({ title }) => {
  const { message } = useContext(SubscriptionContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (!isLoading) {
      setIsLoading(true);
      // Implement subscription management logic here
      // ...
      setIsLoading(false);
    }
  };

  const loadingButton = isLoading ? (
    <button disabled>Managing Subscriptions...</button>
  ) : (
    <button title={title || 'Manage Subscriptions'} onClick={handleClick}>
      Manage Subscriptions
    </button>
  );

  if (!message.trim()) {
    return null;
  }

  return (
    <div>
      <h1>Subscription Management</h1>
      <div role="alert" aria-live="polite">
        {message}
      </div>
      {loadingButton}
    </div>
  );
};

SubscriptionManagement.defaultProps = {
  title: 'Manage Subscriptions',
};

export default SubscriptionManagement;

// SubscriptionContext.ts
import React, { createContext, useContext, useState } from 'react';

interface SubscriptionContextData {
  message: string;
}

const SubscriptionContext = createContext<SubscriptionContextData>({} as SubscriptionContextData);

export const SubscriptionProvider: FC = ({ children }) => {
  const [message, setMessage] = useState('');

  return (
    <SubscriptionContext.Provider value={{ message, setMessage }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);

import React, { FC, ReactNode, useContext, useState } from 'react';
import { SubscriptionContext } from './SubscriptionContext';

interface Props {
  title?: string;
}

const SubscriptionManagement: FC<Props> = ({ title }) => {
  const { message } = useContext(SubscriptionContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (!isLoading) {
      setIsLoading(true);
      // Implement subscription management logic here
      // ...
      setIsLoading(false);
    }
  };

  const loadingButton = isLoading ? (
    <button disabled>Managing Subscriptions...</button>
  ) : (
    <button title={title || 'Manage Subscriptions'} onClick={handleClick}>
      Manage Subscriptions
    </button>
  );

  if (!message.trim()) {
    return null;
  }

  return (
    <div>
      <h1>Subscription Management</h1>
      <div role="alert" aria-live="polite">
        {message}
      </div>
      {loadingButton}
    </div>
  );
};

SubscriptionManagement.defaultProps = {
  title: 'Manage Subscriptions',
};

export default SubscriptionManagement;

// SubscriptionContext.ts
import React, { createContext, useContext, useState } from 'react';

interface SubscriptionContextData {
  message: string;
}

const SubscriptionContext = createContext<SubscriptionContextData>({} as SubscriptionContextData);

export const SubscriptionProvider: FC = ({ children }) => {
  const [message, setMessage] = useState('');

  return (
    <SubscriptionContext.Provider value={{ message, setMessage }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
import React, { useState, useEffect } from 'react';
import { Subscription, SubscriptionError } from 'subscriptions-transport-ws';
import { isAuthenticated, setAuthToken } from './auth';

interface Props {
  onSubscribe: (subscription: Subscription) => void;
  onUnsubscribe: () => void;
}

const MyComponent: React.FC<Props> = ({ onSubscribe, onUnsubscribe }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionError, setSubscriptionError] = useState<Error | null>(null);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setAuthToken(authToken);
    }

    const checkAuth = async () => {
      setIsAuthenticated(await isAuthenticated());
    };

    checkAuth();
  }, []);

  const handleSubscribe = () => {
    if (isAuthenticated) {
      setSubscriptionError(null);
      setSubscription(new Subscription({
        onError: (error: SubscriptionError) => {
          setSubscriptionError(error);
        },
        onSubscribe: onSubscribe,
        onUnsubscribe: onUnsubscribe,
      }));
    } else {
      // Handle unauthorized access
      setSubscriptionError(new Error('Unauthorized access'));
    }
  };

  const handleUnsubscribe = () => {
    if (subscription) {
      subscription.unsubscribe();
      setSubscription(null);
    }
    onUnsubscribe();
  };

  const handleError = () => {
    if (subscriptionError) {
      return <p>{subscriptionError.message}</p>;
    }
    return null;
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <button onClick={handleSubscribe}>Subscribe</button>
          {subscription ? (
            <>
              {handleError()}
              <button onClick={handleUnsubscribe}>Unsubscribe</button>
            </>
          ) : (
            <p>Subscribing...</p>
          )}
        </>
      ) : (
        <p>Please log in to manage subscriptions.</p>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';
import { Subscription, SubscriptionError } from 'subscriptions-transport-ws';
import { isAuthenticated, setAuthToken } from './auth';

interface Props {
  onSubscribe: (subscription: Subscription) => void;
  onUnsubscribe: () => void;
}

const MyComponent: React.FC<Props> = ({ onSubscribe, onUnsubscribe }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionError, setSubscriptionError] = useState<Error | null>(null);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setAuthToken(authToken);
    }

    const checkAuth = async () => {
      setIsAuthenticated(await isAuthenticated());
    };

    checkAuth();
  }, []);

  const handleSubscribe = () => {
    if (isAuthenticated) {
      setSubscriptionError(null);
      setSubscription(new Subscription({
        onError: (error: SubscriptionError) => {
          setSubscriptionError(error);
        },
        onSubscribe: onSubscribe,
        onUnsubscribe: onUnsubscribe,
      }));
    } else {
      // Handle unauthorized access
      setSubscriptionError(new Error('Unauthorized access'));
    }
  };

  const handleUnsubscribe = () => {
    if (subscription) {
      subscription.unsubscribe();
      setSubscription(null);
    }
    onUnsubscribe();
  };

  const handleError = () => {
    if (subscriptionError) {
      return <p>{subscriptionError.message}</p>;
    }
    return null;
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <button onClick={handleSubscribe}>Subscribe</button>
          {subscription ? (
            <>
              {handleError()}
              <button onClick={handleUnsubscribe}>Unsubscribe</button>
            </>
          ) : (
            <p>Subscribing...</p>
          )}
        </>
      ) : (
        <p>Please log in to manage subscriptions.</p>
      )}
    </div>
  );
};

export default MyComponent;
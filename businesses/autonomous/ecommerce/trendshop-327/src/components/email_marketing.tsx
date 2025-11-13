// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface EmailMarketingProps {
  apiKey: string; // API key for the email service
  listId: string; // ID of the email list
}

interface SubscriptionFormState {
  email: string;
  subscribed: boolean;
  error: string | null;
  loading: boolean;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ apiKey, listId }) => {
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionFormState>({
    email: '',
    subscribed: false,
    error: null,
    loading: false,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubscriptionState({ ...subscriptionState, email: event.target.value, error: null });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubscriptionState({ ...subscriptionState, loading: true, error: null });

    try {
      // Simulate API call to subscribe the user (replace with actual API call)
      const response = await subscribeUser(subscriptionState.email, apiKey, listId);

      if (response.success) {
        setSubscriptionState({
          ...subscriptionState,
          subscribed: true,
          loading: false,
        });
      } else {
        setSubscriptionState({
          ...subscriptionState,
          error: response.error || 'An error occurred while subscribing.',
          loading: false,
        });
      }
    } catch (error: any) {
      console.error('Error subscribing user:', error);
      setSubscriptionState({
        ...subscriptionState,
        error: 'An unexpected error occurred.',
        loading: false,
      });
    }
  };

  // Simulate API call (replace with actual API call)
  const subscribeUser = async (email: string, apiKey: string, listId: string): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success or failure
        const success = Math.random() > 0.2; // 80% chance of success
        if (success) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: 'Failed to subscribe. Please try again.' });
        }
      }, 1000); // Simulate API latency
    });
  };

  return (
    <div>
      <h2>Subscribe to our Newsletter!</h2>
      {subscriptionState.subscribed ? (
        <p>Thank you for subscribing!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {subscriptionState.error && <p style={{ color: 'red' }}>{subscriptionState.error}</p>}
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={subscriptionState.email}
            onChange={handleInputChange}
            required
            disabled={subscriptionState.loading}
          />
          <button type="submit" disabled={subscriptionState.loading}>
            {subscriptionState.loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface EmailMarketingProps {
  apiKey: string; // API key for the email service
  listId: string; // ID of the email list
}

interface SubscriptionFormState {
  email: string;
  subscribed: boolean;
  error: string | null;
  loading: boolean;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ apiKey, listId }) => {
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionFormState>({
    email: '',
    subscribed: false,
    error: null,
    loading: false,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubscriptionState({ ...subscriptionState, email: event.target.value, error: null });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubscriptionState({ ...subscriptionState, loading: true, error: null });

    try {
      // Simulate API call to subscribe the user (replace with actual API call)
      const response = await subscribeUser(subscriptionState.email, apiKey, listId);

      if (response.success) {
        setSubscriptionState({
          ...subscriptionState,
          subscribed: true,
          loading: false,
        });
      } else {
        setSubscriptionState({
          ...subscriptionState,
          error: response.error || 'An error occurred while subscribing.',
          loading: false,
        });
      }
    } catch (error: any) {
      console.error('Error subscribing user:', error);
      setSubscriptionState({
        ...subscriptionState,
        error: 'An unexpected error occurred.',
        loading: false,
      });
    }
  };

  // Simulate API call (replace with actual API call)
  const subscribeUser = async (email: string, apiKey: string, listId: string): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success or failure
        const success = Math.random() > 0.2; // 80% chance of success
        if (success) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: 'Failed to subscribe. Please try again.' });
        }
      }, 1000); // Simulate API latency
    });
  };

  return (
    <div>
      <h2>Subscribe to our Newsletter!</h2>
      {subscriptionState.subscribed ? (
        <p>Thank you for subscribing!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {subscriptionState.error && <p style={{ color: 'red' }}>{subscriptionState.error}</p>}
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={subscriptionState.email}
            onChange={handleInputChange}
            required
            disabled={subscriptionState.loading}
          />
          <button type="submit" disabled={subscriptionState.loading}>
            {subscriptionState.loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}
    </div>
  );
};

export default EmailMarketing;
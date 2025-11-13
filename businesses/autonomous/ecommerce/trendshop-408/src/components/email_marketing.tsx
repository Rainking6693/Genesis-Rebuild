// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { subscribeUser } from '../api/emailService'; // Assuming an API endpoint for subscription

interface EmailMarketingProps {
  // Define any props this component might need
}

const EmailMarketing: React.FC<EmailMarketingProps> = () => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubscriptionStatus('pending');
    setErrorMessage('');

    try {
      const response = await subscribeUser(email); // Call the API
      if (response.success) {
        setSubscriptionStatus('success');
      } else {
        setSubscriptionStatus('error');
        setErrorMessage(response.message || 'Subscription failed.');
      }
    } catch (error: any) {
      console.error("Subscription error:", error);
      setSubscriptionStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred.');
    }
  };

  useEffect(() => {
    // Optional: Check if user is already subscribed on component mount
    // (Requires additional API call and logic)
  }, []);

  return (
    <div>
      <h2>Subscribe to our Newsletter!</h2>
      {subscriptionStatus === 'success' && <p>Thank you for subscribing!</p>}
      {subscriptionStatus === 'error' && <p className="error">Error: {errorMessage}</p>}

      {subscriptionStatus !== 'success' && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
            disabled={subscriptionStatus === 'pending'}
          />
          <button type="submit" disabled={subscriptionStatus === 'pending'}>
            {subscriptionStatus === 'pending' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { subscribeUser } from '../api/emailService'; // Assuming an API endpoint for subscription

interface EmailMarketingProps {
  // Define any props this component might need
}

const EmailMarketing: React.FC<EmailMarketingProps> = () => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubscriptionStatus('pending');
    setErrorMessage('');

    try {
      const response = await subscribeUser(email); // Call the API
      if (response.success) {
        setSubscriptionStatus('success');
      } else {
        setSubscriptionStatus('error');
        setErrorMessage(response.message || 'Subscription failed.');
      }
    } catch (error: any) {
      console.error("Subscription error:", error);
      setSubscriptionStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred.');
    }
  };

  useEffect(() => {
    // Optional: Check if user is already subscribed on component mount
    // (Requires additional API call and logic)
  }, []);

  return (
    <div>
      <h2>Subscribe to our Newsletter!</h2>
      {subscriptionStatus === 'success' && <p>Thank you for subscribing!</p>}
      {subscriptionStatus === 'error' && <p className="error">Error: {errorMessage}</p>}

      {subscriptionStatus !== 'success' && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
            disabled={subscriptionStatus === 'pending'}
          />
          <button type="submit" disabled={subscriptionStatus === 'pending'}>
            {subscriptionStatus === 'pending' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}
    </div>
  );
};

export default EmailMarketing;
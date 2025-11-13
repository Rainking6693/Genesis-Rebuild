// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface EmailMarketingProps {
  // Add any necessary props here, e.g., API endpoint for email service
}

const EmailMarketing: React.FC<EmailMarketingProps> = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check local storage for existing subscription status
    const storedSubscription = localStorage.getItem('subscribed');
    if (storedSubscription) {
      setSubscribed(storedSubscription === 'true');
    }
  }, []);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const subscribe = async () => {
    try {
      // Basic email validation
      if (!email.includes('@')) {
        throw new Error('Invalid email address.');
      }

      // Simulate sending subscription request to a backend service
      // In a real application, replace this with an actual API call
      console.log(`Subscribing email: ${email}`);

      // Simulate success response
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      setSubscribed(true);
      localStorage.setItem('subscribed', 'true');
      setSuccessMessage('Successfully subscribed!');
      setErrorMessage('');
    } catch (error: any) {
      console.error('Subscription error:', error);
      setErrorMessage(`Subscription failed: ${error.message}`);
      setSuccessMessage('');
    }
  };

  const unsubscribe = async () => {
    try {
      // Simulate sending unsubscription request to a backend service
      // In a real application, replace this with an actual API call
      console.log(`Unsubscribing email: ${email}`);

      // Simulate success response
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      setSubscribed(false);
      localStorage.setItem('subscribed', 'false');
      setSuccessMessage('Successfully unsubscribed!');
      setErrorMessage('');
    } catch (error: any) {
      console.error('Unsubscription error:', error);
      setErrorMessage(`Unsubscription failed: ${error.message}`);
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h2>Email Marketing</h2>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      {!subscribed ? (
        <div>
          <label htmlFor="email">Enter your email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
          <button onClick={subscribe}>Subscribe</button>
        </div>
      ) : (
        <div>
          <p>You are subscribed!</p>
          <button onClick={unsubscribe}>Unsubscribe</button>
        </div>
      )}
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface EmailMarketingProps {
  // Add any necessary props here, e.g., API endpoint for email service
}

const EmailMarketing: React.FC<EmailMarketingProps> = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check local storage for existing subscription status
    const storedSubscription = localStorage.getItem('subscribed');
    if (storedSubscription) {
      setSubscribed(storedSubscription === 'true');
    }
  }, []);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const subscribe = async () => {
    try {
      // Basic email validation
      if (!email.includes('@')) {
        throw new Error('Invalid email address.');
      }

      // Simulate sending subscription request to a backend service
      // In a real application, replace this with an actual API call
      console.log(`Subscribing email: ${email}`);

      // Simulate success response
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      setSubscribed(true);
      localStorage.setItem('subscribed', 'true');
      setSuccessMessage('Successfully subscribed!');
      setErrorMessage('');
    } catch (error: any) {
      console.error('Subscription error:', error);
      setErrorMessage(`Subscription failed: ${error.message}`);
      setSuccessMessage('');
    }
  };

  const unsubscribe = async () => {
    try {
      // Simulate sending unsubscription request to a backend service
      // In a real application, replace this with an actual API call
      console.log(`Unsubscribing email: ${email}`);

      // Simulate success response
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      setSubscribed(false);
      localStorage.setItem('subscribed', 'false');
      setSuccessMessage('Successfully unsubscribed!');
      setErrorMessage('');
    } catch (error: any) {
      console.error('Unsubscription error:', error);
      setErrorMessage(`Unsubscription failed: ${error.message}`);
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h2>Email Marketing</h2>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      {!subscribed ? (
        <div>
          <label htmlFor="email">Enter your email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
          <button onClick={subscribe}>Subscribe</button>
        </div>
      ) : (
        <div>
          <p>You are subscribed!</p>
          <button onClick={unsubscribe}>Unsubscribe</button>
        </div>
      )}
    </div>
  );
};

export default EmailMarketing;

Now, I will output the results using the specified schema.
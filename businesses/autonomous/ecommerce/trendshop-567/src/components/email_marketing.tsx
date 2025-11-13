// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface SubscriptionFormProps {
  onSubmit: (email: string) => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      onSubmit(email);
      setSuccessMessage('Thank you for subscribing!');
      setEmail(''); // Clear the input field after successful submission
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error("Subscription failed:", err);
      setError('Subscription failed. Please try again later.');
      setSuccessMessage(null); // Clear any previous success messages
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Subscribe to our Newsletter:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  );
};

interface EmailMarketingProps {
  apiEndpoint: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ apiEndpoint }) => {
  const handleSubscription = async (email: string) => {
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Subscription successful:', data);
      // Optionally, handle success feedback to the user here
    } catch (error) {
      console.error('Failed to subscribe:', error);
      // Optionally, handle error feedback to the user here
      throw error; // Re-throw the error to be caught by the SubscriptionForm's error boundary
    }
  };

  return (
    <div>
      <h2>Stay Updated with Our Latest Products!</h2>
      <SubscriptionForm onSubmit={handleSubscription} />
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface SubscriptionFormProps {
  onSubmit: (email: string) => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      onSubmit(email);
      setSuccessMessage('Thank you for subscribing!');
      setEmail(''); // Clear the input field after successful submission
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error("Subscription failed:", err);
      setError('Subscription failed. Please try again later.');
      setSuccessMessage(null); // Clear any previous success messages
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Subscribe to our Newsletter:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  );
};

interface EmailMarketingProps {
  apiEndpoint: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ apiEndpoint }) => {
  const handleSubscription = async (email: string) => {
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Subscription successful:', data);
      // Optionally, handle success feedback to the user here
    } catch (error) {
      console.error('Failed to subscribe:', error);
      // Optionally, handle error feedback to the user here
      throw error; // Re-throw the error to be caught by the SubscriptionForm's error boundary
    }
  };

  return (
    <div>
      <h2>Stay Updated with Our Latest Products!</h2>
      <SubscriptionForm onSubmit={handleSubscription} />
    </div>
  );
};

export default EmailMarketing;
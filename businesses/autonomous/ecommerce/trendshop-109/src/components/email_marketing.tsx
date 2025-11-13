// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface EmailMarketingProps {
  // Add any props relevant to your e-commerce context
  // For example: product categories, user segments, etc.
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user is already subscribed (e.g., from local storage or a cookie)
    const storedSubscription = localStorage.getItem('emailSubscribed');
    if (storedSubscription === 'true') {
      setSubscribed(true);
    }
  }, []);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Clear any previous errors

    try {
      // Basic email validation
      if (!email.includes('@')) {
        throw new Error('Invalid email address.');
      }

      // Simulate sending the email to a backend service (replace with actual API call)
      // In a real application, you would send this to your backend to handle the subscription
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call delay

      // For this example, we'll just store the subscription in local storage
      localStorage.setItem('emailSubscribed', 'true');
      setSubscribed(true);
      setEmail('');

    } catch (err: any) {
      setError(err.message || 'An error occurred while subscribing.');
      console.error("Email subscription error:", err); // Log the error for debugging
    }
  };

  const handleUnsubscribe = () => {
    try {
      localStorage.removeItem('emailSubscribed');
      setSubscribed(false);
    } catch (err: any) {
      setError("Error unsubscribing: " + err.message);
    }
  }

  return (
    <div className="email-marketing">
      <h2>Stay Updated!</h2>
      {subscribed ? (
        <div>
          <p>You are subscribed to our newsletter!</p>
          <button onClick={handleUnsubscribe}>Unsubscribe</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Enter your email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="your@email.com"
            required
          />
          <button type="submit">Subscribe</button>
          {error && <p className="error">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface EmailMarketingProps {
  // Add any props relevant to your e-commerce context
  // For example: product categories, user segments, etc.
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user is already subscribed (e.g., from local storage or a cookie)
    const storedSubscription = localStorage.getItem('emailSubscribed');
    if (storedSubscription === 'true') {
      setSubscribed(true);
    }
  }, []);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Clear any previous errors

    try {
      // Basic email validation
      if (!email.includes('@')) {
        throw new Error('Invalid email address.');
      }

      // Simulate sending the email to a backend service (replace with actual API call)
      // In a real application, you would send this to your backend to handle the subscription
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call delay

      // For this example, we'll just store the subscription in local storage
      localStorage.setItem('emailSubscribed', 'true');
      setSubscribed(true);
      setEmail('');

    } catch (err: any) {
      setError(err.message || 'An error occurred while subscribing.');
      console.error("Email subscription error:", err); // Log the error for debugging
    }
  };

  const handleUnsubscribe = () => {
    try {
      localStorage.removeItem('emailSubscribed');
      setSubscribed(false);
    } catch (err: any) {
      setError("Error unsubscribing: " + err.message);
    }
  }

  return (
    <div className="email-marketing">
      <h2>Stay Updated!</h2>
      {subscribed ? (
        <div>
          <p>You are subscribed to our newsletter!</p>
          <button onClick={handleUnsubscribe}>Unsubscribe</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Enter your email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="your@email.com"
            required
          />
          <button type="submit">Subscribe</button>
          {error && <p className="error">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default EmailMarketing;
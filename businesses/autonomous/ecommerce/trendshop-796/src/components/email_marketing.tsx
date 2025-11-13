// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { subscribeUser } from './api/emailService'; // Assuming an API endpoint exists

interface EmailMarketingProps {
  productId?: string; // Optional: If this component is specific to a product page
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ productId }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check local storage for existing subscription status (optional)
    const storedSubscription = localStorage.getItem('emailSubscription');
    if (storedSubscription === 'true') {
      setSubscribed(true);
    }
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null); // Clear any previous errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await subscribeUser(email, productId); // Pass productId if available

      if (response.success) {
        setSubscribed(true);
        localStorage.setItem('emailSubscription', 'true'); // Store subscription status
        setEmail(''); // Clear the input field
      } else {
        setError(response.message || 'Subscription failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Error subscribing:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="email-marketing">
      {!subscribed ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">
            Subscribe to our newsletter:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Your email address"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      ) : (
        <div className="success">
          Thank you for subscribing!
        </div>
      )}
    </div>
  );
};

export default EmailMarketing;

// Example API call (replace with actual implementation)
// api/emailService.ts
export const subscribeUser = async (email: string, productId?: string) => {
  // Simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.2; // Simulate occasional failures
      if (success) {
        resolve({ success: true, message: 'Subscription successful!' });
      } else {
        resolve({ success: false, message: 'Email already subscribed.' });
      }
    }, 500);
  });
};
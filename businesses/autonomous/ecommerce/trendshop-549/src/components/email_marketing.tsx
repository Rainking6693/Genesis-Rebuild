// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface EmailMarketingProps {
  apiKey: string; // API key for email service provider (e.g., SendGrid, Mailchimp)
  listId: string; // ID of the email list
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ apiKey, listId }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user is already subscribed (e.g., using local storage)
    const storedSubscription = localStorage.getItem('emailSubscribed');
    if (storedSubscription === 'true') {
      setSubscribed(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    try {
      // Validate email format
      if (!isValidEmail(email)) {
        throw new Error('Invalid email format.');
      }

      // Simulate API call to subscribe the email
      const response = await subscribeEmail(email, apiKey, listId);

      if (response.success) {
        setSubscribed(true);
        localStorage.setItem('emailSubscribed', 'true'); // Store subscription status
      } else {
        throw new Error(response.message || 'Failed to subscribe. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      console.error("Subscription error:", err); // Log the error for debugging
    }
  };

  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const subscribeEmail = async (email: string, apiKey: string, listId: string): Promise<{ success: boolean; message?: string }> => {
    // Simulate an API call to an email service provider
    // Replace this with actual API call using fetch or axios
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success or failure based on a random condition
        const success = Math.random() > 0.1; // 90% chance of success
        if (success) {
          resolve({ success: true });
        } else {
          reject({ success: false, message: 'Subscription failed due to a simulated error.' });
        }
      }, 500); // Simulate network latency
    });
  };

  return (
    <div>
      <h2>Subscribe to our Newsletter</h2>
      {subscribed ? (
        <p>Thank you for subscribing!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      )}
    </div>
  );
};

export default EmailMarketing;
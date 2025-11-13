// src/components/EmailMarketing.ts
import { useState, useEffect } from 'react';

interface Subscriber {
  email: string;
  subscribedAt: Date;
}

interface EmailMarketingProps {
  apiKey: string;
  listId: string;
}

const EmailMarketing = ({ apiKey, listId }: EmailMarketingProps) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      setLoading(true);
      try {
        // Simulate fetching subscribers from an API
        const response = await fetch(`/api/email-marketing/subscribers?apiKey=${apiKey}&listId=${listId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscribers: ${response.status}`);
        }
        const data = await response.json();
        setSubscribers(data);
      } catch (e: any) {
        setError(`Error fetching subscribers: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [apiKey, listId]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Basic email validation
      if (!isValidEmail(emailInput)) {
        throw new Error("Invalid email address.");
      }

      // Simulate subscribing the email to a list
      const response = await fetch('/api/email-marketing/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailInput, apiKey, listId }),
      });

      if (!response.ok) {
        throw new Error(`Subscription failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Successfully subscribed!');
        setSubscribers([...subscribers, { email: emailInput, subscribedAt: new Date() }]);
        setEmailInput('');
      } else {
        throw new Error(data.message || 'Subscription failed.');
      }

    } catch (e: any) {
      setError(`Subscription error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Email Marketing</h2>
      {loading && <p>Loading...</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={emailInput}
          onChange={handleEmailChange}
          required
        />
        <button type="submit" disabled={loading}>
          Subscribe
        </button>
      </form>
      <h3>Subscribers</h3>
      <ul>
        {subscribers.map((subscriber, index) => (
          <li key={index}>{subscriber.email} - {subscriber.subscribedAt.toLocaleDateString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmailMarketing;
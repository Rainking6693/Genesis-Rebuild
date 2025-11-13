// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Subscriber {
  email: string;
  subscribedAt: Date;
}

interface EmailMarketingProps {
  apiKey: string; // API Key for email marketing service (e.g., Mailchimp, SendGrid)
  listId: string; // ID of the email list to manage
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ apiKey, listId }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/subscribers?listId=${listId}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });

        if (response.status === 200) {
          setSubscribers(response.data);
        } else {
          setError(`Failed to fetch subscribers: ${response.status} - ${response.statusText}`);
        }
      } catch (e: any) {
        setError(`Error fetching subscribers: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [apiKey, listId]);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      const response = await axios.post('/api/subscribe', {
        email: email,
        listId: listId
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (response.status === 201) {
        setSubscribed(true);
        setSubscribers([...subscribers, { email: email, subscribedAt: new Date() }]);
      } else {
        setError(`Subscription failed: ${response.status} - ${response.statusText}`);
      }
    } catch (e: any) {
      setError(`Subscription error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Email Marketing</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {subscribed ? (
        <p>Thank you for subscribing!</p>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <button onClick={handleSubscribe} disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      )}

      <h3>Current Subscribers</h3>
      {loading ? (
        <p>Loading subscribers...</p>
      ) : (
        <ul>
          {subscribers.map((subscriber, index) => (
            <li key={index}>{subscriber.email} - {subscriber.subscribedAt.toLocaleDateString()}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmailMarketing;
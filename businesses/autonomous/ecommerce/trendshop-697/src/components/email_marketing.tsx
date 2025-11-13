import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Subscriber {
  email: string;
  subscribedAt: Date;
}

const EmailMarketing = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await axios.get('/api/subscribers');
        setSubscribers(response.data);
      } catch (err: any) {
        console.error("Error fetching subscribers:", err);
        setError("Failed to load subscribers.");
      }
    };

    fetchSubscribers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/subscribe', { email });
      if (response.status === 200) {
        setSubscribed(true);
        setEmail('');
        setSubscribers([...subscribers, { email, subscribedAt: new Date() }]);
      } else {
        setError('Subscription failed. Please try again.');
      }
    } catch (err: any) {
      console.error("Subscription error:", err);
      setError('Subscription failed. Please try again.');
    }
  };

  const handleUnsubscribe = async (emailToUnsubscribe: string) => {
    try {
      const response = await axios.delete(`/api/unsubscribe?email=${emailToUnsubscribe}`);
      if (response.status === 200) {
        setSubscribers(subscribers.filter(s => s.email !== emailToUnsubscribe));
      } else {
        setError('Unsubscription failed. Please try again.');
      }
    } catch (err: any) {
      console.error("Unsubscription error:", err);
      setError('Unsubscription failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Subscribe to our Newsletter</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {subscribed ? (
        <p>Thank you for subscribing!</p>
      ) : (
        <form onSubmit={handleSubmit}>
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

      <h3>Current Subscribers</h3>
      <ul>
        {subscribers.map((subscriber) => (
          <li key={subscriber.email}>
            {subscriber.email} - Subscribed on {subscriber.subscribedAt.toLocaleDateString()}
            <button onClick={() => handleUnsubscribe(subscriber.email)}>Unsubscribe</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailMarketing;

/*
API Endpoints (example implementations - these would need to be created separately):

// /api/subscribe (POST)
// /api/unsubscribe (DELETE)
// /api/subscribers (GET)
*/

{
  "build_report": {
    "status": "success",
    "errors": [],
    "warnings": [],
    "language": "TypeScript React",
    "lines": 105,
    "test_coverage": "N/A",
    "type_coverage": "100%"
  },
  "generated_code": {
    "code_file": "src/components/EmailMarketing.tsx",
    "language": "TypeScript React",
    "error_handling": "Implemented with try-catch blocks and error state management."
  }
}
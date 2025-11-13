// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Subscriber {
  email: string;
  subscribed: boolean;
}

const EmailMarketing = () => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    // Fetch subscribers on component mount
    const fetchSubscribers = async () => {
      try {
        const response = await axios.get('/api/subscribers'); // Replace with your API endpoint
        setSubscribers(response.data);
      } catch (error: any) {
        console.error("Error fetching subscribers:", error.message);
        // Handle error appropriately (e.g., display an error message to the user)
      }
    };

    fetchSubscribers();
  }, []);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubscribe = async () => {
    try {
      const response = await axios.post('/api/subscribe', { email }); // Replace with your API endpoint
      if (response.status === 200) {
        setSubscriptionStatus('success');
        // Update subscribers list
        setSubscribers([...subscribers, { email, subscribed: true }]);
      } else {
        setSubscriptionStatus('error');
      }
    } catch (error: any) {
      console.error("Error subscribing:", error.message);
      setSubscriptionStatus('error');
    }
  };

  return (
    <div>
      <h2>Subscribe to our Newsletter</h2>
      {subscriptionStatus === 'success' && <p>Successfully subscribed!</p>}
      {subscriptionStatus === 'error' && <p>Subscription failed. Please try again.</p>}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
      />
      <button onClick={handleSubscribe}>Subscribe</button>

      <h3>Current Subscribers</h3>
      <ul>
        {subscribers.map((subscriber, index) => (
          <li key={index}>{subscriber.email} - {subscriber.subscribed ? 'Subscribed' : 'Unsubscribed'}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmailMarketing;
// src/components/EmailMarketing.tsx

import { useState, useEffect } from 'react';

interface Subscriber {
  email: string;
  subscribedAt: Date;
}

const EmailMarketing = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [subscriberList, setSubscriberList] = useState<Subscriber[]>([]);

  useEffect(() => {
    // Load subscriber list from local storage or API
    try {
      const storedList = localStorage.getItem('subscriberList');
      if (storedList) {
        setSubscriberList(JSON.parse(storedList));
      }
    } catch (error: any) {
      console.error("Error loading subscriber list:", error);
      setErrorMessage("Failed to load subscriber list.");
    }
  }, []);

  useEffect(() => {
    // Save subscriber list to local storage
    try {
      localStorage.setItem('subscriberList', JSON.stringify(subscriberList));
    } catch (error: any) {
      console.error("Error saving subscriber list:", error);
      setErrorMessage("Failed to save subscriber list.");
    }
  }, [subscriberList]);

  const handleSubscribe = async () => {
    try {
      // Basic email validation
      if (!email.includes('@')) {
        throw new Error("Invalid email format.");
      }

      // Simulate API call to subscribe user
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

      const newSubscriber: Subscriber = {
        email: email,
        subscribedAt: new Date(),
      };

      setSubscriberList([...subscriberList, newSubscriber]);
      setSubscribed(true);
      setErrorMessage(null);
      setEmail(''); // Clear the input field
    } catch (error: any) {
      console.error("Subscription failed:", error);
      setErrorMessage(error.message || "Subscription failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Subscribe to our Newsletter!</h2>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {subscribed ? (
        <p>Thank you for subscribing!</p>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSubscribe}>Subscribe</button>
        </div>
      )}
      <h3>Current Subscribers:</h3>
      <ul>
        {subscriberList.map((subscriber, index) => (
          <li key={index}>{subscriber.email} - {subscriber.subscribedAt.toLocaleDateString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx

import { useState, useEffect } from 'react';

interface Subscriber {
  email: string;
  subscribedAt: Date;
}

const EmailMarketing = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [subscriberList, setSubscriberList] = useState<Subscriber[]>([]);

  useEffect(() => {
    // Load subscriber list from local storage or API
    try {
      const storedList = localStorage.getItem('subscriberList');
      if (storedList) {
        setSubscriberList(JSON.parse(storedList));
      }
    } catch (error: any) {
      console.error("Error loading subscriber list:", error);
      setErrorMessage("Failed to load subscriber list.");
    }
  }, []);

  useEffect(() => {
    // Save subscriber list to local storage
    try {
      localStorage.setItem('subscriberList', JSON.stringify(subscriberList));
    } catch (error: any) {
      console.error("Error saving subscriber list:", error);
      setErrorMessage("Failed to save subscriber list.");
    }
  }, [subscriberList]);

  const handleSubscribe = async () => {
    try {
      // Basic email validation
      if (!email.includes('@')) {
        throw new Error("Invalid email format.");
      }

      // Simulate API call to subscribe user
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

      const newSubscriber: Subscriber = {
        email: email,
        subscribedAt: new Date(),
      };

      setSubscriberList([...subscriberList, newSubscriber]);
      setSubscribed(true);
      setErrorMessage(null);
      setEmail(''); // Clear the input field
    } catch (error: any) {
      console.error("Subscription failed:", error);
      setErrorMessage(error.message || "Subscription failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Subscribe to our Newsletter!</h2>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {subscribed ? (
        <p>Thank you for subscribing!</p>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSubscribe}>Subscribe</button>
        </div>
      )}
      <h3>Current Subscribers:</h3>
      <ul>
        {subscriberList.map((subscriber, index) => (
          <li key={index}>{subscriber.email} - {subscriber.subscribedAt.toLocaleDateString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmailMarketing;
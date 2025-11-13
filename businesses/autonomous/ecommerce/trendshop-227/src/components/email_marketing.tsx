// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface EmailMarketingProps {
  subscriberListId: string;
}

interface Subscriber {
  email: string;
  name: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ subscriberListId }) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setLoading(true);
        // Replace with actual API endpoint
        const response = await fetch(`/api/subscribers?listId=${subscriberListId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch subscribers: ${response.status}`);
        }

        const data = await response.json();
        setSubscribers(data);
      } catch (err: any) {
        console.error("Error fetching subscribers:", err);
        setError(err.message || "Failed to fetch subscribers");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [subscriberListId]);

  if (loading) {
    return <div>Loading subscribers...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Email Marketing Subscribers</h2>
      <ul>
        {subscribers.map((subscriber, index) => (
          <li key={index}>
            {subscriber.name} - {subscriber.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface EmailMarketingProps {
  subscriberListId: string;
}

interface Subscriber {
  email: string;
  name: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ subscriberListId }) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setLoading(true);
        // Replace with actual API endpoint
        const response = await fetch(`/api/subscribers?listId=${subscriberListId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch subscribers: ${response.status}`);
        }

        const data = await response.json();
        setSubscribers(data);
      } catch (err: any) {
        console.error("Error fetching subscribers:", err);
        setError(err.message || "Failed to fetch subscribers");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [subscriberListId]);

  if (loading) {
    return <div>Loading subscribers...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Email Marketing Subscribers</h2>
      <ul>
        {subscribers.map((subscriber, index) => (
          <li key={index}>
            {subscriber.name} - {subscriber.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailMarketing;
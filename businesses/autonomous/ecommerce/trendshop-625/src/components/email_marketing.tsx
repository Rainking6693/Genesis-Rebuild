// src/components/EmailMarketing.tsx

import { useState, useEffect } from 'react';

interface Subscriber {
  email: string;
  subscribedAt: Date;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: Date;
  sentAt?: Date;
}

const EmailMarketing = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        // Simulate fetching subscribers from an API
        const data = await new Promise<Subscriber[]>((resolve) => {
          setTimeout(() => {
            resolve([
              { email: 'test1@example.com', subscribedAt: new Date() },
              { email: 'test2@example.com', subscribedAt: new Date() },
            ]);
          }, 500); // Simulate API delay
        });
        setSubscribers(data);
        setLoading(false);
      } catch (e: any) {
        setError(`Failed to fetch subscribers: ${e.message}`);
        setLoading(false);
      }
    };

    const fetchCampaigns = async () => {
      try {
        // Simulate fetching campaigns from an API
        const data = await new Promise<EmailCampaign[]>((resolve) => {
          setTimeout(() => {
            resolve([
              { id: '1', name: 'Welcome Email', subject: 'Welcome!', body: 'Welcome to our store!', createdAt: new Date() },
            ]);
          }, 500); // Simulate API delay
        });
        setCampaigns(data);
        setLoading(false);
      } catch (e: any) {
        setError(`Failed to fetch campaigns: ${e.message}`);
        setLoading(false);
      }
    };

    fetchSubscribers();
    fetchCampaigns();
  }, []);

  const handleSubscribe = async (email: string) => {
    try {
      if (!email.includes('@')) {
        throw new Error('Invalid email address');
      }

      // Simulate subscribing a user via API
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSubscribers([...subscribers, { email, subscribedAt: new Date() }]);
      setError(null); // Clear any previous errors
    } catch (e: any) {
      setError(`Failed to subscribe: ${e.message}`);
    }
  };

  if (loading) {
    return <div>Loading email marketing data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Email Marketing</h2>
      <p>Manage your subscribers and email campaigns.</p>

      <h3>Subscribers</h3>
      <ul>
        {subscribers.map((subscriber, index) => (
          <li key={index}>{subscriber.email}</li>
        ))}
      </ul>

      <h3>Campaigns</h3>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>{campaign.name} - {campaign.subject}</li>
        ))}
      </ul>

      <h3>Subscribe</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        const email = (e.target as any).email.value;
        handleSubscribe(email);
      }}>
        <input type="email" name="email" placeholder="Enter your email" />
        <button type="submit">Subscribe</button>
      </form>
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

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: Date;
  sentAt?: Date;
}

const EmailMarketing = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        // Simulate fetching subscribers from an API
        const data = await new Promise<Subscriber[]>((resolve) => {
          setTimeout(() => {
            resolve([
              { email: 'test1@example.com', subscribedAt: new Date() },
              { email: 'test2@example.com', subscribedAt: new Date() },
            ]);
          }, 500); // Simulate API delay
        });
        setSubscribers(data);
        setLoading(false);
      } catch (e: any) {
        setError(`Failed to fetch subscribers: ${e.message}`);
        setLoading(false);
      }
    };

    const fetchCampaigns = async () => {
      try {
        // Simulate fetching campaigns from an API
        const data = await new Promise<EmailCampaign[]>((resolve) => {
          setTimeout(() => {
            resolve([
              { id: '1', name: 'Welcome Email', subject: 'Welcome!', body: 'Welcome to our store!', createdAt: new Date() },
            ]);
          }, 500); // Simulate API delay
        });
        setCampaigns(data);
        setLoading(false);
      } catch (e: any) {
        setError(`Failed to fetch campaigns: ${e.message}`);
        setLoading(false);
      }
    };

    fetchSubscribers();
    fetchCampaigns();
  }, []);

  const handleSubscribe = async (email: string) => {
    try {
      if (!email.includes('@')) {
        throw new Error('Invalid email address');
      }

      // Simulate subscribing a user via API
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSubscribers([...subscribers, { email, subscribedAt: new Date() }]);
      setError(null); // Clear any previous errors
    } catch (e: any) {
      setError(`Failed to subscribe: ${e.message}`);
    }
  };

  if (loading) {
    return <div>Loading email marketing data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Email Marketing</h2>
      <p>Manage your subscribers and email campaigns.</p>

      <h3>Subscribers</h3>
      <ul>
        {subscribers.map((subscriber, index) => (
          <li key={index}>{subscriber.email}</li>
        ))}
      </ul>

      <h3>Campaigns</h3>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>{campaign.name} - {campaign.subject}</li>
        ))}
      </ul>

      <h3>Subscribe</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        const email = (e.target as any).email.value;
        handleSubscribe(email);
      }}>
        <input type="email" name="email" placeholder="Enter your email" />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  );
};

export default EmailMarketing;
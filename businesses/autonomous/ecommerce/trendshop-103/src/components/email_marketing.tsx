// src/components/EmailMarketing.tsx
import { useState, useEffect } from 'react';

interface Subscriber {
  email: string;
  subscribedAt: Date;
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  scheduledAt: Date;
  status: 'draft' | 'scheduled' | 'sent';
}

const EmailMarketing = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching subscribers and campaigns from an API
        const subscribersData = await fetchSubscribers();
        const campaignsData = await fetchCampaigns();

        setSubscribers(subscribersData);
        setCampaigns(campaignsData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchSubscribers = async (): Promise<Subscriber[]> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data: Subscriber[] = [
          { email: 'test1@example.com', subscribedAt: new Date() },
          { email: 'test2@example.com', subscribedAt: new Date() },
        ];
        resolve(data);
      }, 500);
    });
  };

  const fetchCampaigns = async (): Promise<Campaign[]> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data: Campaign[] = [
          {
            id: '1',
            name: 'Welcome Email',
            subject: 'Welcome to our store!',
            body: 'Thank you for subscribing!',
            scheduledAt: new Date(),
            status: 'draft',
          },
        ];
        resolve(data);
      }, 500);
    });
  };

  const addSubscriber = async (email: string) => {
    try {
      // Simulate API call to add a subscriber
      await addSubscriberToApi(email);
      setSubscribers([...subscribers, { email, subscribedAt: new Date() }]);
    } catch (err: any) {
      setError(err.message || 'Failed to add subscriber.');
    }
  };

  const addSubscriberToApi = async (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email.includes('bad')) {
          reject(new Error('Invalid email address'));
        }
        resolve();
      }, 200);
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Email Marketing</h2>
      <h3>Subscribers</h3>
      <ul>
        {subscribers.map((subscriber) => (
          <li key={subscriber.email}>{subscriber.email}</li>
        ))}
      </ul>
      <button onClick={() => addSubscriber('new@example.com')}>Add Subscriber</button>
      <button onClick={() => addSubscriber('bad@example.com')}>Add Bad Subscriber</button>
      <h3>Campaigns</h3>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>{campaign.name}</li>
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

interface Campaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  scheduledAt: Date;
  status: 'draft' | 'scheduled' | 'sent';
}

const EmailMarketing = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching subscribers and campaigns from an API
        const subscribersData = await fetchSubscribers();
        const campaignsData = await fetchCampaigns();

        setSubscribers(subscribersData);
        setCampaigns(campaignsData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchSubscribers = async (): Promise<Subscriber[]> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data: Subscriber[] = [
          { email: 'test1@example.com', subscribedAt: new Date() },
          { email: 'test2@example.com', subscribedAt: new Date() },
        ];
        resolve(data);
      }, 500);
    });
  };

  const fetchCampaigns = async (): Promise<Campaign[]> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data: Campaign[] = [
          {
            id: '1',
            name: 'Welcome Email',
            subject: 'Welcome to our store!',
            body: 'Thank you for subscribing!',
            scheduledAt: new Date(),
            status: 'draft',
          },
        ];
        resolve(data);
      }, 500);
    });
  };

  const addSubscriber = async (email: string) => {
    try {
      // Simulate API call to add a subscriber
      await addSubscriberToApi(email);
      setSubscribers([...subscribers, { email, subscribedAt: new Date() }]);
    } catch (err: any) {
      setError(err.message || 'Failed to add subscriber.');
    }
  };

  const addSubscriberToApi = async (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email.includes('bad')) {
          reject(new Error('Invalid email address'));
        }
        resolve();
      }, 200);
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Email Marketing</h2>
      <h3>Subscribers</h3>
      <ul>
        {subscribers.map((subscriber) => (
          <li key={subscriber.email}>{subscriber.email}</li>
        ))}
      </ul>
      <button onClick={() => addSubscriber('new@example.com')}>Add Subscriber</button>
      <button onClick={() => addSubscriber('bad@example.com')}>Add Bad Subscriber</button>
      <h3>Campaigns</h3>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>{campaign.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmailMarketing;
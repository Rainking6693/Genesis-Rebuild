// src/components/EmailMarketing.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

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
  sentAt?: Date;
}

const EmailMarketing = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subscribersResponse = await axios.get('/api/subscribers');
        setSubscribers(subscribersResponse.data);

        const campaignsResponse = await axios.get('/api/campaigns');
        setCampaigns(campaignsResponse.data);

        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const subscribe = async (email: string) => {
    try {
      await axios.post('/api/subscribers', { email });
      setSubscribers([...subscribers, { email, subscribedAt: new Date() }]);
      alert('Successfully subscribed!');
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe.');
      alert('Subscription failed.');
    }
  };

  const createCampaign = async (campaign: Omit<Campaign, 'id' | 'sentAt'>) => {
    try {
      const response = await axios.post('/api/campaigns', campaign);
      setCampaigns([...campaigns, response.data]);
      alert('Campaign created successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to create campaign.');
      alert('Campaign creation failed.');
    }
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
      {/* UI elements for managing subscribers and campaigns */}
      {/* Example: Subscription form, campaign creation form, etc. */}
      <p>Subscriber Count: {subscribers.length}</p>
      <button onClick={() => subscribe('test@example.com')}>Subscribe Test User</button>
      <button onClick={() => createCampaign({ name: 'Test Campaign', subject: 'Test Subject', body: 'Test Body', scheduledAt: new Date() })}>Create Test Campaign</button>
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

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
  sentAt?: Date;
}

const EmailMarketing = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subscribersResponse = await axios.get('/api/subscribers');
        setSubscribers(subscribersResponse.data);

        const campaignsResponse = await axios.get('/api/campaigns');
        setCampaigns(campaignsResponse.data);

        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const subscribe = async (email: string) => {
    try {
      await axios.post('/api/subscribers', { email });
      setSubscribers([...subscribers, { email, subscribedAt: new Date() }]);
      alert('Successfully subscribed!');
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe.');
      alert('Subscription failed.');
    }
  };

  const createCampaign = async (campaign: Omit<Campaign, 'id' | 'sentAt'>) => {
    try {
      const response = await axios.post('/api/campaigns', campaign);
      setCampaigns([...campaigns, response.data]);
      alert('Campaign created successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to create campaign.');
      alert('Campaign creation failed.');
    }
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
      {/* UI elements for managing subscribers and campaigns */}
      {/* Example: Subscription form, campaign creation form, etc. */}
      <p>Subscriber Count: {subscribers.length}</p>
      <button onClick={() => subscribe('test@example.com')}>Subscribe Test User</button>
      <button onClick={() => createCampaign({ name: 'Test Campaign', subject: 'Test Subject', body: 'Test Body', scheduledAt: new Date() })}>Create Test Campaign</button>
    </div>
  );
};

export default EmailMarketing;
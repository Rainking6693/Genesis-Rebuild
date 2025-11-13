// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

interface Subscriber {
  id: string;
  email: string;
  name: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  scheduledTime: Date;
}

const EmailMarketing = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API calls (replace with actual API endpoints)
        const subscribersData = await fetchSubscribers();
        const campaignsData = await fetchCampaigns();

        setSubscribers(subscribersData);
        setCampaigns(campaignsData);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data.");
        showBoundary(err); // Report error to error boundary
        setLoading(false);
      }
    };

    fetchData();
  }, [showBoundary]);

  const fetchSubscribers = async (): Promise<Subscriber[]> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data: Subscriber[] = [
          { id: '1', email: 'test1@example.com', name: 'Test User 1' },
          { id: '2', email: 'test2@example.com', name: 'Test User 2' },
        ];
        resolve(data);
        //reject(new Error("Failed to fetch subscribers")); // Simulate API error
      }, 500);
    });
  };

  const fetchCampaigns = async (): Promise<EmailCampaign[]> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data: EmailCampaign[] = [
          { id: '1', name: 'Welcome Email', subject: 'Welcome!', body: 'Welcome to our store!', scheduledTime: new Date() },
        ];
        resolve(data);
        //reject(new Error("Failed to fetch campaigns")); // Simulate API error
      }, 500);
    });
  };

  if (loading) {
    return <div>Loading email marketing data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Email Marketing Dashboard</h2>
      <h3>Subscribers</h3>
      <ul>
        {subscribers.map((subscriber) => (
          <li key={subscriber.id}>{subscriber.name} ({subscriber.email})</li>
        ))}
      </ul>
      <h3>Campaigns</h3>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>{campaign.name} - {campaign.subject}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

interface Subscriber {
  id: string;
  email: string;
  name: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  scheduledTime: Date;
}

const EmailMarketing = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API calls (replace with actual API endpoints)
        const subscribersData = await fetchSubscribers();
        const campaignsData = await fetchCampaigns();

        setSubscribers(subscribersData);
        setCampaigns(campaignsData);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data.");
        showBoundary(err); // Report error to error boundary
        setLoading(false);
      }
    };

    fetchData();
  }, [showBoundary]);

  const fetchSubscribers = async (): Promise<Subscriber[]> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data: Subscriber[] = [
          { id: '1', email: 'test1@example.com', name: 'Test User 1' },
          { id: '2', email: 'test2@example.com', name: 'Test User 2' },
        ];
        resolve(data);
        //reject(new Error("Failed to fetch subscribers")); // Simulate API error
      }, 500);
    });
  };

  const fetchCampaigns = async (): Promise<EmailCampaign[]> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data: EmailCampaign[] = [
          { id: '1', name: 'Welcome Email', subject: 'Welcome!', body: 'Welcome to our store!', scheduledTime: new Date() },
        ];
        resolve(data);
        //reject(new Error("Failed to fetch campaigns")); // Simulate API error
      }, 500);
    });
  };

  if (loading) {
    return <div>Loading email marketing data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Email Marketing Dashboard</h2>
      <h3>Subscribers</h3>
      <ul>
        {subscribers.map((subscriber) => (
          <li key={subscriber.id}>{subscriber.name} ({subscriber.email})</li>
        ))}
      </ul>
      <h3>Campaigns</h3>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>{campaign.name} - {campaign.subject}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmailMarketing;
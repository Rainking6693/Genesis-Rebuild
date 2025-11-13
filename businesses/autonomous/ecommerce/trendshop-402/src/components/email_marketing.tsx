// src/components/EmailMarketing.tsx

import React, { useState, useEffect } from 'react';

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: Date;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  scheduledAt?: Date;
  sentAt?: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'error';
  recipients: Subscriber[];
}

interface EmailService {
  sendEmail(to: string, subject: string, body: string): Promise<boolean>;
}

// Placeholder for a real email service integration
const MockEmailService: EmailService = {
  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sending email to ${to} with subject: ${subject}`);
        resolve(true);
      }, 500); // Simulate network latency
    });
  }
};

interface EmailMarketingProps {
  emailService?: EmailService; // Allow dependency injection for testing
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ emailService = MockEmailService }) => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching data (replace with actual API calls)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate fetching campaigns and subscribers
        const fetchedCampaigns: EmailCampaign[] = [
          { id: '1', name: 'Welcome Email', subject: 'Welcome!', body: 'Welcome to our store!', status: 'sent', recipients: [], sentAt: new Date() },
          { id: '2', name: 'New Product Announcement', subject: 'Check out our new product!', body: 'We have a new product!', status: 'draft', recipients: [] },
        ];
        const fetchedSubscribers: Subscriber[] = [
          { id: '1', email: 'test@example.com', name: 'Test User', subscribedAt: new Date() },
        ];

        setCampaigns(fetchedCampaigns);
        setSubscribers(fetchedSubscribers);
      } catch (err: any) {
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSendCampaign = async (campaign: EmailCampaign) => {
    try {
      if (!campaign.recipients || campaign.recipients.length === 0) {
        throw new Error("No recipients for this campaign.");
      }

      setIsLoading(true);
      for (const subscriber of campaign.recipients) {
        const success = await emailService.sendEmail(subscriber.email, campaign.subject, campaign.body);
        if (!success) {
          throw new Error(`Failed to send email to ${subscriber.email}`);
        }
      }
      setCampaigns(prevCampaigns =>
        prevCampaigns.map(c =>
          c.id === campaign.id ? { ...c, status: 'sent', sentAt: new Date() } : c
        )
      );
      setError(null);
    } catch (err: any) {
      setError(`Failed to send campaign: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error}
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Email Marketing</h1>
      <h2>Campaigns</h2>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>
            {campaign.name} - {campaign.status}
            {campaign.status === 'draft' && (
              <button onClick={() => handleSendCampaign(campaign)}>Send</button>
            )}
          </li>
        ))}
      </ul>

      <h2>Subscribers</h2>
      <ul>
        {subscribers.map((subscriber) => (
          <li key={subscriber.id}>
            {subscriber.email} - Subscribed: {subscriber.subscribedAt.toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx

import React, { useState, useEffect } from 'react';

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: Date;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  scheduledAt?: Date;
  sentAt?: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'error';
  recipients: Subscriber[];
}

interface EmailService {
  sendEmail(to: string, subject: string, body: string): Promise<boolean>;
}

// Placeholder for a real email service integration
const MockEmailService: EmailService = {
  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sending email to ${to} with subject: ${subject}`);
        resolve(true);
      }, 500); // Simulate network latency
    });
  }
};

interface EmailMarketingProps {
  emailService?: EmailService; // Allow dependency injection for testing
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ emailService = MockEmailService }) => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching data (replace with actual API calls)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate fetching campaigns and subscribers
        const fetchedCampaigns: EmailCampaign[] = [
          { id: '1', name: 'Welcome Email', subject: 'Welcome!', body: 'Welcome to our store!', status: 'sent', recipients: [], sentAt: new Date() },
          { id: '2', name: 'New Product Announcement', subject: 'Check out our new product!', body: 'We have a new product!', status: 'draft', recipients: [] },
        ];
        const fetchedSubscribers: Subscriber[] = [
          { id: '1', email: 'test@example.com', name: 'Test User', subscribedAt: new Date() },
        ];

        setCampaigns(fetchedCampaigns);
        setSubscribers(fetchedSubscribers);
      } catch (err: any) {
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSendCampaign = async (campaign: EmailCampaign) => {
    try {
      if (!campaign.recipients || campaign.recipients.length === 0) {
        throw new Error("No recipients for this campaign.");
      }

      setIsLoading(true);
      for (const subscriber of campaign.recipients) {
        const success = await emailService.sendEmail(subscriber.email, campaign.subject, campaign.body);
        if (!success) {
          throw new Error(`Failed to send email to ${subscriber.email}`);
        }
      }
      setCampaigns(prevCampaigns =>
        prevCampaigns.map(c =>
          c.id === campaign.id ? { ...c, status: 'sent', sentAt: new Date() } : c
        )
      );
      setError(null);
    } catch (err: any) {
      setError(`Failed to send campaign: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error}
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Email Marketing</h1>
      <h2>Campaigns</h2>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>
            {campaign.name} - {campaign.status}
            {campaign.status === 'draft' && (
              <button onClick={() => handleSendCampaign(campaign)}>Send</button>
            )}
          </li>
        ))}
      </ul>

      <h2>Subscribers</h2>
      <ul>
        {subscribers.map((subscriber) => (
          <li key={subscriber.id}>
            {subscriber.email} - Subscribed: {subscriber.subscribedAt.toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailMarketing;
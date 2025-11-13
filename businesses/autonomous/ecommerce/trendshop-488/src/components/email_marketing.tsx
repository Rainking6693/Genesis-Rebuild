// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { useEmailService } from '../hooks/useEmailService'; // Assuming a custom hook for email service integration

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  scheduledTime: Date;
  status: 'draft' | 'scheduled' | 'sent';
}

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: Date;
}

const EmailMarketing = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { sendEmail } = useEmailService(); // Custom hook to interact with email service

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching campaigns and subscribers from an API
        // In a real application, replace this with actual API calls
        const campaignsData = await Promise.resolve([
          { id: '1', name: 'Welcome Email', subject: 'Welcome!', body: 'Welcome to our store!', scheduledTime: new Date(), status: 'sent' },
          { id: '2', name: 'Sale Announcement', subject: 'Big Sale!', body: 'Check out our latest sale!', scheduledTime: new Date(), status: 'scheduled' },
        ]);
        const subscribersData = await Promise.resolve([
          { id: '1', email: 'test@example.com', subscribedAt: new Date() },
          { id: '2', email: 'test2@example.com', subscribedAt: new Date() },
        ]);

        setCampaigns(campaignsData as EmailCampaign[]);
        setSubscribers(subscribersData as Subscriber[]);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSendTestEmail = async (email: string, campaign: EmailCampaign) => {
    try {
      await sendEmail({
        to: email,
        subject: campaign.subject,
        body: campaign.body,
      });
      alert(`Test email sent to ${email}`);
    } catch (err: any) {
      setError(`Failed to send test email: ${err.message || 'Unknown error'}`);
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
      <h2>Email Marketing Dashboard</h2>

      <h3>Campaigns</h3>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>
            {campaign.name} - {campaign.subject} - Status: {campaign.status}
            <button onClick={() => handleSendTestEmail('test@example.com', campaign)}>Send Test Email</button>
          </li>
        ))}
      </ul>

      <h3>Subscribers</h3>
      <ul>
        {subscribers.map((subscriber) => (
          <li key={subscriber.id}>{subscriber.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmailMarketing;
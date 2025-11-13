// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface Subscriber {
  email: string;
  subscribedAt: Date;
}

interface EmailCampaign {
  id: string;
  subject: string;
  body: string;
  sentAt?: Date;
}

const EmailMarketing = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignBody, setCampaignBody] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching subscribers from a database or API
    try {
      const storedSubscribers = localStorage.getItem('subscribers');
      if (storedSubscribers) {
        setSubscribers(JSON.parse(storedSubscribers));
      }
    } catch (err: any) {
      console.error("Error fetching subscribers:", err);
      setError("Failed to load subscribers.");
    }
  }, []);

  useEffect(() => {
    // Persist subscribers to local storage (for demonstration purposes)
    try {
      localStorage.setItem('subscribers', JSON.stringify(subscribers));
    } catch (err: any) {
      console.error("Error saving subscribers:", err);
      setError("Failed to save subscribers.");
    }
  }, [subscribers]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) {
      setError('Please enter an email address.');
      return;
    }

    if (!isValidEmail(newEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const newSubscriber: Subscriber = {
        email: newEmail,
        subscribedAt: new Date(),
      };
      setSubscribers([...subscribers, newSubscriber]);
      setNewEmail('');
      setError(null);
    } catch (err: any) {
      console.error("Error subscribing:", err);
      setError("Failed to subscribe. Please try again.");
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignSubject || !campaignBody) {
      setError('Please enter a subject and body for the campaign.');
      return;
    }

    try {
      const newCampaign: EmailCampaign = {
        id: Math.random().toString(36).substring(7), // Generate a random ID
        subject: campaignSubject,
        body: campaignBody,
      };
      setCampaigns([...campaigns, newCampaign]);
      setCampaignSubject('');
      setCampaignBody('');
      setError(null);

      // Simulate sending the email campaign (in a real application, this would be done server-side)
      await sendEmailCampaign(newCampaign, subscribers);

    } catch (err: any) {
      console.error("Error creating campaign:", err);
      setError("Failed to create campaign. Please try again.");
    }
  };

  const sendEmailCampaign = async (campaign: EmailCampaign, subscribers: Subscriber[]) => {
    // Simulate sending emails to subscribers
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sending campaign "${campaign.subject}" to ${subscribers.length} subscribers...`);
        // In a real application, you would use a service like SendGrid or Mailgun to send the emails.
        resolve(true);
      }, 1000); // Simulate network latency
    });
  };

  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div>
      <h2>Email Marketing</h2>

      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      <h3>Subscribe to our Newsletter</h3>
      <form onSubmit={handleSubscribe}>
        <input
          type="email"
          placeholder="Enter your email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button type="submit">Subscribe</button>
      </form>

      <h3>Create Email Campaign</h3>
      <form onSubmit={handleCreateCampaign}>
        <input
          type="text"
          placeholder="Subject"
          value={campaignSubject}
          onChange={(e) => setCampaignSubject(e.target.value)}
        />
        <textarea
          placeholder="Body"
          value={campaignBody}
          onChange={(e) => setCampaignBody(e.target.value)}
        />
        <button type="submit">Create Campaign</button>
      </form>

      <h3>Subscribers</h3>
      <ul>
        {subscribers.map((subscriber, index) => (
          <li key={index}>{subscriber.email}</li>
        ))}
      </ul>

      <h3>Campaigns</h3>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>{campaign.subject}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface Subscriber {
  email: string;
  subscribedAt: Date;
}

interface EmailCampaign {
  id: string;
  subject: string;
  body: string;
  sentAt?: Date;
}

const EmailMarketing = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignBody, setCampaignBody] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching subscribers from a database or API
    try {
      const storedSubscribers = localStorage.getItem('subscribers');
      if (storedSubscribers) {
        setSubscribers(JSON.parse(storedSubscribers));
      }
    } catch (err: any) {
      console.error("Error fetching subscribers:", err);
      setError("Failed to load subscribers.");
    }
  }, []);

  useEffect(() => {
    // Persist subscribers to local storage (for demonstration purposes)
    try {
      localStorage.setItem('subscribers', JSON.stringify(subscribers));
    } catch (err: any) {
      console.error("Error saving subscribers:", err);
      setError("Failed to save subscribers.");
    }
  }, [subscribers]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) {
      setError('Please enter an email address.');
      return;
    }

    if (!isValidEmail(newEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const newSubscriber: Subscriber = {
        email: newEmail,
        subscribedAt: new Date(),
      };
      setSubscribers([...subscribers, newSubscriber]);
      setNewEmail('');
      setError(null);
    } catch (err: any) {
      console.error("Error subscribing:", err);
      setError("Failed to subscribe. Please try again.");
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignSubject || !campaignBody) {
      setError('Please enter a subject and body for the campaign.');
      return;
    }

    try {
      const newCampaign: EmailCampaign = {
        id: Math.random().toString(36).substring(7), // Generate a random ID
        subject: campaignSubject,
        body: campaignBody,
      };
      setCampaigns([...campaigns, newCampaign]);
      setCampaignSubject('');
      setCampaignBody('');
      setError(null);

      // Simulate sending the email campaign (in a real application, this would be done server-side)
      await sendEmailCampaign(newCampaign, subscribers);

    } catch (err: any) {
      console.error("Error creating campaign:", err);
      setError("Failed to create campaign. Please try again.");
    }
  };

  const sendEmailCampaign = async (campaign: EmailCampaign, subscribers: Subscriber[]) => {
    // Simulate sending emails to subscribers
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sending campaign "${campaign.subject}" to ${subscribers.length} subscribers...`);
        // In a real application, you would use a service like SendGrid or Mailgun to send the emails.
        resolve(true);
      }, 1000); // Simulate network latency
    });
  };

  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div>
      <h2>Email Marketing</h2>

      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      <h3>Subscribe to our Newsletter</h3>
      <form onSubmit={handleSubscribe}>
        <input
          type="email"
          placeholder="Enter your email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button type="submit">Subscribe</button>
      </form>

      <h3>Create Email Campaign</h3>
      <form onSubmit={handleCreateCampaign}>
        <input
          type="text"
          placeholder="Subject"
          value={campaignSubject}
          onChange={(e) => setCampaignSubject(e.target.value)}
        />
        <textarea
          placeholder="Body"
          value={campaignBody}
          onChange={(e) => setCampaignBody(e.target.value)}
        />
        <button type="submit">Create Campaign</button>
      </form>

      <h3>Subscribers</h3>
      <ul>
        {subscribers.map((subscriber, index) => (
          <li key={index}>{subscriber.email}</li>
        ))}
      </ul>

      <h3>Campaigns</h3>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>{campaign.subject}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmailMarketing;
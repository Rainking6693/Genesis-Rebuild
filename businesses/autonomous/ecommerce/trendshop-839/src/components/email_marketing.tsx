// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  status: 'draft' | 'scheduled' | 'sent';
}

const EmailMarketing = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('/api/email-campaigns'); // Assuming an API endpoint
        setCampaigns(response.data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch email campaigns.');
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return <div>Loading email campaigns...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Email Marketing</h1>
      {campaigns.map((campaign) => (
        <div key={campaign.id}>
          <h2>{campaign.name}</h2>
          <p>Subject: {campaign.subject}</p>
          <p>Status: {campaign.status}</p>
        </div>
      ))}
      {/* Add UI elements for creating, editing, and sending campaigns */}
    </div>
  );
};

export default EmailMarketing;

// api/email-campaigns.ts (Example backend endpoint - Node.js)
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Simulate fetching campaigns from a database
    const campaigns = [
      { id: '1', name: 'Welcome Email', subject: 'Welcome to our store!', body: '...', status: 'sent' },
      { id: '2', name: 'Summer Sale', subject: 'Summer Sale is here!', body: '...', status: 'scheduled' },
    ];
    res.status(200).json(campaigns);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
}

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  status: 'draft' | 'scheduled' | 'sent';
}

const EmailMarketing = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('/api/email-campaigns'); // Assuming an API endpoint
        setCampaigns(response.data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch email campaigns.');
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return <div>Loading email campaigns...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Email Marketing</h1>
      {campaigns.map((campaign) => (
        <div key={campaign.id}>
          <h2>{campaign.name}</h2>
          <p>Subject: {campaign.subject}</p>
          <p>Status: {campaign.status}</p>
        </div>
      ))}
      {/* Add UI elements for creating, editing, and sending campaigns */}
    </div>
  );
};

export default EmailMarketing;

// api/email-campaigns.ts (Example backend endpoint - Node.js)
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Simulate fetching campaigns from a database
    const campaigns = [
      { id: '1', name: 'Welcome Email', subject: 'Welcome to our store!', body: '...', status: 'sent' },
      { id: '2', name: 'Summer Sale', subject: 'Summer Sale is here!', body: '...', status: 'scheduled' },
    ];
    res.status(200).json(campaigns);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
}
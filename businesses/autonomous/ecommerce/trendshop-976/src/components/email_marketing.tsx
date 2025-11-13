// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { SendGrid } from '@sendgrid/mail'; // Example: Using SendGrid
import { useToast } from './ToastContext'; // Assuming a Toast context for notifications

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

interface Subscriber {
  id: string;
  email: string;
  subscribed: boolean;
}

interface Campaign {
  id: string;
  name: string;
  templateId: string;
  segment: string; // e.g., "New Customers", "Abandoned Cart"
  scheduledTime: Date;
  status: 'draft' | 'scheduled' | 'sent';
}

const EmailMarketing = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast(); // Access the showToast function from the context

  const apiKey = process.env.SENDGRID_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API (replace with actual API calls)
        const templatesData = await fetchTemplates();
        const subscribersData = await fetchSubscribers();
        const campaignsData = await fetchCampaigns();

        setTemplates(templatesData);
        setSubscribers(subscribersData);
        setCampaigns(campaignsData);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        showToast({ message: `Error fetching data: ${error.message}`, type: 'error' });
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  // Simulated API calls (replace with actual API endpoints)
  const fetchTemplates = async (): Promise<EmailTemplate[]> => {
    // Replace with actual API call
    return [
      { id: '1', name: 'Welcome Email', subject: 'Welcome!', body: 'Welcome to our store!' },
      { id: '2', name: 'Discount Offer', subject: 'Special Offer!', body: 'Get 20% off!' },
    ];
  };

  const fetchSubscribers = async (): Promise<Subscriber[]> => {
    // Replace with actual API call
    return [
      { id: '1', email: 'test1@example.com', subscribed: true },
      { id: '2', email: 'test2@example.com', subscribed: false },
    ];
  };

  const fetchCampaigns = async (): Promise<Campaign[]> => {
    // Replace with actual API call
    return [
      { id: '1', name: 'Weekly Newsletter', templateId: '1', segment: 'All Subscribers', scheduledTime: new Date(), status: 'scheduled' },
    ];
  };

  const sendEmail = async (to: string, subject: string, body: string) => {
    if (!apiKey) {
      console.error("SendGrid API key not found in environment variables.");
      showToast({ message: "SendGrid API key not found.", type: 'error' });
      return;
    }

    const sgMail = new SendGrid();
    sgMail.setApiKey(apiKey);

    const msg = {
      to: to,
      from: 'your-email@example.com', // Replace with your verified sender email
      subject: subject,
      html: body,
    };

    try {
      await sgMail.send(msg);
      console.log(`Email sent to ${to}`);
      showToast({ message: `Email sent to ${to}`, type: 'success' });
    } catch (error: any) {
      console.error("Error sending email:", error);
      showToast({ message: `Error sending email: ${error.message}`, type: 'error' });
    }
  };

  const handleSendTestEmail = async () => {
    try {
      await sendEmail('test@example.com', 'Test Email', 'This is a test email from the EmailMarketing component.');
    } catch (error: any) {
      console.error("Error sending test email:", error);
      showToast({ message: `Error sending test email: ${error.message}`, type: 'error' });
    }
  };

  if (loading) {
    return <div>Loading email marketing data...</div>;
  }

  return (
    <div>
      <h1>Email Marketing</h1>
      <p>Manage your email campaigns here.</p>

      <h2>Templates</h2>
      <ul>
        {templates.map((template) => (
          <li key={template.id}>
            {template.name} - {template.subject}
          </li>
        ))}
      </ul>

      <h2>Subscribers</h2>
      <ul>
        {subscribers.map((subscriber) => (
          <li key={subscriber.id}>
            {subscriber.email} - {subscriber.subscribed ? 'Subscribed' : 'Unsubscribed'}
          </li>
        ))}
      </ul>

      <h2>Campaigns</h2>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>
            {campaign.name} - {campaign.status}
          </li>
        ))}
      </ul>

      <button onClick={handleSendTestEmail}>Send Test Email</button>
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { SendGrid } from '@sendgrid/mail'; // Example: Using SendGrid
import { useToast } from './ToastContext'; // Assuming a Toast context for notifications

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

interface Subscriber {
  id: string;
  email: string;
  subscribed: boolean;
}

interface Campaign {
  id: string;
  name: string;
  templateId: string;
  segment: string; // e.g., "New Customers", "Abandoned Cart"
  scheduledTime: Date;
  status: 'draft' | 'scheduled' | 'sent';
}

const EmailMarketing = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast(); // Access the showToast function from the context

  const apiKey = process.env.SENDGRID_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API (replace with actual API calls)
        const templatesData = await fetchTemplates();
        const subscribersData = await fetchSubscribers();
        const campaignsData = await fetchCampaigns();

        setTemplates(templatesData);
        setSubscribers(subscribersData);
        setCampaigns(campaignsData);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        showToast({ message: `Error fetching data: ${error.message}`, type: 'error' });
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  // Simulated API calls (replace with actual API endpoints)
  const fetchTemplates = async (): Promise<EmailTemplate[]> => {
    // Replace with actual API call
    return [
      { id: '1', name: 'Welcome Email', subject: 'Welcome!', body: 'Welcome to our store!' },
      { id: '2', name: 'Discount Offer', subject: 'Special Offer!', body: 'Get 20% off!' },
    ];
  };

  const fetchSubscribers = async (): Promise<Subscriber[]> => {
    // Replace with actual API call
    return [
      { id: '1', email: 'test1@example.com', subscribed: true },
      { id: '2', email: 'test2@example.com', subscribed: false },
    ];
  };

  const fetchCampaigns = async (): Promise<Campaign[]> => {
    // Replace with actual API call
    return [
      { id: '1', name: 'Weekly Newsletter', templateId: '1', segment: 'All Subscribers', scheduledTime: new Date(), status: 'scheduled' },
    ];
  };

  const sendEmail = async (to: string, subject: string, body: string) => {
    if (!apiKey) {
      console.error("SendGrid API key not found in environment variables.");
      showToast({ message: "SendGrid API key not found.", type: 'error' });
      return;
    }

    const sgMail = new SendGrid();
    sgMail.setApiKey(apiKey);

    const msg = {
      to: to,
      from: 'your-email@example.com', // Replace with your verified sender email
      subject: subject,
      html: body,
    };

    try {
      await sgMail.send(msg);
      console.log(`Email sent to ${to}`);
      showToast({ message: `Email sent to ${to}`, type: 'success' });
    } catch (error: any) {
      console.error("Error sending email:", error);
      showToast({ message: `Error sending email: ${error.message}`, type: 'error' });
    }
  };

  const handleSendTestEmail = async () => {
    try {
      await sendEmail('test@example.com', 'Test Email', 'This is a test email from the EmailMarketing component.');
    } catch (error: any) {
      console.error("Error sending test email:", error);
      showToast({ message: `Error sending test email: ${error.message}`, type: 'error' });
    }
  };

  if (loading) {
    return <div>Loading email marketing data...</div>;
  }

  return (
    <div>
      <h1>Email Marketing</h1>
      <p>Manage your email campaigns here.</p>

      <h2>Templates</h2>
      <ul>
        {templates.map((template) => (
          <li key={template.id}>
            {template.name} - {template.subject}
          </li>
        ))}
      </ul>

      <h2>Subscribers</h2>
      <ul>
        {subscribers.map((subscriber) => (
          <li key={subscriber.id}>
            {subscriber.email} - {subscriber.subscribed ? 'Subscribed' : 'Unsubscribed'}
          </li>
        ))}
      </ul>

      <h2>Campaigns</h2>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>
            {campaign.name} - {campaign.status}
          </li>
        ))}
      </ul>

      <button onClick={handleSendTestEmail}>Send Test Email</button>
    </div>
  );
};

export default EmailMarketing;
// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { useToast } from './ToastContext'; // Assuming a ToastContext for notifications
import { validateEmail } from '../utils/validation'; // Assuming a validation utility
import { apiClient } from '../api/client'; // Assuming an API client for backend communication

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: Date;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

const EmailMarketing = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [campaignName, setCampaignName] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    // Fetch subscribers and templates on component mount
    fetchSubscribers();
    fetchTemplates();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await apiClient.get('/subscribers');
      setSubscribers(response.data);
    } catch (error: any) {
      console.error('Error fetching subscribers:', error);
      showToast({ message: `Error fetching subscribers: ${error.message}`, type: 'error' });
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await apiClient.get('/email-templates');
      setTemplates(response.data);
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      showToast({ message: `Error fetching templates: ${error.message}`, type: 'error' });
    }
  };

  const handleSubscribe = async () => {
    if (!validateEmail(newEmail)) {
      showToast({ message: 'Invalid email address', type: 'warning' });
      return;
    }

    try {
      const response = await apiClient.post('/subscribers', { email: newEmail });
      setSubscribers([...subscribers, response.data]);
      setNewEmail('');
      showToast({ message: 'Successfully subscribed!', type: 'success' });
    } catch (error: any) {
      console.error('Error subscribing:', error);
      showToast({ message: `Error subscribing: ${error.message}`, type: 'error' });
    }
  };

  const handleSendCampaign = async () => {
    if (!selectedTemplate || !campaignName) {
      showToast({ message: 'Please select a template and enter a campaign name', type: 'warning' });
      return;
    }

    try {
      await apiClient.post('/campaigns', {
        templateId: selectedTemplate,
        campaignName: campaignName,
        subscriberIds: subscribers.map((s) => s.id),
      });
      showToast({ message: 'Campaign sent successfully!', type: 'success' });
    } catch (error: any) {
      console.error('Error sending campaign:', error);
      showToast({ message: `Error sending campaign: ${error.message}`, type: 'error' });
    }
  };

  return (
    <div className="email-marketing">
      <h2>Email Marketing</h2>

      {/* Subscriber Management */}
      <div>
        <h3>Subscribers</h3>
        <ul>
          {subscribers.map((subscriber) => (
            <li key={subscriber.id}>{subscriber.email}</li>
          ))}
        </ul>
        <input
          type="email"
          placeholder="Enter email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button onClick={handleSubscribe}>Subscribe</button>
      </div>

      {/* Campaign Creation */}
      <div>
        <h3>Send Campaign</h3>
        <label htmlFor="template">Select Template:</label>
        <select id="template" onChange={(e) => setSelectedTemplate(e.target.value)}>
          <option value="">-- Select Template --</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
        <label htmlFor="campaignName">Campaign Name:</label>
        <input
          type="text"
          id="campaignName"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />
        <button onClick={handleSendCampaign}>Send Campaign</button>
      </div>
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { useToast } from './ToastContext'; // Assuming a ToastContext for notifications
import { validateEmail } from '../utils/validation'; // Assuming a validation utility
import { apiClient } from '../api/client'; // Assuming an API client for backend communication

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: Date;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

const EmailMarketing = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [campaignName, setCampaignName] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    // Fetch subscribers and templates on component mount
    fetchSubscribers();
    fetchTemplates();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await apiClient.get('/subscribers');
      setSubscribers(response.data);
    } catch (error: any) {
      console.error('Error fetching subscribers:', error);
      showToast({ message: `Error fetching subscribers: ${error.message}`, type: 'error' });
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await apiClient.get('/email-templates');
      setTemplates(response.data);
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      showToast({ message: `Error fetching templates: ${error.message}`, type: 'error' });
    }
  };

  const handleSubscribe = async () => {
    if (!validateEmail(newEmail)) {
      showToast({ message: 'Invalid email address', type: 'warning' });
      return;
    }

    try {
      const response = await apiClient.post('/subscribers', { email: newEmail });
      setSubscribers([...subscribers, response.data]);
      setNewEmail('');
      showToast({ message: 'Successfully subscribed!', type: 'success' });
    } catch (error: any) {
      console.error('Error subscribing:', error);
      showToast({ message: `Error subscribing: ${error.message}`, type: 'error' });
    }
  };

  const handleSendCampaign = async () => {
    if (!selectedTemplate || !campaignName) {
      showToast({ message: 'Please select a template and enter a campaign name', type: 'warning' });
      return;
    }

    try {
      await apiClient.post('/campaigns', {
        templateId: selectedTemplate,
        campaignName: campaignName,
        subscriberIds: subscribers.map((s) => s.id),
      });
      showToast({ message: 'Campaign sent successfully!', type: 'success' });
    } catch (error: any) {
      console.error('Error sending campaign:', error);
      showToast({ message: `Error sending campaign: ${error.message}`, type: 'error' });
    }
  };

  return (
    <div className="email-marketing">
      <h2>Email Marketing</h2>

      {/* Subscriber Management */}
      <div>
        <h3>Subscribers</h3>
        <ul>
          {subscribers.map((subscriber) => (
            <li key={subscriber.id}>{subscriber.email}</li>
          ))}
        </ul>
        <input
          type="email"
          placeholder="Enter email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button onClick={handleSubscribe}>Subscribe</button>
      </div>

      {/* Campaign Creation */}
      <div>
        <h3>Send Campaign</h3>
        <label htmlFor="template">Select Template:</label>
        <select id="template" onChange={(e) => setSelectedTemplate(e.target.value)}>
          <option value="">-- Select Template --</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
        <label htmlFor="campaignName">Campaign Name:</label>
        <input
          type="text"
          id="campaignName"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />
        <button onClick={handleSendCampaign}>Send Campaign</button>
      </div>
    </div>
  );
};

export default EmailMarketing;
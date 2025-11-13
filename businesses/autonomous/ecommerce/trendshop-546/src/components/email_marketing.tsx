// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { fetchEmailTemplates, sendEmailCampaign, EmailTemplate, Subscriber } from '../api/emailService'; // Assuming an email service API
import { ErrorBoundary } from 'react-error-boundary'; // For error boundaries

interface EmailMarketingProps {
  businessName: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ businessName }) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]); // Placeholder - needs actual subscriber data
  const [campaignName, setCampaignName] = useState<string>('');
  const [scheduleTime, setScheduleTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const fetchedTemplates = await fetchEmailTemplates();
        setTemplates(fetchedTemplates);
      } catch (err: any) {
        setError(`Failed to load email templates: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
  };

  const handleSendCampaign = async () => {
    if (!selectedTemplate) {
      setError("Please select an email template.");
      return;
    }

    if (!campaignName) {
      setError("Please enter a campaign name.");
      return;
    }

    if (!scheduleTime) {
      setError("Please select a schedule time.");
      return;
    }

    try {
      await sendEmailCampaign(campaignName, selectedTemplate.id, subscribers.map(s => s.email), scheduleTime);
      alert("Campaign scheduled successfully!"); // Replace with a better notification
    } catch (err: any) {
      setError(`Failed to send email campaign: ${err.message}`);
    }
  };

  const ErrorFallback = ({ error }: { error: Error }) => (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );

  if (isLoading) {
    return <div>Loading email templates...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div>
        <h2>Email Marketing for {businessName}</h2>
        <label htmlFor="campaignName">Campaign Name:</label>
        <input
          type="text"
          id="campaignName"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />

        <label htmlFor="scheduleTime">Schedule Time:</label>
        <input
          type="datetime-local"
          id="scheduleTime"
          onChange={(e) => setScheduleTime(new Date(e.target.value))}
        />

        <h3>Select Email Template:</h3>
        <ul>
          {templates.map((template) => (
            <li key={template.id} onClick={() => handleTemplateSelect(template)}>
              {template.name}
            </li>
          ))}
        </ul>

        {selectedTemplate && (
          <div>
            <h3>Selected Template: {selectedTemplate.name}</h3>
            <p>{selectedTemplate.content}</p>
          </div>
        )}

        <button onClick={handleSendCampaign}>Schedule Campaign</button>
      </div>
    </ErrorBoundary>
  );
};

export default EmailMarketing;

// Dummy types and API functions (replace with actual implementation)
interface EmailTemplate {
  id: string;
  name: string;
  content: string;
}

interface Subscriber {
  email: string;
}

async function fetchEmailTemplates(): Promise<EmailTemplate[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', name: 'Welcome Email', content: 'Welcome to our store!' },
        { id: '2', name: 'Discount Offer', content: 'Get 20% off your next purchase!' },
      ]);
    }, 500);
  });
}

async function sendEmailCampaign(campaignName: string, templateId: string, subscriberEmails: string[], scheduleTime: Date): Promise<void> {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Sending campaign "${campaignName}" using template ${templateId} to ${subscriberEmails.length} subscribers at ${scheduleTime}`);
      resolve();
      //reject(new Error("Failed to send email campaign (simulated)")); //Uncomment to test error handling
    }, 500);
  });
}

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { fetchEmailTemplates, sendEmailCampaign, EmailTemplate, Subscriber } from '../api/emailService'; // Assuming an email service API
import { ErrorBoundary } from 'react-error-boundary'; // For error boundaries

interface EmailMarketingProps {
  businessName: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ businessName }) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]); // Placeholder - needs actual subscriber data
  const [campaignName, setCampaignName] = useState<string>('');
  const [scheduleTime, setScheduleTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const fetchedTemplates = await fetchEmailTemplates();
        setTemplates(fetchedTemplates);
      } catch (err: any) {
        setError(`Failed to load email templates: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
  };

  const handleSendCampaign = async () => {
    if (!selectedTemplate) {
      setError("Please select an email template.");
      return;
    }

    if (!campaignName) {
      setError("Please enter a campaign name.");
      return;
    }

    if (!scheduleTime) {
      setError("Please select a schedule time.");
      return;
    }

    try {
      await sendEmailCampaign(campaignName, selectedTemplate.id, subscribers.map(s => s.email), scheduleTime);
      alert("Campaign scheduled successfully!"); // Replace with a better notification
    } catch (err: any) {
      setError(`Failed to send email campaign: ${err.message}`);
    }
  };

  const ErrorFallback = ({ error }: { error: Error }) => (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );

  if (isLoading) {
    return <div>Loading email templates...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div>
        <h2>Email Marketing for {businessName}</h2>
        <label htmlFor="campaignName">Campaign Name:</label>
        <input
          type="text"
          id="campaignName"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />

        <label htmlFor="scheduleTime">Schedule Time:</label>
        <input
          type="datetime-local"
          id="scheduleTime"
          onChange={(e) => setScheduleTime(new Date(e.target.value))}
        />

        <h3>Select Email Template:</h3>
        <ul>
          {templates.map((template) => (
            <li key={template.id} onClick={() => handleTemplateSelect(template)}>
              {template.name}
            </li>
          ))}
        </ul>

        {selectedTemplate && (
          <div>
            <h3>Selected Template: {selectedTemplate.name}</h3>
            <p>{selectedTemplate.content}</p>
          </div>
        )}

        <button onClick={handleSendCampaign}>Schedule Campaign</button>
      </div>
    </ErrorBoundary>
  );
};

export default EmailMarketing;

// Dummy types and API functions (replace with actual implementation)
interface EmailTemplate {
  id: string;
  name: string;
  content: string;
}

interface Subscriber {
  email: string;
}

async function fetchEmailTemplates(): Promise<EmailTemplate[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', name: 'Welcome Email', content: 'Welcome to our store!' },
        { id: '2', name: 'Discount Offer', content: 'Get 20% off your next purchase!' },
      ]);
    }, 500);
  });
}

async function sendEmailCampaign(campaignName: string, templateId: string, subscriberEmails: string[], scheduleTime: Date): Promise<void> {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Sending campaign "${campaignName}" using template ${templateId} to ${subscriberEmails.length} subscribers at ${scheduleTime}`);
      resolve();
      //reject(new Error("Failed to send email campaign (simulated)")); //Uncomment to test error handling
    }, 500);
  });
}
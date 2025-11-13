// src/components/EmailMarketing/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { subscribeUser, getEmailTemplates } from './emailMarketingApi'; // Assuming an API file
import EmailTemplatePreview from './EmailTemplatePreview'; // Component for previewing templates

interface EmailMarketingProps {
  userId: string; // Example: User ID for personalization
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ userId }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const fetchedTemplates = await getEmailTemplates();
        setTemplates(fetchedTemplates);
        setLoading(false);
      } catch (err: any) {
        setError(`Failed to fetch email templates: ${err.message}`);
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleSubscribe = async () => {
    try {
      await subscribeUser(email, userId);
      setSubscribed(true);
    } catch (err: any) {
      setError(`Subscription failed: ${err.message}`);
    }
  };

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
  };

  if (loading) {
    return <div>Loading email templates...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Email Marketing</h2>
      {!subscribed ? (
        <div>
          <p>Subscribe to our newsletter!</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSubscribe}>Subscribe</button>
        </div>
      ) : (
        <p>Thank you for subscribing!</p>
      )}

      <h3>Email Templates</h3>
      <ul>
        {templates.map((template) => (
          <li key={template.id}>
            <button onClick={() => handleTemplateSelect(template)}>
              {template.name}
            </button>
          </li>
        ))}
      </ul>

      {selectedTemplate && (
        <EmailTemplatePreview template={selectedTemplate} />
      )}
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing/EmailTemplatePreview.tsx
import React from 'react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

interface EmailTemplatePreviewProps {
  template: EmailTemplate;
}

const EmailTemplatePreview: React.FC<EmailTemplatePreviewProps> = ({ template }) => {
  return (
    <div>
      <h4>Previewing: {template.name}</h4>
      <h5>Subject: {template.subject}</h5>
      <p>{template.body}</p>
    </div>
  );
};

export default EmailTemplatePreview;

// src/components/EmailMarketing/emailMarketingApi.ts
// Mock API calls - replace with actual API integration
export const subscribeUser = async (email: string, userId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && userId) {
        console.log(`Subscribed ${email} for user ${userId}`);
        resolve();
      } else {
        reject(new Error("Invalid email or user ID"));
      }
    }, 500); // Simulate API delay
  });
};

export const getEmailTemplates = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const templates = [
        { id: '1', name: 'Welcome Email', subject: 'Welcome!', body: 'Welcome to our store!' },
        { id: '2', name: 'Discount Offer', subject: 'Special Offer', body: 'Get 20% off!' },
      ];
      resolve(templates);
    }, 500); // Simulate API delay
  });
};
// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { useEmailService } from '../hooks/useEmailService'; // Assuming a custom hook for email service integration

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

interface Subscriber {
  id: string;
  email: string;
  name: string;
  subscribed: boolean;
}

const EmailMarketing = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const { sendEmail, getTemplates, getSubscribers } = useEmailService();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const fetchedTemplates = await getTemplates();
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error("Error fetching templates:", error);
        // Implement error boundary or user-friendly error message
      }
    };

    const fetchSubscribers = async () => {
      try {
        const fetchedSubscribers = await getSubscribers();
        setSubscribers(fetchedSubscribers);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
        // Implement error boundary or user-friendly error message
      }
    };

    fetchTemplates();
    fetchSubscribers();
  }, [getTemplates, getSubscribers]);

  const handleSendEmail = async () => {
    if (!selectedTemplate || selectedSubscribers.length === 0) {
      alert("Please select a template and at least one subscriber.");
      return;
    }

    try {
      const template = templates.find((t) => t.id === selectedTemplate);
      if (!template) {
        throw new Error("Selected template not found.");
      }

      const emailsToSend = subscribers
        .filter((s) => selectedSubscribers.includes(s.id))
        .map((s) => s.email);

      for (const email of emailsToSend) {
        await sendEmail(email, template.subject, template.body);
      }

      alert("Emails sent successfully!");
    } catch (error) {
      console.error("Error sending emails:", error);
      alert("Error sending emails. Please check the console for details.");
    }
  };

  return (
    <div>
      <h2>Email Marketing</h2>

      {/* Template Selection */}
      <div>
        <h3>Select Template</h3>
        <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
          <option value="">-- Select a Template --</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subscriber Selection */}
      <div>
        <h3>Select Subscribers</h3>
        {subscribers.map((subscriber) => (
          <div key={subscriber.id}>
            <label>
              <input
                type="checkbox"
                value={subscriber.id}
                checked={selectedSubscribers.includes(subscriber.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSubscribers([...selectedSubscribers, subscriber.id]);
                  } else {
                    setSelectedSubscribers(selectedSubscribers.filter((id) => id !== subscriber.id));
                  }
                }}
              />
              {subscriber.name} ({subscriber.email})
            </label>
          </div>
        ))}
      </div>

      {/* Send Email Button */}
      <button onClick={handleSendEmail}>Send Email</button>
    </div>
  );
};

export default EmailMarketing;

// src/hooks/useEmailService.ts
import { useState, useEffect } from 'react';

// Placeholder for actual email service integration (e.g., SendGrid, Mailchimp)
const useEmailService = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock functions for demonstration purposes
  const sendEmail = async (to: string, subject: string, body: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(`Sending email to: ${to}, subject: ${subject}`);
        // Simulate success or failure
        if (Math.random() > 0.2) {
          resolve();
        } else {
          reject(new Error("Failed to send email (simulated error)"));
        }
      }, 500);
    });
  };

  const getTemplates = async (): Promise<EmailTemplate[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockTemplates: EmailTemplate[] = [
          { id: '1', name: 'Welcome Email', subject: 'Welcome!', body: 'Welcome to our store!' },
          { id: '2', name: 'Discount Offer', subject: 'Special Offer!', body: 'Get 20% off!' },
        ];
        resolve(mockTemplates);
        setLoading(false);
      }, 300);
    });
  };

  const getSubscribers = async (): Promise<Subscriber[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockSubscribers: Subscriber[] = [
          { id: '1', email: 'john.doe@example.com', name: 'John Doe', subscribed: true },
          { id: '2', email: 'jane.doe@example.com', name: 'Jane Doe', subscribed: true },
        ];
        resolve(mockSubscribers);
        setLoading(false);
      }, 400);
    });
  };

  useEffect(() => {
    setLoading(false); // Initial loading state
  }, []);

  return { sendEmail, getTemplates, getSubscribers, loading, error };
};

export { useEmailService };

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { useEmailService } from '../hooks/useEmailService'; // Assuming a custom hook for email service integration

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

interface Subscriber {
  id: string;
  email: string;
  name: string;
  subscribed: boolean;
}

const EmailMarketing = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const { sendEmail, getTemplates, getSubscribers } = useEmailService();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const fetchedTemplates = await getTemplates();
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error("Error fetching templates:", error);
        // Implement error boundary or user-friendly error message
      }
    };

    const fetchSubscribers = async () => {
      try {
        const fetchedSubscribers = await getSubscribers();
        setSubscribers(fetchedSubscribers);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
        // Implement error boundary or user-friendly error message
      }
    };

    fetchTemplates();
    fetchSubscribers();
  }, [getTemplates, getSubscribers]);

  const handleSendEmail = async () => {
    if (!selectedTemplate || selectedSubscribers.length === 0) {
      alert("Please select a template and at least one subscriber.");
      return;
    }

    try {
      const template = templates.find((t) => t.id === selectedTemplate);
      if (!template) {
        throw new Error("Selected template not found.");
      }

      const emailsToSend = subscribers
        .filter((s) => selectedSubscribers.includes(s.id))
        .map((s) => s.email);

      for (const email of emailsToSend) {
        await sendEmail(email, template.subject, template.body);
      }

      alert("Emails sent successfully!");
    } catch (error) {
      console.error("Error sending emails:", error);
      alert("Error sending emails. Please check the console for details.");
    }
  };

  return (
    <div>
      <h2>Email Marketing</h2>

      {/* Template Selection */}
      <div>
        <h3>Select Template</h3>
        <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
          <option value="">-- Select a Template --</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subscriber Selection */}
      <div>
        <h3>Select Subscribers</h3>
        {subscribers.map((subscriber) => (
          <div key={subscriber.id}>
            <label>
              <input
                type="checkbox"
                value={subscriber.id}
                checked={selectedSubscribers.includes(subscriber.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSubscribers([...selectedSubscribers, subscriber.id]);
                  } else {
                    setSelectedSubscribers(selectedSubscribers.filter((id) => id !== subscriber.id));
                  }
                }}
              />
              {subscriber.name} ({subscriber.email})
            </label>
          </div>
        ))}
      </div>

      {/* Send Email Button */}
      <button onClick={handleSendEmail}>Send Email</button>
    </div>
  );
};

export default EmailMarketing;

// src/hooks/useEmailService.ts
import { useState, useEffect } from 'react';

// Placeholder for actual email service integration (e.g., SendGrid, Mailchimp)
const useEmailService = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock functions for demonstration purposes
  const sendEmail = async (to: string, subject: string, body: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(`Sending email to: ${to}, subject: ${subject}`);
        // Simulate success or failure
        if (Math.random() > 0.2) {
          resolve();
        } else {
          reject(new Error("Failed to send email (simulated error)"));
        }
      }, 500);
    });
  };

  const getTemplates = async (): Promise<EmailTemplate[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockTemplates: EmailTemplate[] = [
          { id: '1', name: 'Welcome Email', subject: 'Welcome!', body: 'Welcome to our store!' },
          { id: '2', name: 'Discount Offer', subject: 'Special Offer!', body: 'Get 20% off!' },
        ];
        resolve(mockTemplates);
        setLoading(false);
      }, 300);
    });
  };

  const getSubscribers = async (): Promise<Subscriber[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockSubscribers: Subscriber[] = [
          { id: '1', email: 'john.doe@example.com', name: 'John Doe', subscribed: true },
          { id: '2', email: 'jane.doe@example.com', name: 'Jane Doe', subscribed: true },
        ];
        resolve(mockSubscribers);
        setLoading(false);
      }, 400);
    });
  };

  useEffect(() => {
    setLoading(false); // Initial loading state
  }, []);

  return { sendEmail, getTemplates, getSubscribers, loading, error };
};

export { useEmailService };
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
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [newSubscriberEmail, setNewSubscriberEmail] = useState<string>('');
  const { sendEmail, getTemplates, getSubscribers, addSubscriber } = useEmailService(); // Using the custom hook

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const fetchedTemplates = await getTemplates();
        setTemplates(fetchedTemplates);
      } catch (error: any) {
        console.error("Error fetching templates:", error.message);
        // Implement error boundary or display user-friendly error message
      }
    };

    const fetchSubscribers = async () => {
      try {
        const fetchedSubscribers = await getSubscribers();
        setSubscribers(fetchedSubscribers);
      } catch (error: any) {
        console.error("Error fetching subscribers:", error.message);
        // Implement error boundary or display user-friendly error message
      }
    };

    fetchTemplates();
    fetchSubscribers();
  }, [getTemplates, getSubscribers]);

  const handleSendEmail = async () => {
    if (!selectedTemplate) {
      console.warn("No template selected.");
      return;
    }

    try {
      // Send email to all subscribers
      for (const subscriber of subscribers) {
        await sendEmail(subscriber.email, selectedTemplate.subject, selectedTemplate.body);
      }
      alert("Emails sent successfully!");
    } catch (error: any) {
      console.error("Error sending emails:", error.message);
      // Implement error boundary or display user-friendly error message
    }
  };

  const handleAddSubscriber = async () => {
    try {
      await addSubscriber(newSubscriberEmail);
      setSubscribers([...subscribers, { id: Math.random().toString(), email: newSubscriberEmail, name: '', subscribed: true }]);
      setNewSubscriberEmail('');
    } catch (error: any) {
      console.error("Error adding subscriber:", error.message);
      // Implement error boundary or display user-friendly error message
    }
  };

  return (
    <div>
      <h2>Email Marketing</h2>

      <h3>Templates</h3>
      <ul>
        {templates.map((template) => (
          <li key={template.id} onClick={() => setSelectedTemplate(template)}>
            {template.name}
          </li>
        ))}
      </ul>

      <h3>Subscribers</h3>
      <ul>
        {subscribers.map((subscriber) => (
          <li key={subscriber.id}>{subscriber.email}</li>
        ))}
      </ul>

      <div>
        <input
          type="email"
          placeholder="New Subscriber Email"
          value={newSubscriberEmail}
          onChange={(e) => setNewSubscriberEmail(e.target.value)}
        />
        <button onClick={handleAddSubscriber}>Add Subscriber</button>
      </div>

      <button onClick={handleSendEmail} disabled={!selectedTemplate}>
        Send Email to All Subscribers
      </button>
    </div>
  );
};

export default EmailMarketing;

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
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [newSubscriberEmail, setNewSubscriberEmail] = useState<string>('');
  const { sendEmail, getTemplates, getSubscribers, addSubscriber } = useEmailService(); // Using the custom hook

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const fetchedTemplates = await getTemplates();
        setTemplates(fetchedTemplates);
      } catch (error: any) {
        console.error("Error fetching templates:", error.message);
        // Implement error boundary or display user-friendly error message
      }
    };

    const fetchSubscribers = async () => {
      try {
        const fetchedSubscribers = await getSubscribers();
        setSubscribers(fetchedSubscribers);
      } catch (error: any) {
        console.error("Error fetching subscribers:", error.message);
        // Implement error boundary or display user-friendly error message
      }
    };

    fetchTemplates();
    fetchSubscribers();
  }, [getTemplates, getSubscribers]);

  const handleSendEmail = async () => {
    if (!selectedTemplate) {
      console.warn("No template selected.");
      return;
    }

    try {
      // Send email to all subscribers
      for (const subscriber of subscribers) {
        await sendEmail(subscriber.email, selectedTemplate.subject, selectedTemplate.body);
      }
      alert("Emails sent successfully!");
    } catch (error: any) {
      console.error("Error sending emails:", error.message);
      // Implement error boundary or display user-friendly error message
    }
  };

  const handleAddSubscriber = async () => {
    try {
      await addSubscriber(newSubscriberEmail);
      setSubscribers([...subscribers, { id: Math.random().toString(), email: newSubscriberEmail, name: '', subscribed: true }]);
      setNewSubscriberEmail('');
    } catch (error: any) {
      console.error("Error adding subscriber:", error.message);
      // Implement error boundary or display user-friendly error message
    }
  };

  return (
    <div>
      <h2>Email Marketing</h2>

      <h3>Templates</h3>
      <ul>
        {templates.map((template) => (
          <li key={template.id} onClick={() => setSelectedTemplate(template)}>
            {template.name}
          </li>
        ))}
      </ul>

      <h3>Subscribers</h3>
      <ul>
        {subscribers.map((subscriber) => (
          <li key={subscriber.id}>{subscriber.email}</li>
        ))}
      </ul>

      <div>
        <input
          type="email"
          placeholder="New Subscriber Email"
          value={newSubscriberEmail}
          onChange={(e) => setNewSubscriberEmail(e.target.value)}
        />
        <button onClick={handleAddSubscriber}>Add Subscriber</button>
      </div>

      <button onClick={handleSendEmail} disabled={!selectedTemplate}>
        Send Email to All Subscribers
      </button>
    </div>
  );
};

export default EmailMarketing;
// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { useEmailService } from './hooks/useEmailService'; // Assuming a custom hook for ESP integration
import { EmailTemplate } from './types/EmailTemplate'; // Assuming a type definition for email templates

interface EmailMarketingProps {
  businessName: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ businessName }) => {
  const [subscriptions, setSubscriptions] = useState<string[]>([]); // Array of email addresses
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const { sendEmail, addSubscriber, removeSubscriber } = useEmailService();

  useEffect(() => {
    // Load subscriptions and templates from local storage or API
    // Example:
    // const savedSubscriptions = localStorage.getItem('subscriptions');
    // if (savedSubscriptions) {
    //   setSubscriptions(JSON.parse(savedSubscriptions));
    // }
    // Fetch email templates from API
    fetchEmailTemplates();
  }, []);

  const fetchEmailTemplates = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/email-templates');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEmailTemplates(data);
    } catch (error: any) {
      console.error("Error fetching email templates:", error);
      // Display error message to the user
      alert("Failed to load email templates. Please try again later.");
    }
  };

  const handleSubscribe = (email: string) => {
    try {
      addSubscriber(email); // Call the ESP integration hook
      setSubscriptions([...subscriptions, email]);
      // localStorage.setItem('subscriptions', JSON.stringify([...subscriptions, email]));
      alert(`Successfully subscribed ${email} to ${businessName} newsletter!`);
    } catch (error: any) {
      console.error("Error subscribing:", error);
      alert("Subscription failed. Please check your email and try again.");
    }
  };

  const handleUnsubscribe = (email: string) => {
    try {
      removeSubscriber(email); // Call the ESP integration hook
      setSubscriptions(subscriptions.filter((sub) => sub !== email));
      // localStorage.setItem('subscriptions', JSON.stringify(subscriptions.filter((sub) => sub !== email)));
      alert(`Successfully unsubscribed ${email} from ${businessName} newsletter!`);
    } catch (error: any) {
      console.error("Error unsubscribing:", error);
      alert("Unsubscription failed. Please try again later.");
    }
  };

  const handleSendEmail = async (templateId: string, recipient: string) => {
    try {
      const template = emailTemplates.find(t => t.id === templateId);
      if (!template) {
        throw new Error(`Template with ID ${templateId} not found`);
      }

      await sendEmail(recipient, template.subject, template.body);
      alert(`Email sent successfully to ${recipient}!`);
    } catch (error: any) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Email Marketing for {businessName}</h2>

      {/* Subscription Form */}
      <div>
        <h3>Subscribe to our Newsletter</h3>
        <input type="email" placeholder="Your email" id="subscriptionEmail"/>
        <button onClick={() => handleSubscribe(document.getElementById("subscriptionEmail")!.value)}>Subscribe</button>
      </div>

      {/* Unsubscription Form */}
      <div>
        <h3>Unsubscribe from our Newsletter</h3>
        <input type="email" placeholder="Your email" id="unsubscriptionEmail"/>
        <button onClick={() => handleUnsubscribe(document.getElementById("unsubscriptionEmail")!.value)}>Unsubscribe</button>
      </div>

      {/* Email Sending Form */}
      <div>
        <h3>Send Email</h3>
        <select id="emailTemplate">
          {emailTemplates.map(template => (
            <option key={template.id} value={template.id}>{template.name}</option>
          ))}
        </select>
        <input type="email" placeholder="Recipient email" id="recipientEmail"/>
        <button onClick={() => handleSendEmail(document.getElementById("emailTemplate")!.value, document.getElementById("recipientEmail")!.value)}>Send Email</button>
      </div>

      {/* Display Subscriptions (for debugging) */}
      <div>
        <h3>Current Subscriptions</h3>
        <ul>
          {subscriptions.map((email, index) => (
            <li key={index}>{email}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmailMarketing;

// src/hooks/useEmailService.tsx
import { useState } from 'react';

export const useEmailService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (to: string, subject: string, body: string) => {
    setLoading(true);
    setError(null);

    try {
      // Replace with your actual API endpoint for sending emails
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, body }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to send email: ${response.status}`);
      }

      setLoading(false);
      return true; // Indicate success
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      console.error("Error sending email:", err);
      throw err; // Re-throw the error for the component to handle
    }
  };

  const addSubscriber = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      // Replace with your actual API endpoint for adding subscribers
      const response = await fetch('/api/add-subscriber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to add subscriber: ${response.status}`);
      }

      setLoading(false);
      return true; // Indicate success
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      console.error("Error adding subscriber:", err);
      throw err; // Re-throw the error for the component to handle
    }
  };

  const removeSubscriber = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      // Replace with your actual API endpoint for removing subscribers
      const response = await fetch('/api/remove-subscriber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to remove subscriber: ${response.status}`);
      }

      setLoading(false);
      return true; // Indicate success
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      console.error("Error removing subscriber:", err);
      throw err; // Re-throw the error for the component to handle
    }
  };

  return { sendEmail, addSubscriber, removeSubscriber, loading, error };
};

// src/types/EmailTemplate.tsx
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { useEmailService } from './hooks/useEmailService'; // Assuming a custom hook for ESP integration
import { EmailTemplate } from './types/EmailTemplate'; // Assuming a type definition for email templates

interface EmailMarketingProps {
  businessName: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ businessName }) => {
  const [subscriptions, setSubscriptions] = useState<string[]>([]); // Array of email addresses
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const { sendEmail, addSubscriber, removeSubscriber } = useEmailService();

  useEffect(() => {
    // Load subscriptions and templates from local storage or API
    // Example:
    // const savedSubscriptions = localStorage.getItem('subscriptions');
    // if (savedSubscriptions) {
    //   setSubscriptions(JSON.parse(savedSubscriptions));
    // }
    // Fetch email templates from API
    fetchEmailTemplates();
  }, []);

  const fetchEmailTemplates = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/email-templates');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEmailTemplates(data);
    } catch (error: any) {
      console.error("Error fetching email templates:", error);
      // Display error message to the user
      alert("Failed to load email templates. Please try again later.");
    }
  };

  const handleSubscribe = (email: string) => {
    try {
      addSubscriber(email); // Call the ESP integration hook
      setSubscriptions([...subscriptions, email]);
      // localStorage.setItem('subscriptions', JSON.stringify([...subscriptions, email]));
      alert(`Successfully subscribed ${email} to ${businessName} newsletter!`);
    } catch (error: any) {
      console.error("Error subscribing:", error);
      alert("Subscription failed. Please check your email and try again.");
    }
  };

  const handleUnsubscribe = (email: string) => {
    try {
      removeSubscriber(email); // Call the ESP integration hook
      setSubscriptions(subscriptions.filter((sub) => sub !== email));
      // localStorage.setItem('subscriptions', JSON.stringify(subscriptions.filter((sub) => sub !== email)));
      alert(`Successfully unsubscribed ${email} from ${businessName} newsletter!`);
    } catch (error: any) {
      console.error("Error unsubscribing:", error);
      alert("Unsubscription failed. Please try again later.");
    }
  };

  const handleSendEmail = async (templateId: string, recipient: string) => {
    try {
      const template = emailTemplates.find(t => t.id === templateId);
      if (!template) {
        throw new Error(`Template with ID ${templateId} not found`);
      }

      await sendEmail(recipient, template.subject, template.body);
      alert(`Email sent successfully to ${recipient}!`);
    } catch (error: any) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Email Marketing for {businessName}</h2>

      {/* Subscription Form */}
      <div>
        <h3>Subscribe to our Newsletter</h3>
        <input type="email" placeholder="Your email" id="subscriptionEmail"/>
        <button onClick={() => handleSubscribe(document.getElementById("subscriptionEmail")!.value)}>Subscribe</button>
      </div>

      {/* Unsubscription Form */}
      <div>
        <h3>Unsubscribe from our Newsletter</h3>
        <input type="email" placeholder="Your email" id="unsubscriptionEmail"/>
        <button onClick={() => handleUnsubscribe(document.getElementById("unsubscriptionEmail")!.value)}>Unsubscribe</button>
      </div>

      {/* Email Sending Form */}
      <div>
        <h3>Send Email</h3>
        <select id="emailTemplate">
          {emailTemplates.map(template => (
            <option key={template.id} value={template.id}>{template.name}</option>
          ))}
        </select>
        <input type="email" placeholder="Recipient email" id="recipientEmail"/>
        <button onClick={() => handleSendEmail(document.getElementById("emailTemplate")!.value, document.getElementById("recipientEmail")!.value)}>Send Email</button>
      </div>

      {/* Display Subscriptions (for debugging) */}
      <div>
        <h3>Current Subscriptions</h3>
        <ul>
          {subscriptions.map((email, index) => (
            <li key={index}>{email}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmailMarketing;

// src/hooks/useEmailService.tsx
import { useState } from 'react';

export const useEmailService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (to: string, subject: string, body: string) => {
    setLoading(true);
    setError(null);

    try {
      // Replace with your actual API endpoint for sending emails
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, body }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to send email: ${response.status}`);
      }

      setLoading(false);
      return true; // Indicate success
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      console.error("Error sending email:", err);
      throw err; // Re-throw the error for the component to handle
    }
  };

  const addSubscriber = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      // Replace with your actual API endpoint for adding subscribers
      const response = await fetch('/api/add-subscriber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to add subscriber: ${response.status}`);
      }

      setLoading(false);
      return true; // Indicate success
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      console.error("Error adding subscriber:", err);
      throw err; // Re-throw the error for the component to handle
    }
  };

  const removeSubscriber = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      // Replace with your actual API endpoint for removing subscribers
      const response = await fetch('/api/remove-subscriber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to remove subscriber: ${response.status}`);
      }

      setLoading(false);
      return true; // Indicate success
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      console.error("Error removing subscriber:", err);
      throw err; // Re-throw the error for the component to handle
    }
  };

  return { sendEmail, addSubscriber, removeSubscriber, loading, error };
};

// src/types/EmailTemplate.tsx
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}
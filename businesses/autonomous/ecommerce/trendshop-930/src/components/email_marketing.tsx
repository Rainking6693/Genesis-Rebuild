// src/components/EmailMarketing.tsx
import { useState, useEffect } from 'react';
import { sendEmail } from './emailService'; // Assume this is a separate module for email sending

interface Subscriber {
  email: string;
  name?: string;
  subscribedAt: Date;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

function EmailMarketing() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [emailList, setEmailList] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching subscribers and templates from an API
    const fetchSubscribers = async () => {
      try {
        const response = await fetch('/api/subscribers'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch subscribers: ${response.status}`);
        }
        const data: Subscriber[] = await response.json();
        setSubscribers(data);
      } catch (error: any) {
        console.error("Error fetching subscribers:", error);
        setErrorMessage("Failed to load subscribers. Please try again.");
      }
    };

    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/emailTemplates'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch email templates: ${response.status}`);
        }
        const data: EmailTemplate[] = await response.json();
        setTemplates(data);
      } catch (error: any) {
        console.error("Error fetching email templates:", error);
        setErrorMessage("Failed to load email templates. Please try again.");
      }
    };

    fetchSubscribers();
    fetchTemplates();
  }, []);

  const handleSendEmail = async () => {
    if (!selectedTemplate) {
      setErrorMessage("Please select an email template.");
      return;
    }

    if (!emailList) {
      setErrorMessage("Please enter a list of email addresses.");
      return;
    }

    const emailAddresses = emailList.split(",").map(email => email.trim());

    try {
      // Simulate sending emails using the emailService module
      const template = templates.find(t => t.id === selectedTemplate);
      if (!template) {
        throw new Error("Selected template not found.");
      }

      for (const email of emailAddresses) {
        await sendEmail(email, template.subject, template.body);
      }

      setSuccessMessage("Emails sent successfully!");
      setErrorMessage(null);

    } catch (error: any) {
      console.error("Error sending emails:", error);
      setErrorMessage(`Failed to send emails: ${error.message}`);
      setSuccessMessage(null);
    }
  };

  return (
    <div>
      <h2>Email Marketing</h2>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      <div>
        <label htmlFor="templateSelect">Select Email Template:</label>
        <select id="templateSelect" onChange={(e) => setSelectedTemplate(e.target.value)} value={selectedTemplate || ""}>
          <option value="">-- Select Template --</option>
          {templates.map(template => (
            <option key={template.id} value={template.id}>{template.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="emailList">Email List (comma-separated):</label>
        <textarea id="emailList" value={emailList} onChange={(e) => setEmailList(e.target.value)} />
      </div>

      <button onClick={handleSendEmail}>Send Emails</button>
    </div>
  );
}

export default EmailMarketing;

// src/emailService.ts
// Mock email sending function
export async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate success or failure
      const success = Math.random() > 0.1; // 90% success rate
      if (success) {
        console.log(`Email sent to ${to} with subject "${subject}"`);
        resolve();
      } else {
        reject(new Error(`Failed to send email to ${to}`));
      }
    }, 500); // Simulate network latency
  });
}

// src/components/EmailMarketing.tsx
import { useState, useEffect } from 'react';
import { sendEmail } from './emailService'; // Assume this is a separate module for email sending

interface Subscriber {
  email: string;
  name?: string;
  subscribedAt: Date;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

function EmailMarketing() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [emailList, setEmailList] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching subscribers and templates from an API
    const fetchSubscribers = async () => {
      try {
        const response = await fetch('/api/subscribers'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch subscribers: ${response.status}`);
        }
        const data: Subscriber[] = await response.json();
        setSubscribers(data);
      } catch (error: any) {
        console.error("Error fetching subscribers:", error);
        setErrorMessage("Failed to load subscribers. Please try again.");
      }
    };

    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/emailTemplates'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch email templates: ${response.status}`);
        }
        const data: EmailTemplate[] = await response.json();
        setTemplates(data);
      } catch (error: any) {
        console.error("Error fetching email templates:", error);
        setErrorMessage("Failed to load email templates. Please try again.");
      }
    };

    fetchSubscribers();
    fetchTemplates();
  }, []);

  const handleSendEmail = async () => {
    if (!selectedTemplate) {
      setErrorMessage("Please select an email template.");
      return;
    }

    if (!emailList) {
      setErrorMessage("Please enter a list of email addresses.");
      return;
    }

    const emailAddresses = emailList.split(",").map(email => email.trim());

    try {
      // Simulate sending emails using the emailService module
      const template = templates.find(t => t.id === selectedTemplate);
      if (!template) {
        throw new Error("Selected template not found.");
      }

      for (const email of emailAddresses) {
        await sendEmail(email, template.subject, template.body);
      }

      setSuccessMessage("Emails sent successfully!");
      setErrorMessage(null);

    } catch (error: any) {
      console.error("Error sending emails:", error);
      setErrorMessage(`Failed to send emails: ${error.message}`);
      setSuccessMessage(null);
    }
  };

  return (
    <div>
      <h2>Email Marketing</h2>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      <div>
        <label htmlFor="templateSelect">Select Email Template:</label>
        <select id="templateSelect" onChange={(e) => setSelectedTemplate(e.target.value)} value={selectedTemplate || ""}>
          <option value="">-- Select Template --</option>
          {templates.map(template => (
            <option key={template.id} value={template.id}>{template.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="emailList">Email List (comma-separated):</label>
        <textarea id="emailList" value={emailList} onChange={(e) => setEmailList(e.target.value)} />
      </div>

      <button onClick={handleSendEmail}>Send Emails</button>
    </div>
  );
}

export default EmailMarketing;

// src/emailService.ts
// Mock email sending function
export async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate success or failure
      const success = Math.random() > 0.1; // 90% success rate
      if (success) {
        console.log(`Email sent to ${to} with subject "${subject}"`);
        resolve();
      } else {
        reject(new Error(`Failed to send email to ${to}`));
      }
    }, 500); // Simulate network latency
  });
}
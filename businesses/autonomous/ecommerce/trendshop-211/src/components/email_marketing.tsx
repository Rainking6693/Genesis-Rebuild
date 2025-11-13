// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { sendEmail } from '../utils/emailService'; // Assuming an email service utility

interface EmailData {
  subject: string;
  body: string;
  recipient: string;
}

const EmailMarketing: React.FC = () => {
  const [emailData, setEmailData] = useState<EmailData>({
    subject: '',
    body: '',
    recipient: '',
  });
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');
    setError(null);

    try {
      const response = await sendEmail(emailData); // Call the email service
      if (response.success) {
        setStatus('Email sent successfully!');
      } else {
        setStatus('Email failed to send.');
        setError(response.error || 'Unknown error');
      }
    } catch (err: any) {
      setStatus('Email failed to send.');
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  useEffect(() => {
    // Example: Fetch abandoned cart data and pre-populate email body
    // This is a placeholder and would require a real API endpoint
    const fetchAbandonedCartData = async () => {
      try {
        // Simulate fetching data
        const cartData = {
          items: ['Product A', 'Product B'],
          total: 50.00,
        };

        const abandonedCartMessage = `Hi, you left some items in your cart!  Items: ${cartData.items.join(', ')}. Total: $${cartData.total}.  Complete your purchase now!`;
        setEmailData(prevData => ({ ...prevData, body: abandonedCartMessage }));
      } catch (error) {
        console.error("Error fetching abandoned cart data:", error);
        setError("Failed to load abandoned cart data.");
      }
    };

    fetchAbandonedCartData();
  }, []);

  return (
    <div>
      <h2>Email Marketing Component</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {status && <div>{status}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="recipient">Recipient:</label>
          <input type="email" id="recipient" name="recipient" value={emailData.recipient} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="subject">Subject:</label>
          <input type="text" id="subject" name="subject" value={emailData.subject} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="body">Body:</label>
          <textarea id="body" name="body" value={emailData.body} onChange={handleChange} rows={4} required />
        </div>
        <button type="submit">Send Email</button>
      </form>
    </div>
  );
};

export default EmailMarketing;
// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface EmailMarketingProps {
  apiKey: string; // API key for email marketing service (e.g., SendGrid, Mailchimp)
  listId: string; // ID of the email list to use
}

interface EmailSubscriptionFormProps {
  apiKey: string;
  listId: string;
}

const EmailSubscriptionForm: React.FC<EmailSubscriptionFormProps> = ({ apiKey, listId }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Replace with actual API call to your email marketing service
      const response = await fetch('/api/subscribe', { // Example API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, apiKey, listId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Subscription failed');
      }

      setIsSubscribed(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (isSubscribed) {
    return <p>Thank you for subscribing!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
};

const EmailMarketing: React.FC<EmailMarketingProps> = ({ apiKey, listId }) => {
  return (
    <div>
      <h2>Subscribe to our Newsletter</h2>
      <EmailSubscriptionForm apiKey={apiKey} listId={listId} />
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface EmailMarketingProps {
  apiKey: string; // API key for email marketing service (e.g., SendGrid, Mailchimp)
  listId: string; // ID of the email list to use
}

interface EmailSubscriptionFormProps {
  apiKey: string;
  listId: string;
}

const EmailSubscriptionForm: React.FC<EmailSubscriptionFormProps> = ({ apiKey, listId }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Replace with actual API call to your email marketing service
      const response = await fetch('/api/subscribe', { // Example API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, apiKey, listId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Subscription failed');
      }

      setIsSubscribed(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (isSubscribed) {
    return <p>Thank you for subscribing!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
};

const EmailMarketing: React.FC<EmailMarketingProps> = ({ apiKey, listId }) => {
  return (
    <div>
      <h2>Subscribe to our Newsletter</h2>
      <EmailSubscriptionForm apiKey={apiKey} listId={listId} />
    </div>
  );
};

export default EmailMarketing;

Now, I will use the `Write` tool to save the code to a file and then output the build report.
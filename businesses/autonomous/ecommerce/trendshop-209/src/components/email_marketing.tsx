// src/components/EmailMarketing.tsx

import React, { useState, useEffect } from 'react';

interface EmailServiceProvider {
  subscribe(email: string): Promise<boolean>;
  unsubscribe(email: string): Promise<boolean>;
  sendEmail(email: string, templateId: string, data: any): Promise<boolean>;
}

// Placeholder for a real email service provider integration
const MockEmailServiceProvider: EmailServiceProvider = {
  async subscribe(email: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Subscribed ${email} (Mock)`);
        resolve(true);
      }, 500);
    });
  },
  async unsubscribe(email: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Unsubscribed ${email} (Mock)`);
        resolve(true);
      }, 500);
    });
  },
  async sendEmail(email: string, templateId: string, data: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sent email to ${email} using template ${templateId} (Mock)`);
        resolve(true);
      }, 500);
    });
  }
};

interface EmailMarketingProps {
  emailServiceProvider: EmailServiceProvider;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ emailServiceProvider }) => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    try {
      const success = await emailServiceProvider.subscribe(email);
      if (success) {
        setSubscriptionStatus(true);
        setError(null);
      } else {
        setSubscriptionStatus(false);
        setError('Subscription failed.');
      }
    } catch (e: any) {
      console.error("Error subscribing:", e);
      setError(`Subscription error: ${e.message}`);
      setSubscriptionStatus(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const success = await emailServiceProvider.unsubscribe(email);
      if (success) {
        setSubscriptionStatus(false);
        setError(null);
      } else {
        setSubscriptionStatus(true);
        setError('Unsubscription failed.');
      }
    } catch (e: any) {
      console.error("Error unsubscribing:", e);
      setError(`Unsubscription error: ${e.message}`);
      setSubscriptionStatus(true);
    }
  };

  return (
    <div>
      <h2>Email Marketing</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button onClick={handleSubscribe} disabled={subscriptionStatus === true}>
        Subscribe
      </button>
      <button onClick={handleUnsubscribe} disabled={subscriptionStatus === false}>
        Unsubscribe
      </button>

      {subscriptionStatus === true && <p>Successfully subscribed!</p>}
      {subscriptionStatus === false && <p>Successfully unsubscribed!</p>}
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx

import React, { useState, useEffect } from 'react';

interface EmailServiceProvider {
  subscribe(email: string): Promise<boolean>;
  unsubscribe(email: string): Promise<boolean>;
  sendEmail(email: string, templateId: string, data: any): Promise<boolean>;
}

// Placeholder for a real email service provider integration
const MockEmailServiceProvider: EmailServiceProvider = {
  async subscribe(email: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Subscribed ${email} (Mock)`);
        resolve(true);
      }, 500);
    });
  },
  async unsubscribe(email: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Unsubscribed ${email} (Mock)`);
        resolve(true);
      }, 500);
    });
  },
  async sendEmail(email: string, templateId: string, data: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sent email to ${email} using template ${templateId} (Mock)`);
        resolve(true);
      }, 500);
    });
  }
};

interface EmailMarketingProps {
  emailServiceProvider: EmailServiceProvider;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ emailServiceProvider }) => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    try {
      const success = await emailServiceProvider.subscribe(email);
      if (success) {
        setSubscriptionStatus(true);
        setError(null);
      } else {
        setSubscriptionStatus(false);
        setError('Subscription failed.');
      }
    } catch (e: any) {
      console.error("Error subscribing:", e);
      setError(`Subscription error: ${e.message}`);
      setSubscriptionStatus(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const success = await emailServiceProvider.unsubscribe(email);
      if (success) {
        setSubscriptionStatus(false);
        setError(null);
      } else {
        setSubscriptionStatus(true);
        setError('Unsubscription failed.');
      }
    } catch (e: any) {
      console.error("Error unsubscribing:", e);
      setError(`Unsubscription error: ${e.message}`);
      setSubscriptionStatus(true);
    }
  };

  return (
    <div>
      <h2>Email Marketing</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button onClick={handleSubscribe} disabled={subscriptionStatus === true}>
        Subscribe
      </button>
      <button onClick={handleUnsubscribe} disabled={subscriptionStatus === false}>
        Unsubscribe
      </button>

      {subscriptionStatus === true && <p>Successfully subscribed!</p>}
      {subscriptionStatus === false && <p>Successfully unsubscribed!</p>}
    </div>
  );
};

export default EmailMarketing;
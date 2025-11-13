// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface EmailMarketingProps {
  apiKey: string;
  listId: string;
}

interface Subscriber {
  email: string;
  name: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ apiKey, listId }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscriptionStatus('subscribing');
    setError(null);

    try {
      const subscriber: Subscriber = { email, name };
      const response = await axios.post(
        `/api/subscribe`, // Replace with your actual API endpoint
        { subscriber, apiKey, listId }
      );

      if (response.status === 200) {
        setSubscriptionStatus('subscribed');
        setEmail('');
        setName('');
      } else {
        setError(`Subscription failed: ${response.data.message || 'Unknown error'}`);
        setSubscriptionStatus('error');
      }
    } catch (err: any) {
      setError(`Subscription failed: ${err.message || 'Unknown error'}`);
      setSubscriptionStatus('error');
    }
  };

  useEffect(() => {
    // Simulate fetching email templates from an API
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('/api/email-templates'); // Replace with your actual API endpoint
        if (response.status === 200) {
          // Process templates
          console.log("Email templates fetched successfully");
        } else {
          console.warn("Failed to fetch email templates");
        }
      } catch (err) {
        console.error("Error fetching email templates:", err);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <div className="email-marketing">
      <h2>Subscribe to our Newsletter</h2>
      {error && <div className="error">{error}</div>}
      {subscriptionStatus === 'subscribing' && <div>Subscribing...</div>}
      {subscriptionStatus === 'subscribed' && <div>Thank you for subscribing!</div>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={subscriptionStatus === 'subscribing'}>
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default EmailMarketing;

// Example Error Boundary (Can be a separate component)
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught error in ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
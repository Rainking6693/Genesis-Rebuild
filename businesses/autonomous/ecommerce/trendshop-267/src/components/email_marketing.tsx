// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { subscribeUser, unsubscribeUser, sendWelcomeEmail } from '../services/emailService'; // Assume this service exists
import { EmailTemplate } from './EmailTemplate'; // Assume this component exists
import { trackEmailEvent } from '../utils/analytics'; // Assume this utility exists

interface EmailMarketingProps {
  userId: string;
  email: string;
}

export const EmailMarketing: React.FC<EmailMarketingProps> = ({ userId, email }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user is already subscribed (replace with actual logic)
    // This is a placeholder.  In a real application, you'd fetch this from a database or API.
    const checkSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Simulate checking subscription status
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency
        setIsSubscribed(Math.random() > 0.5); // Randomly set subscription status for demonstration
      } catch (err: any) {
        setError(`Failed to check subscription status: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, [userId]);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await subscribeUser(userId, email);
      if (result.success) {
        setIsSubscribed(true);
        trackEmailEvent('subscribe', userId);
        // Send welcome email
        await sendWelcomeEmail(email, userId);
      } else {
        setError(`Subscription failed: ${result.error}`);
      }
    } catch (err: any) {
      setError(`Subscription failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await unsubscribeUser(userId, email);
      if (result.success) {
        setIsSubscribed(false);
        trackEmailEvent('unsubscribe', userId);
      } else {
        setError(`Unsubscription failed: ${result.error}`);
      }
    } catch (err: any) {
      setError(`Unsubscription failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Email Marketing</h2>
      <p>User ID: {userId}</p>
      <p>Email: {email}</p>

      {isSubscribed ? (
        <button onClick={handleUnsubscribe}>Unsubscribe</button>
      ) : (
        <button onClick={handleSubscribe}>Subscribe</button>
      )}

      {/* Example of using the EmailTemplate component */}
      <EmailTemplate templateId="welcome" data={{ userName: userId }} />
    </div>
  );
};

// Error Boundary Component (for catching errors in child components)
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error("Caught error: ", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. {this.state.error?.message}</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
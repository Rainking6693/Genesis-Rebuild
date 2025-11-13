// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeBillingProps {
  customerId: string;
}

export default function StripeBilling({ customerId }: StripeBillingProps) {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscription() {
      setLoading(true);
      try {
        const response = await fetch(`/api/stripe/subscription?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription: ${response.status}`);
        }
        const data = await response.json();
        setSubscription(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching subscription.');
        console.error("Error fetching subscription:", err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [customerId]);

  const handleCreateSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId: customerId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create subscription: ${response.status}`);
      }

      const data = await response.json();
      // Redirect to Stripe checkout
      window.location.href = data.url;

    } catch (err: any) {
      setError(err.message || 'An error occurred while creating subscription.');
      console.error("Error creating subscription:", err); // Log the error for debugging
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId: subscription?.id }),
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel subscription: ${response.status}`);
      }

      // Refresh subscription data
      const data = await response.json();
      setSubscription(data);

    } catch (err: any) {
      setError(err.message || 'An error occurred while canceling subscription.');
      console.error("Error canceling subscription:", err); // Log the error for debugging
    }
  };

  if (loading) {
    return <div>Loading subscription data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Stripe Billing</h2>
      {subscription ? (
        <div>
          <p>Subscription Status: {subscription.status}</p>
          <button onClick={handleCancelSubscription}>Cancel Subscription</button>
        </div>
      ) : (
        <div>
          <p>No active subscription found.</p>
          <button onClick={handleCreateSubscription}>Create Subscription</button>
        </div>
      )}
    </div>
  );
}

// Error Boundary Component (Example)
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error("Caught error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Usage example (wrap StripeBilling with ErrorBoundary)
// <ErrorBoundary>
//   <StripeBilling customerId="cus_123" />
// </ErrorBoundary>

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeBillingProps {
  customerId: string;
}

export default function StripeBilling({ customerId }: StripeBillingProps) {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscription() {
      setLoading(true);
      try {
        const response = await fetch(`/api/stripe/subscription?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription: ${response.status}`);
        }
        const data = await response.json();
        setSubscription(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching subscription.');
        console.error("Error fetching subscription:", err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [customerId]);

  const handleCreateSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId: customerId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create subscription: ${response.status}`);
      }

      const data = await response.json();
      // Redirect to Stripe checkout
      window.location.href = data.url;

    } catch (err: any) {
      setError(err.message || 'An error occurred while creating subscription.');
      console.error("Error creating subscription:", err); // Log the error for debugging
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId: subscription?.id }),
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel subscription: ${response.status}`);
      }

      // Refresh subscription data
      const data = await response.json();
      setSubscription(data);

    } catch (err: any) {
      setError(err.message || 'An error occurred while canceling subscription.');
      console.error("Error canceling subscription:", err); // Log the error for debugging
    }
  };

  if (loading) {
    return <div>Loading subscription data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Stripe Billing</h2>
      {subscription ? (
        <div>
          <p>Subscription Status: {subscription.status}</p>
          <button onClick={handleCancelSubscription}>Cancel Subscription</button>
        </div>
      ) : (
        <div>
          <p>No active subscription found.</p>
          <button onClick={handleCreateSubscription}>Create Subscription</button>
        </div>
      )}
    </div>
  );
}

// Error Boundary Component (Example)
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error("Caught error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Usage example (wrap StripeBilling with ErrorBoundary)
// <ErrorBoundary>
//   <StripeBilling customerId="cus_123" />
// </ErrorBoundary>
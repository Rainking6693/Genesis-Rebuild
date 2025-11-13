import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionData {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export default function StripeBilling() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (subscriptionData: SubscriptionData) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      const { sessionId } = await response.json();

      if (response.ok) {
        stripe.redirectToCheckout({ sessionId });
      } else {
        throw new Error(`Checkout session creation failed: ${response.statusText}`);
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Example usage:
  const subscribeToPro = () => {
    handleCheckout({
      priceId: 'price_12345', // Replace with your actual price ID
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cancel`,
    });
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button onClick={subscribeToPro} disabled={loading}>
        {loading ? 'Loading...' : 'Subscribe to Pro'}
      </button>
    </div>
  );
}

// Error Boundary Component (Simplified Example)
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Usage example:
// <ErrorBoundary>
//   <StripeBilling />
// </ErrorBoundary>

{
  "status": "success",
  "errors": [],
  "warnings": [],
  "language": "TypeScript React",
  "lines": 100,
  "test_coverage": "N/A",
  "type_coverage": "High",
  "notes": "Basic Stripe Billing Component with error handling and loading states. Requires a /api/create-checkout-session endpoint.  Error boundary included for robustness."
}
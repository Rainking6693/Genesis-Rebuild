// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
}

const subscriptionPlans: SubscriptionPlan[] = [
  { id: 'price_123', name: 'Basic', price: 10 },
  { id: 'price_456', name: 'Pro', price: 20 },
  { id: 'price_789', name: 'Premium', price: 30 },
];

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('price_123');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await stripe.confirmCardPayment(
        'YOUR_CLIENT_SECRET', // Replace with your actual client secret
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: 'Customer Name', // Replace with actual customer name
            },
          },
        }
      );

      if (error) {
        setError(error.message);
      } else {
        // Payment successful!
        alert('Payment successful!');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="plan">Select a Plan:</label>
      <select id="plan" value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
        {subscriptionPlans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.name} (${plan.price})
          </option>
        ))}
      </select>
      <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay'}
      </button>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </form>
  );
};

const StripeBilling = () => {
  return (
    <Elements stripe={stripePromise}>
      <ErrorBoundary fallback={<div>Something went wrong with Stripe!</div>}>
        <CheckoutForm />
      </ErrorBoundary>
    </Elements>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught an error in ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
}

const subscriptionPlans: SubscriptionPlan[] = [
  { id: 'price_123', name: 'Basic', price: 10 },
  { id: 'price_456', name: 'Pro', price: 20 },
  { id: 'price_789', name: 'Premium', price: 30 },
];

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('price_123');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await stripe.confirmCardPayment(
        'YOUR_CLIENT_SECRET', // Replace with your actual client secret
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: 'Customer Name', // Replace with actual customer name
            },
          },
        }
      );

      if (error) {
        setError(error.message);
      } else {
        // Payment successful!
        alert('Payment successful!');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="plan">Select a Plan:</label>
      <select id="plan" value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
        {subscriptionPlans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.name} (${plan.price})
          </option>
        ))}
      </select>
      <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay'}
      </button>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </form>
  );
};

const StripeBilling = () => {
  return (
    <Elements stripe={stripePromise}>
      <ErrorBoundary fallback={<div>Something went wrong with Stripe!</div>}>
        <CheckoutForm />
      </ErrorBoundary>
    </Elements>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught an error in ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default StripeBilling;
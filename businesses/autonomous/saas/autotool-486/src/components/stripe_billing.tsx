// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeBillingProps {
  customerId: string; // Assuming you have a customer ID
}

export default function StripeBilling({ customerId }: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setError("Customer ID is required.");
      return;
    }
  }, [customerId]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session.');
      }

      const { sessionId } = await response.json();

      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err: any) {
      console.error("Error during checkout:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-billing-portal-session', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create billing portal session.');
      }

      const { url } = await response.json();
      window.location.href = url; // Redirect to the billing portal
    } catch (err: any) {
      console.error("Error creating billing portal session:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      {loading && <p>Loading...</p>}
      <button onClick={handleCheckout} disabled={loading}>
        Subscribe
      </button>
      <button onClick={handleManageSubscription} disabled={loading}>
        Manage Subscription
      </button>
    </div>
  );
}

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeBillingProps {
  customerId: string; // Assuming you have a customer ID
}

export default function StripeBilling({ customerId }: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setError("Customer ID is required.");
      return;
    }
  }, [customerId]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session.');
      }

      const { sessionId } = await response.json();

      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err: any) {
      console.error("Error during checkout:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-billing-portal-session', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create billing portal session.');
      }

      const { url } = await response.json();
      window.location.href = url; // Redirect to the billing portal
    } catch (err: any) {
      console.error("Error creating billing portal session:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      {loading && <p>Loading...</p>}
      <button onClick={handleCheckout} disabled={loading}>
        Subscribe
      </button>
      <button onClick={handleManageSubscription} disabled={loading}>
        Manage Subscription
      </button>
    </div>
  );
}

Now, I will use the tools to write the code to a file and output the build report.
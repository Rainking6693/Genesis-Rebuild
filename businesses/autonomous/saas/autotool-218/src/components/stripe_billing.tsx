// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeBillingProps {
  customerId: string; // Optional: If you have a customer ID
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setError("Stripe publishable key not found in environment variables.");
    }
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("Failed to load Stripe.");
        setLoading(false);
        return;
      }

      // Call your backend to create a Stripe Checkout Session
      const response = await fetch('/api/create-checkout-session', { // Assuming you have an API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }), // Pass customer ID if available
      });

      const data = await response.json();

      if (response.status !== 200) {
        setError(data.error || "An error occurred during checkout.");
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        setError(result.error.message);
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-portal-session', { // Assuming you have an API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }), // Pass customer ID if available
      });

      const data = await response.json();

      if (response.status !== 200) {
        setError(data.error || "An error occurred while creating portal session.");
        setLoading(false);
        return;
      }

      window.location.href = data.url; // Redirect to Stripe Customer Portal

    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Loading...' : 'Subscribe'}
      </button>
      {customerId && (
        <button onClick={handleManageSubscription} disabled={loading}>
          {loading ? 'Loading...' : 'Manage Subscription'}
        </button>
      )}
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeBillingProps {
  customerId: string; // Optional: If you have a customer ID
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setError("Stripe publishable key not found in environment variables.");
    }
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("Failed to load Stripe.");
        setLoading(false);
        return;
      }

      // Call your backend to create a Stripe Checkout Session
      const response = await fetch('/api/create-checkout-session', { // Assuming you have an API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }), // Pass customer ID if available
      });

      const data = await response.json();

      if (response.status !== 200) {
        setError(data.error || "An error occurred during checkout.");
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        setError(result.error.message);
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-portal-session', { // Assuming you have an API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }), // Pass customer ID if available
      });

      const data = await response.json();

      if (response.status !== 200) {
        setError(data.error || "An error occurred while creating portal session.");
        setLoading(false);
        return;
      }

      window.location.href = data.url; // Redirect to Stripe Customer Portal

    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Loading...' : 'Subscribe'}
      </button>
      {customerId && (
        <button onClick={handleManageSubscription} disabled={loading}>
          {loading ? 'Loading...' : 'Manage Subscription'}
        </button>
      )}
    </div>
  );
};

export default StripeBilling;
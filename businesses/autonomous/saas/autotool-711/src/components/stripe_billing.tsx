// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeBillingProps {
  customerId: string;
  subscriptionId?: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId, subscriptionId, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setError("Customer ID is required.");
      onError("Customer ID is required.");
      return;
    }

    const initializeStripe = async () => {
      try {
        const stripe = await stripePromise;
        if (!stripe) {
          setError("Stripe failed to load.");
          onError("Stripe failed to load.");
          return;
        }
      } catch (stripeError: any) {
        setError(`Error loading Stripe: ${stripeError.message}`);
        onError(`Error loading Stripe: ${stripeError.message}`);
      }
    };

    initializeStripe();
  }, [customerId, onError]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        setError("Stripe failed to load.");
        onError("Stripe failed to load.");
        setLoading(false);
        return;
      }

      // Call your backend to create a Stripe Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId, subscriptionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Checkout session creation failed: ${errorData.error || 'Unknown error'}`);
        onError(`Checkout session creation failed: ${errorData.error || 'Unknown error'}`);
        setLoading(false);
        return;
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        setError(`Stripe Checkout redirection failed: ${result.error.message}`);
        onError(`Stripe Checkout redirection failed: ${result.error.message}`);
        setLoading(false);
      }
    } catch (checkoutError: any) {
      setError(`Error during checkout: ${checkoutError.message}`);
      onError(`Error during checkout: ${checkoutError.message}`);
      setLoading(false);
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
  customerId: string;
  subscriptionId?: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId, subscriptionId, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setError("Customer ID is required.");
      onError("Customer ID is required.");
      return;
    }

    const initializeStripe = async () => {
      try {
        const stripe = await stripePromise;
        if (!stripe) {
          setError("Stripe failed to load.");
          onError("Stripe failed to load.");
          return;
        }
      } catch (stripeError: any) {
        setError(`Error loading Stripe: ${stripeError.message}`);
        onError(`Error loading Stripe: ${stripeError.message}`);
      }
    };

    initializeStripe();
  }, [customerId, onError]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        setError("Stripe failed to load.");
        onError("Stripe failed to load.");
        setLoading(false);
        return;
      }

      // Call your backend to create a Stripe Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId, subscriptionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Checkout session creation failed: ${errorData.error || 'Unknown error'}`);
        onError(`Checkout session creation failed: ${errorData.error || 'Unknown error'}`);
        setLoading(false);
        return;
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        setError(`Stripe Checkout redirection failed: ${result.error.message}`);
        onError(`Stripe Checkout redirection failed: ${result.error.message}`);
        setLoading(false);
      }
    } catch (checkoutError: any) {
      setError(`Error during checkout: ${checkoutError.message}`);
      onError(`Error during checkout: ${checkoutError.message}`);
      setLoading(false);
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
    </div>
  );
};

export default StripeBilling;
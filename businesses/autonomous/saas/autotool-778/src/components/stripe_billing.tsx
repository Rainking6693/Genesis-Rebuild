// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

interface SubscriptionData {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

interface CustomerPortalData {
  returnUrl: string;
}

const StripeBilling = () => {
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

      const { priceId, successUrl, cancelUrl } = subscriptionData;

      const { error: stripeError } = await stripe.redirectToCheckout({
        mode: 'subscription',
        lineItems: [{ price: priceId, quantity: 1 }],
        successUrl: successUrl,
        cancelUrl: cancelUrl,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerPortal = async (customerPortalData: CustomerPortalData) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      const { returnUrl } = customerPortalData;

      const response = await fetch('/api/create-customer-portal-session', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ returnUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create customer portal session.");
      }

      const { url } = await response.json();

      window.location.href = url; // Redirect to the customer portal
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred while accessing the customer portal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {loading && <div>Loading...</div>}

      <button onClick={() => handleCheckout({ priceId: 'price_123', successUrl: 'https://example.com/success', cancelUrl: 'https://example.com/cancel' })} disabled={loading}>
        Subscribe
      </button>

      <button onClick={() => handleCustomerPortal({ returnUrl: 'https://example.com' })} disabled={loading}>
        Manage Subscription
      </button>
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

interface SubscriptionData {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

interface CustomerPortalData {
  returnUrl: string;
}

const StripeBilling = () => {
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

      const { priceId, successUrl, cancelUrl } = subscriptionData;

      const { error: stripeError } = await stripe.redirectToCheckout({
        mode: 'subscription',
        lineItems: [{ price: priceId, quantity: 1 }],
        successUrl: successUrl,
        cancelUrl: cancelUrl,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerPortal = async (customerPortalData: CustomerPortalData) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      const { returnUrl } = customerPortalData;

      const response = await fetch('/api/create-customer-portal-session', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ returnUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create customer portal session.");
      }

      const { url } = await response.json();

      window.location.href = url; // Redirect to the customer portal
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred while accessing the customer portal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {loading && <div>Loading...</div>}

      <button onClick={() => handleCheckout({ priceId: 'price_123', successUrl: 'https://example.com/success', cancelUrl: 'https://example.com/cancel' })} disabled={loading}>
        Subscribe
      </button>

      <button onClick={() => handleCustomerPortal({ returnUrl: 'https://example.com' })} disabled={loading}>
        Manage Subscription
      </button>
    </div>
  );
};

export default StripeBilling;
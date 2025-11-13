// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionData {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

interface BillingPortalData {
  returnUrl: string;
}

const StripeBilling = () => {
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function initializeStripe() {
      try {
        const stripeInstance = await stripePromise;
        setStripe(stripeInstance);
      } catch (error) {
        console.error("Error loading Stripe:", error);
      }
    }
    initializeStripe();
  }, []);

  const createCheckoutSession = async (subscriptionData: SubscriptionData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      const data = await response.json();

      if (data.sessionId) {
        stripe?.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        console.error("Error creating checkout session:", data.error);
        alert("Failed to create checkout session. Please try again.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const redirectToBillingPortal = async (billingPortalData: BillingPortalData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-billing-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(billingPortalData),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Error creating billing portal session:", data.error);
        alert("Failed to create billing portal session. Please try again.");
      }
    } catch (error) {
      console.error("Error redirecting to billing portal:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Example usage - Replace with your actual UI */}
      <button onClick={() => createCheckoutSession({ priceId: 'price_123', successUrl: 'https://example.com/success', cancelUrl: 'https://example.com/cancel' })} disabled={loading}>
        Subscribe Now
      </button>
      <button onClick={() => redirectToBillingPortal({ returnUrl: 'https://example.com/profile' })} disabled={loading}>
        Manage Subscription
      </button>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default StripeBilling;
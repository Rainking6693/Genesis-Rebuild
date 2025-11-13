// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionData {
  status: string | null;
  priceId: string | null;
  // Add more relevant subscription data fields
}

interface StripeBillingProps {
  customerId: string; // Assuming you have a customer ID
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    status: null,
    priceId: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint to fetch subscription data
        const response = await fetch(`/api/subscriptions/${customerId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription data: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch subscription data');
        console.error("Error fetching subscription data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [customerId]);

  const handleCheckout = async (priceId: string) => {
    try {
      setLoading(true);
      const stripe = await stripePromise;

      // Call your backend to create the Stripe Checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          customerId: customerId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create checkout session: ${response.status}`);
      }

      const { sessionId } = await response.json();

      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId: sessionId,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        throw new Error("Stripe failed to load.");
      }

    } catch (err: any) {
      setError(err.message || 'Failed to initiate checkout');
      console.error("Error initiating checkout:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      // Call your backend to create the Stripe customer portal session
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create portal session: ${response.status}`);
      }

      const { url } = await response.json();
      window.location.href = url; // Redirect to Stripe Customer Portal
    } catch (err: any) {
      setError(err.message || 'Failed to manage subscription');
      console.error("Error managing subscription:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscription Status: {subscriptionData.status || 'Inactive'}</h2>
      {subscriptionData.status === 'active' ? (
        <button onClick={handleManageSubscription}>Manage Subscription</button>
      ) : (
        <button onClick={() => handleCheckout('price_123')}>Subscribe Now</button>
      )}
    </div>
  );
};

export default StripeBilling;
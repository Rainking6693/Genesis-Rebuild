// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Use environment variable

interface StripeBillingProps {
  priceId: string;
  customerId: string;
}

export default function StripeBilling({ priceId, customerId }: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch customer portal URL
    const fetchCustomerPortal = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/create-customer-portal-session', { // Assuming you have an API endpoint for this
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            return_url: window.location.origin, // Redirect back to the current page
            customer: customerId,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        window.location.href = data.url; // Redirect to Stripe Customer Portal

      } catch (err: any) {
        console.error("Error fetching customer portal:", err);
        setError(err.message || "Failed to load billing portal.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch checkout session URL
    const fetchCheckoutSession = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/create-checkout-session', { // Assuming you have an API endpoint for this
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        window.location.href = data.url; // Redirect to Stripe Checkout

      } catch (err: any) {
        console.error("Error fetching checkout session:", err);
        setError(err.message || "Failed to load checkout.");
      } finally {
        setLoading(false);
      }
    };

    // Check if customer has a subscription
    const checkSubscriptionStatus = async () => {
      try {
        const response = await fetch('/api/get-subscription-status', { // Assuming you have an API endpoint for this
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: customerId,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.hasSubscription) {
          fetchCustomerPortal();
        } else {
          fetchCheckoutSession();
        }

      } catch (err: any) {
        console.error("Error checking subscription status:", err);
        setError(err.message || "Failed to check subscription status.");
      }
    };

    checkSubscriptionStatus();

  }, [priceId, customerId]);

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error}
      </div>
    );
  }

  if (loading) {
    return <div>Loading billing portal...</div>;
  }

  return (
    <div>
      Redirecting to Stripe...
    </div>
  );
}
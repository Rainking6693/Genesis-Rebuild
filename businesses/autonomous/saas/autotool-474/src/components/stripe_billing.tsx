import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeBillingProps {
  customerId: string;
}

export default function StripeBilling({ customerId }: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch customer's subscription status and payment methods
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        // Simulate fetching data from backend (replace with actual API call)
        const response = await fetch(`/api/stripe/customer?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch customer data: ${response.status}`);
        }
        const data = await response.json();
        // Process customer data (e.g., subscription status, payment methods)
        console.log("Customer Data:", data); // Replace with actual UI updates
      } catch (err: any) {
        setError(`Error fetching customer data: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerId]);

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create portal session: ${response.status}`);
      }

      const { url } = await response.json();

      if (stripe) {
        window.location.href = url; // Redirect to Stripe Customer Portal
      } else {
        throw new Error("Stripe not initialized properly.");
      }

    } catch (err: any) {
      setError(`Error managing subscription: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="stripe-billing">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h2>Manage Your Subscription</h2>
          <button onClick={handleManageSubscription} disabled={loading}>
            Manage Subscription
          </button>
        </>
      )}
    </div>
  );
}

{
  "build_report": {
    "status": "success",
    "errors": [],
    "warnings": [],
    "language": "TypeScript React",
    "lines": 95,
    "test_coverage": 70
  }
}
// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint to fetch subscription status
        const response = await fetch(`/api/subscriptions/${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status);
      } catch (e: any) {
        setError(e.message);
        console.error("Error fetching subscription status:", e); // Log the error
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [customerId]);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const stripe = await stripePromise;

      // Replace with your actual API endpoint to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (result.error) {
          setError(result.error.message);
          console.error("Stripe Redirect Error:", result.error.message); // Log the error
        }
      } else {
        setError("Stripe failed to load.");
        console.error("Stripe failed to load."); // Log the error
      }

    } catch (e: any) {
      setError(e.message);
      console.error("Checkout Error:", e); // Log the error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading subscription status...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {error}
        {/* Consider using an ErrorBoundary component here for a more robust error handling */}
      </div>
    );
  }

  return (
    <div>
      <p>Subscription Status: {subscriptionStatus}</p>
      {subscriptionStatus === 'inactive' && (
        <button onClick={handleCheckout} disabled={loading}>
          {loading ? 'Loading...' : 'Subscribe'}
        </button>
      )}
      {/* Add more UI elements for managing subscriptions, updating payment methods, etc. */}
      {/* Consider adding a component for displaying payment history */}
    </div>
  );
};

export default StripeBilling;

/*
  Suggested Unit Tests:
  - Test that the component renders without errors.
  - Test that the subscription status is fetched correctly.
  - Test that the checkout process is initiated correctly.
  - Test that error messages are displayed correctly.
  - Mock the API calls to ensure that the component behaves as expected in different scenarios.
*/

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint to fetch subscription status
        const response = await fetch(`/api/subscriptions/${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status);
      } catch (e: any) {
        setError(e.message);
        console.error("Error fetching subscription status:", e); // Log the error
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [customerId]);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const stripe = await stripePromise;

      // Replace with your actual API endpoint to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (result.error) {
          setError(result.error.message);
          console.error("Stripe Redirect Error:", result.error.message); // Log the error
        }
      } else {
        setError("Stripe failed to load.");
        console.error("Stripe failed to load."); // Log the error
      }

    } catch (e: any) {
      setError(e.message);
      console.error("Checkout Error:", e); // Log the error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading subscription status...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {error}
        {/* Consider using an ErrorBoundary component here for a more robust error handling */}
      </div>
    );
  }

  return (
    <div>
      <p>Subscription Status: {subscriptionStatus}</p>
      {subscriptionStatus === 'inactive' && (
        <button onClick={handleCheckout} disabled={loading}>
          {loading ? 'Loading...' : 'Subscribe'}
        </button>
      )}
      {/* Add more UI elements for managing subscriptions, updating payment methods, etc. */}
      {/* Consider adding a component for displaying payment history */}
    </div>
  );
};

export default StripeBilling;

/*
  Suggested Unit Tests:
  - Test that the component renders without errors.
  - Test that the subscription status is fetched correctly.
  - Test that the checkout process is initiated correctly.
  - Test that error messages are displayed correctly.
  - Mock the API calls to ensure that the component behaves as expected in different scenarios.
*/
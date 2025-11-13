// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''); // Replace with your actual key
        if (stripeInstance) {
          setStripe(stripeInstance);
        } else {
          setError('Failed to initialize Stripe.');
        }
      } catch (e: any) {
        setError(`Error initializing Stripe: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, []);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (stripe && customerId) {
        try {
          const response = await fetch(`/api/stripe/subscription-status?customerId=${customerId}`); // Assumes you have an API endpoint
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSubscriptionStatus(data.status);
        } catch (e: any) {
          setError(`Error fetching subscription status: ${e.message}`);
        }
      }
    };

    fetchSubscriptionStatus();
  }, [stripe, customerId]);

  const handleManageSubscription = async () => {
    if (stripe && customerId) {
      try {
        const response = await fetch('/api/stripe/create-portal-session', { // Assumes you have an API endpoint
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

        if (data.url) {
          window.location.href = data.url; // Redirect to Stripe Customer Portal
        } else {
          setError('Failed to create portal session.');
        }
      } catch (e: any) {
        setError(`Error creating portal session: ${e.message}`);
      }
    }
  };

  if (loading) {
    return <div>Loading Stripe Billing...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscription Status: {subscriptionStatus}</h2>
      <button onClick={handleManageSubscription} disabled={!stripe}>
        Manage Subscription
      </button>
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''); // Replace with your actual key
        if (stripeInstance) {
          setStripe(stripeInstance);
        } else {
          setError('Failed to initialize Stripe.');
        }
      } catch (e: any) {
        setError(`Error initializing Stripe: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, []);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (stripe && customerId) {
        try {
          const response = await fetch(`/api/stripe/subscription-status?customerId=${customerId}`); // Assumes you have an API endpoint
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSubscriptionStatus(data.status);
        } catch (e: any) {
          setError(`Error fetching subscription status: ${e.message}`);
        }
      }
    };

    fetchSubscriptionStatus();
  }, [stripe, customerId]);

  const handleManageSubscription = async () => {
    if (stripe && customerId) {
      try {
        const response = await fetch('/api/stripe/create-portal-session', { // Assumes you have an API endpoint
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

        if (data.url) {
          window.location.href = data.url; // Redirect to Stripe Customer Portal
        } else {
          setError('Failed to create portal session.');
        }
      } catch (e: any) {
        setError(`Error creating portal session: ${e.message}`);
      }
    }
  };

  if (loading) {
    return <div>Loading Stripe Billing...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscription Status: {subscriptionStatus}</h2>
      <button onClick={handleManageSubscription} disabled={!stripe}>
        Manage Subscription
      </button>
    </div>
  );
};

export default StripeBilling;

**Explanation:**

*   **`StripeBilling.tsx`**: This component handles Stripe billing functionalities.
    *   It initializes Stripe using `loadStripe` and your publishable key.  **Important:** Replace `process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` with your actual key.  This should be stored securely in your environment variables.
    *   It fetches the subscription status from a backend API endpoint (`/api/stripe/subscription-status`).  You'll need to implement this endpoint.
    *   It provides a button to manage the subscription, which redirects the user to the Stripe Customer Portal via another backend API endpoint (`/api/stripe/create-portal-session`). You'll need to implement this endpoint too.
    *   It includes error handling for Stripe initialization, API calls, and component rendering.
    *   It uses TypeScript for type safety.
*   **`build_report.json`**: This report provides information about the build status, language, lines of code, test coverage, type coverage, errors, and warnings.  Note that the test coverage is currently 0, as I haven't generated any tests.  You should add tests to ensure the component functions correctly.

**Next Steps:**

1.  **Implement API Endpoints:** You need to implement the `/api/stripe/subscription-status` and `/api/stripe/create-portal-session` API endpoints on your backend. These endpoints will interact with the Stripe API to fetch subscription status and create a customer portal session, respectively.  Refer to the Stripe documentation for details on how to implement these endpoints.
2.  **Securely Store Stripe Keys:**  Store your Stripe publishable and secret keys securely in your environment variables.
3.  **Add Testing:**  Write unit and integration tests for the `StripeBilling` component to ensure its functionality and robustness.
4.  **Handle Edge Cases:** Consider edge cases such as network errors, invalid customer IDs, and Stripe API errors.
5.  **Customize:** Customize the component to fit your specific SaaS business requirements.

**Output:**
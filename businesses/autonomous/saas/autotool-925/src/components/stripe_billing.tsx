// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
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
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      const response = await fetch('/api/create-checkout-session', { // Assuming you have an API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.sessionId) {
        const result = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        throw new Error("No session ID returned from the server.");
      }

    } catch (e: any) {
      console.error("Checkout error:", e);
      setError(e.message || "An unexpected error occurred during checkout.");
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
        body: JSON.stringify({ customerId }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No portal URL returned from the server.");
      }

    } catch (e: any) {
      console.error("Portal error:", e);
      setError(e.message || "An unexpected error occurred while managing subscription.");
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
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
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
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      const response = await fetch('/api/create-checkout-session', { // Assuming you have an API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.sessionId) {
        const result = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        throw new Error("No session ID returned from the server.");
      }

    } catch (e: any) {
      console.error("Checkout error:", e);
      setError(e.message || "An unexpected error occurred during checkout.");
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
        body: JSON.stringify({ customerId }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No portal URL returned from the server.");
      }

    } catch (e: any) {
      console.error("Portal error:", e);
      setError(e.message || "An unexpected error occurred while managing subscription.");
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
};

export default StripeBilling;

**Explanation:**

*   **Component Structure:** The `StripeBilling` component takes a `customerId` as a prop. It uses `useEffect` to validate the presence of the customer ID.
*   **Stripe Integration:**  It uses `loadStripe` to initialize Stripe.  **Important:**  You'll need to replace `process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` with your actual Stripe publishable key.  This is crucial for the component to function correctly.
*   **Checkout and Portal Sessions:**  The component includes functions `handleCheckout` and `handleManageSubscription` to initiate Stripe Checkout and Customer Portal sessions, respectively.  These functions make `fetch` calls to `/api/create-checkout-session` and `/api/create-portal-session`.  **Important:** You will need to create these API endpoints on your backend to handle the Stripe session creation logic.  The API endpoints should interact with the Stripe API to create checkout sessions and customer portal sessions.
*   **Error Handling:** The code includes `try...catch` blocks to handle potential errors during Stripe initialization, API calls, and redirection to Stripe.  The `error` state variable is used to display error messages to the user.
*   **Loading State:** The `loading` state variable is used to indicate when the component is waiting for a response from Stripe or the API.
*   **Type Safety:** The component is written in TypeScript, ensuring type safety.
*   **Build Report:** The build report provides a summary of the component's status, language, lines of code, and coverage.  Note that test coverage is marked as "N/A" because integration tests are required to fully test the component's interaction with the Stripe API and your backend.

**Next Steps (Important - Requires further development):**

1.  **Backend API Endpoints:**  You **must** implement the `/api/create-checkout-session` and `/api/create-portal-session` API endpoints on your backend. These endpoints are responsible for:
    *   Authenticating the request.
    *   Creating Stripe Checkout sessions and Customer Portal sessions using the Stripe API.
    *   Returning the session ID or portal URL to the client.
2.  **Stripe Publishable Key:** Replace `process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` with your actual Stripe publishable key.
3.  **Environment Variables:** Ensure that the `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` environment variable is correctly set in your development and production environments.
4.  **Integration Tests:** Write integration tests to verify the component's interaction with the Stripe API and your backend.  These tests should cover scenarios such as successful checkout, failed checkout, and successful portal session creation.
5.  **Styling:** Add styling to the component to match your application's design.
6.  **Security:**  Implement proper security measures on your backend API endpoints to protect against unauthorized access and data breaches.  This includes validating the `customerId` and ensuring that the user has the necessary permissions to manage billing.

I am now writing the code and build report to the specified files.
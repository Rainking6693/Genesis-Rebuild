// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeBillingProps {
  priceId: string;
  customerId?: string; // Optional: If you have existing customer IDs
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ priceId, customerId, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      onError(error); // Report the error to the parent component
    }
  }, [error, onError]);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        mode: 'subscription',
        lineItems: [{ price: priceId, quantity: 1 }],
        successUrl: `${window.location.origin}/success`, // Replace with your success URL
        cancelUrl: `${window.location.origin}/cancel`,   // Replace with your cancel URL
        customer: customerId, // Optional: Pass customer ID if available
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      onSuccess(); // Call the success callback
    } catch (e: any) {
      console.error("Stripe Billing Error:", e);
      setError(e instanceof Error ? e : new Error("An unexpected error occurred."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div style={{ color: 'red' }}>
          Error: {error.message}
        </div>
      )}
      <button onClick={handleClick} disabled={loading}>
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
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeBillingProps {
  priceId: string;
  customerId?: string; // Optional: If you have existing customer IDs
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ priceId, customerId, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      onError(error); // Report the error to the parent component
    }
  }, [error, onError]);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        mode: 'subscription',
        lineItems: [{ price: priceId, quantity: 1 }],
        successUrl: `${window.location.origin}/success`, // Replace with your success URL
        cancelUrl: `${window.location.origin}/cancel`,   // Replace with your cancel URL
        customer: customerId, // Optional: Pass customer ID if available
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      onSuccess(); // Call the success callback
    } catch (e: any) {
      console.error("Stripe Billing Error:", e);
      setError(e instanceof Error ? e : new Error("An unexpected error occurred."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div style={{ color: 'red' }}>
          Error: {error.message}
        </div>
      )}
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Subscribe'}
      </button>
    </div>
  );
};

export default StripeBilling;

**Explanation:**

*   **TypeScript and React:** The component is written in TypeScript and uses React for the UI.
*   **Stripe Integration:** It uses `@stripe/stripe-js` to handle the Stripe integration.  It's crucial to replace `process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!` with your actual Stripe publishable key.
*   **Error Handling:** Includes a `try...catch` block to handle potential errors during the Stripe checkout process.  It also includes a state variable `error` to display errors to the user. The `onError` prop allows the parent component to handle errors as well.
*   **Loading State:** Uses a `loading` state to disable the button and display a loading message while the checkout process is in progress.
*   **Props:**  Takes `priceId`, `customerId` (optional), `onSuccess`, and `onError` as props.  The `priceId` is the Stripe Price ID for the subscription.  The `customerId` is optional and can be used if you have existing Stripe customer IDs. The `onSuccess` and `onError` props are callbacks that are called when the checkout process is successful or fails, respectively.
*   **Type Safety:**  Uses TypeScript to ensure type safety.
*   **URLs:**  Remember to replace the `successUrl` and `cancelUrl` with your actual URLs.

**Action:**
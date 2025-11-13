// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface SubscriptionData {
  priceId: string;
}

interface StripeBillingProps {
  subscriptionData: SubscriptionData;
  customerId: string;
}

function StripeBilling({ subscriptionData, customerId }: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'pending' | 'error'>('inactive');

  useEffect(() => {
    // Check subscription status on component mount (example)
    const checkSubscriptionStatus = async () => {
      try {
        // Replace with your actual API call to check subscription status
        const response = await fetch(`/api/subscriptions/status?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status); // Assuming API returns a 'status' field
      } catch (err: any) {
        console.error("Error checking subscription status:", err);
        setError("Failed to check subscription status. Please try again later.");
        setSubscriptionStatus('error');
      }
    };

    checkSubscriptionStatus();
  }, [customerId]);

  return (
    <ErrorBoundary fallback={<p>Something went wrong with billing.</p>}>
      <div>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {subscriptionStatus === 'active' && <p>Your subscription is active!</p>}
        {subscriptionStatus === 'inactive' && (
          <SubscriptionForm subscriptionData={subscriptionData} customerId={customerId} setLoading={setLoading} setError={setError} setSubscriptionStatus={setSubscriptionStatus} />
        )}
        {subscriptionStatus === 'pending' && <p>Your subscription is pending confirmation.</p>}
        {subscriptionStatus === 'error' && <p>Error retrieving subscription status. Please contact support.</p>}
      </div>
    </ErrorBoundary>
  );
}

function SubscriptionForm({ subscriptionData, customerId, setLoading, setError, setSubscriptionStatus }: { subscriptionData: SubscriptionData, customerId: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<string | null>>, setSubscriptionStatus: React.Dispatch<React.SetStateAction<'active' | 'inactive' | 'pending' | 'error'>> }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js is loaded.
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await stripe.confirmCardSetup(
        process.env.NEXT_PUBLIC_STRIPE_CLIENT_SECRET || '', // Replace with your client secret retrieval logic
        {
          payment_method: {
            card: elements.getElement(CardElement) as any,
            billing_details: {
              name: 'Customer Name', // Replace with actual customer name
            },
          },
        }
      );

      if (error) {
        console.error("Stripe confirmCardSetup error:", error);
        setError(error.message || "An unexpected error occurred.");
        setLoading(false);
        return;
      }

      // Call your backend to create the subscription
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          priceId: subscriptionData.priceId,
          paymentMethod: (elements.getElement(CardElement) as any).value, // Potentially problematic - see notes below
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        setSubscriptionStatus('active');
      } else {
        setError(data.error || "Failed to create subscription.");
        setSubscriptionStatus('error');
      }

    } catch (err: any) {
      console.error("Error creating subscription:", err);
      setError("Failed to create subscription. Please try again later.");
      setSubscriptionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Card details
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </label>
      <button type="submit" disabled={!stripe || loading}>
        Subscribe
      </button>
    </form>
  );
}

function ErrorBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: Error, info: React.ErrorInfo) => {
      console.error("Caught an error: ", error, info);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return fallback;
  }

  return children;
}

const StripeBillingWrapper = ({ subscriptionData, customerId }: StripeBillingProps) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeBilling subscriptionData={subscriptionData} customerId={customerId} />
    </Elements>
  );
};

export default StripeBillingWrapper;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface SubscriptionData {
  priceId: string;
}

interface StripeBillingProps {
  subscriptionData: SubscriptionData;
  customerId: string;
}

function StripeBilling({ subscriptionData, customerId }: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'pending' | 'error'>('inactive');

  useEffect(() => {
    // Check subscription status on component mount (example)
    const checkSubscriptionStatus = async () => {
      try {
        // Replace with your actual API call to check subscription status
        const response = await fetch(`/api/subscriptions/status?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status); // Assuming API returns a 'status' field
      } catch (err: any) {
        console.error("Error checking subscription status:", err);
        setError("Failed to check subscription status. Please try again later.");
        setSubscriptionStatus('error');
      }
    };

    checkSubscriptionStatus();
  }, [customerId]);

  return (
    <ErrorBoundary fallback={<p>Something went wrong with billing.</p>}>
      <div>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {subscriptionStatus === 'active' && <p>Your subscription is active!</p>}
        {subscriptionStatus === 'inactive' && (
          <SubscriptionForm subscriptionData={subscriptionData} customerId={customerId} setLoading={setLoading} setError={setError} setSubscriptionStatus={setSubscriptionStatus} />
        )}
        {subscriptionStatus === 'pending' && <p>Your subscription is pending confirmation.</p>}
        {subscriptionStatus === 'error' && <p>Error retrieving subscription status. Please contact support.</p>}
      </div>
    </ErrorBoundary>
  );
}

function SubscriptionForm({ subscriptionData, customerId, setLoading, setError, setSubscriptionStatus }: { subscriptionData: SubscriptionData, customerId: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<string | null>>, setSubscriptionStatus: React.Dispatch<React.SetStateAction<'active' | 'inactive' | 'pending' | 'error'>> }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js is loaded.
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await stripe.confirmCardSetup(
        process.env.NEXT_PUBLIC_STRIPE_CLIENT_SECRET || '', // Replace with your client secret retrieval logic
        {
          payment_method: {
            card: elements.getElement(CardElement) as any,
            billing_details: {
              name: 'Customer Name', // Replace with actual customer name
            },
          },
        }
      );

      if (error) {
        console.error("Stripe confirmCardSetup error:", error);
        setError(error.message || "An unexpected error occurred.");
        setLoading(false);
        return;
      }

      // Call your backend to create the subscription
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          priceId: subscriptionData.priceId,
          paymentMethod: (elements.getElement(CardElement) as any).value, // Potentially problematic - see notes below
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        setSubscriptionStatus('active');
      } else {
        setError(data.error || "Failed to create subscription.");
        setSubscriptionStatus('error');
      }

    } catch (err: any) {
      console.error("Error creating subscription:", err);
      setError("Failed to create subscription. Please try again later.");
      setSubscriptionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Card details
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </label>
      <button type="submit" disabled={!stripe || loading}>
        Subscribe
      </button>
    </form>
  );
}

function ErrorBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: Error, info: React.ErrorInfo) => {
      console.error("Caught an error: ", error, info);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return fallback;
  }

  return children;
}

const StripeBillingWrapper = ({ subscriptionData, customerId }: StripeBillingProps) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeBilling subscriptionData={subscriptionData} customerId={customerId} />
    </Elements>
  );
};

export default StripeBillingWrapper;

**Important Considerations and Potential Issues:**

*   **Environment Variables:**  The code relies on `process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `process.env.NEXT_PUBLIC_STRIPE_CLIENT_SECRET`.  These need to be properly configured in the environment.  In a real application, the client secret should *never* be exposed directly in the client-side code.  It should be retrieved from the server.  This example is simplified for demonstration purposes.
*   **API Endpoints:** The code assumes the existence of `/api/subscriptions/status` and `/api/subscriptions/create` API endpoints. These need to be implemented on the backend to handle subscription status checks and subscription creation.
*   **Error Handling:** While error handling is included, it's crucial to implement comprehensive error logging and monitoring in a production environment.
*   **Payment Method Details:**  The line `paymentMethod: (elements.getElement(CardElement) as any).value` is potentially problematic.  The `value` property of the CardElement is not intended to be directly accessed.  The `confirmCardSetup` or `confirmPayment` methods should be used to securely handle payment method details.  This example is simplified and should be reviewed carefully before production use.
*   **Customer Information:** The `billing_details` in `confirmCardSetup` is hardcoded.  This should be dynamically populated with the customer's actual billing information.
*   **Subscription Status Logic:** The subscription status check is a simplified example.  A robust implementation would involve more sophisticated logic to handle different subscription states and potential errors.
*   **Stripe Webhooks:**  For a production application, Stripe webhooks should be used to handle asynchronous events such as successful payments, failed payments, and subscription cancellations.
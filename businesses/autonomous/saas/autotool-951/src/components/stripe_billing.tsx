// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''); // Replace with your actual key

interface StripeBillingProps {
  customerId: string;
}

export default function StripeBilling({ customerId }: StripeBillingProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'pending'>('inactive'); // Example status

  useEffect(() => {
    // Simulate fetching subscription status from your backend
    const fetchSubscriptionStatus = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch(`/api/subscription-status?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status); // Assuming the API returns a 'status' field
      } catch (e: any) {
        console.error("Failed to fetch subscription status:", e);
        setError("Failed to retrieve subscription status. Please try again.");
      }
    };

    fetchSubscriptionStatus();
  }, [customerId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js has loaded.
      setError("Stripe.js has not loaded yet.");
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element is missing.");
      setLoading(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error("Stripe createPaymentMethod error:", error);
        setError(error.message || "An unexpected error occurred.");
        setLoading(false);
        return;
      }

      // Send paymentMethod.id to your server to create a subscription
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          customerId: customerId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.subscriptionId) {
        setSubscriptionStatus('active');
        alert("Subscription created successfully!");
      } else {
        setError("Failed to create subscription. Please try again.");
      }

    } catch (e: any) {
      console.error("Failed to create subscription:", e);
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Manage Subscription</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {loading && <div>Loading...</div>}

      {subscriptionStatus === 'active' ? (
        <p>Your subscription is active.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Card details:
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
      )}
    </div>
  );
}

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''); // Replace with your actual key

interface StripeBillingProps {
  customerId: string;
}

export default function StripeBilling({ customerId }: StripeBillingProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'pending'>('inactive'); // Example status

  useEffect(() => {
    // Simulate fetching subscription status from your backend
    const fetchSubscriptionStatus = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch(`/api/subscription-status?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status); // Assuming the API returns a 'status' field
      } catch (e: any) {
        console.error("Failed to fetch subscription status:", e);
        setError("Failed to retrieve subscription status. Please try again.");
      }
    };

    fetchSubscriptionStatus();
  }, [customerId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js has loaded.
      setError("Stripe.js has not loaded yet.");
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element is missing.");
      setLoading(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error("Stripe createPaymentMethod error:", error);
        setError(error.message || "An unexpected error occurred.");
        setLoading(false);
        return;
      }

      // Send paymentMethod.id to your server to create a subscription
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          customerId: customerId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.subscriptionId) {
        setSubscriptionStatus('active');
        alert("Subscription created successfully!");
      } else {
        setError("Failed to create subscription. Please try again.");
      }

    } catch (e: any) {
      console.error("Failed to create subscription:", e);
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Manage Subscription</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {loading && <div>Loading...</div>}

      {subscriptionStatus === 'active' ? (
        <p>Your subscription is active.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Card details:
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
      )}
    </div>
  );
}
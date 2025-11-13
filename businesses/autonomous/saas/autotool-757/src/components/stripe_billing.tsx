// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your actual publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeBillingProps {
  customerId: string; // Stripe Customer ID
  subscriptionId?: string; // Optional: Existing Subscription ID
  onSubscriptionSuccess: (subscriptionId: string) => void;
  onSubscriptionError: (error: Error) => void;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId, subscriptionId, onSubscriptionSuccess, onSubscriptionError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  return (
    <Elements stripe={stripePromise}>
      <SubscriptionForm customerId={customerId} subscriptionId={subscriptionId} onSubscriptionSuccess={onSubscriptionSuccess} onSubscriptionError={onSubscriptionError} setLoading={setLoading} setError={setError} />
    </Elements>
  );
};

interface SubscriptionFormProps {
  customerId: string;
  subscriptionId?: string;
  onSubscriptionSuccess: (subscriptionId: string) => void;
  onSubscriptionError: (error: Error) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ customerId, subscriptionId, onSubscriptionSuccess, onSubscriptionError, setLoading, setError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubscribed, setIsSubscribed] = useState(!!subscriptionId);

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
        customerId,
        {
          payment_method: {
            card: elements.getElement(CardElement) as any, // Type assertion needed
            billing_details: {
              name: 'Customer Name', // Replace with actual customer name
            },
          },
        }
      );

      if (error) {
        console.error("Stripe Card Setup Error:", error);
        setError(error);
        onSubscriptionError(error);
        return;
      }

      // Call your backend to create the subscription
      const response = await fetch('/api/create-subscription', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          priceId: 'price_12345', // Replace with your actual price ID
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error("Subscription Creation Error:", data.error);
        setError(new Error(data.error));
        onSubscriptionError(new Error(data.error));
        return;
      }

      setIsSubscribed(true);
      onSubscriptionSuccess(data.subscriptionId);
      alert('Subscription created successfully!');

    } catch (err: any) {
      console.error("Unexpected Error:", err);
      setError(err);
      onSubscriptionError(err);
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
        {loading ? 'Subscribing...' : isSubscribed ? 'Update Payment Method' : 'Subscribe'}
      </button>
      {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
    </form>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your actual publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeBillingProps {
  customerId: string; // Stripe Customer ID
  subscriptionId?: string; // Optional: Existing Subscription ID
  onSubscriptionSuccess: (subscriptionId: string) => void;
  onSubscriptionError: (error: Error) => void;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId, subscriptionId, onSubscriptionSuccess, onSubscriptionError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  return (
    <Elements stripe={stripePromise}>
      <SubscriptionForm customerId={customerId} subscriptionId={subscriptionId} onSubscriptionSuccess={onSubscriptionSuccess} onSubscriptionError={onSubscriptionError} setLoading={setLoading} setError={setError} />
    </Elements>
  );
};

interface SubscriptionFormProps {
  customerId: string;
  subscriptionId?: string;
  onSubscriptionSuccess: (subscriptionId: string) => void;
  onSubscriptionError: (error: Error) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ customerId, subscriptionId, onSubscriptionSuccess, onSubscriptionError, setLoading, setError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubscribed, setIsSubscribed] = useState(!!subscriptionId);

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
        customerId,
        {
          payment_method: {
            card: elements.getElement(CardElement) as any, // Type assertion needed
            billing_details: {
              name: 'Customer Name', // Replace with actual customer name
            },
          },
        }
      );

      if (error) {
        console.error("Stripe Card Setup Error:", error);
        setError(error);
        onSubscriptionError(error);
        return;
      }

      // Call your backend to create the subscription
      const response = await fetch('/api/create-subscription', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          priceId: 'price_12345', // Replace with your actual price ID
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error("Subscription Creation Error:", data.error);
        setError(new Error(data.error));
        onSubscriptionError(new Error(data.error));
        return;
      }

      setIsSubscribed(true);
      onSubscriptionSuccess(data.subscriptionId);
      alert('Subscription created successfully!');

    } catch (err: any) {
      console.error("Unexpected Error:", err);
      setError(err);
      onSubscriptionError(err);
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
        {loading ? 'Subscribing...' : isSubscribed ? 'Update Payment Method' : 'Subscribe'}
      </button>
      {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
    </form>
  );
};

export default StripeBilling;

Now, I will use the `Write` tool to write the code to `src/components/StripeBilling.tsx` and then output the build report.
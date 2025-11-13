// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''); // Replace with your actual key

interface StripeCheckoutProps {
  amount: number; // Amount in cents
  currency: string; // Currency code (e.g., 'usd')
  onSuccess: () => void; // Callback for successful payment
  onError: (error: Error) => void; // Callback for payment error
}

const CheckoutForm: React.FC<StripeCheckoutProps> = ({ amount, currency, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement) as any, // Explicitly cast to 'any' to avoid TS errors with Stripe types
      });

      if (error) {
        setError(error.message);
        onError(new Error(error.message));
        return;
      }

      const response = await fetch('/api/create-payment-intent', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          paymentMethodId: paymentMethod.id,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        onError(new Error(data.error));
      } else {
        onSuccess();
      }
    } catch (e: any) {
      setError(e.message);
      onError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Pay ${amount / 100} ${currency.toUpperCase()}`}
      </button>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </form>
  );
};

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ amount, currency, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} currency={currency} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

export default StripeCheckout;

// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''); // Replace with your actual key

interface StripeCheckoutProps {
  amount: number; // Amount in cents
  currency: string; // Currency code (e.g., 'usd')
  onSuccess: () => void; // Callback for successful payment
  onError: (error: Error) => void; // Callback for payment error
}

const CheckoutForm: React.FC<StripeCheckoutProps> = ({ amount, currency, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement) as any, // Explicitly cast to 'any' to avoid TS errors with Stripe types
      });

      if (error) {
        setError(error.message);
        onError(new Error(error.message));
        return;
      }

      const response = await fetch('/api/create-payment-intent', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          paymentMethodId: paymentMethod.id,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        onError(new Error(data.error));
      } else {
        onSuccess();
      }
    } catch (e: any) {
      setError(e.message);
      onError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Pay ${amount / 100} ${currency.toUpperCase()}`}
      </button>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </form>
  );
};

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ amount, currency, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} currency={currency} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

export default StripeCheckout;
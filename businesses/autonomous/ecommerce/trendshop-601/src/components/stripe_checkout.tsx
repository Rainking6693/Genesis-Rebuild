// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your actual publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCheckoutProps {
  amount: number; // Amount in cents
  currency: string; // Currency code (e.g., USD)
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<StripeCheckoutProps> = ({ amount, currency, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe || !elements) {
      setDisabled(true);
      return;
    }
    setDisabled(false);
  }, [stripe, elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js is loaded.
      return;
    }

    setProcessing(true);

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.error("Stripe Payment Method Error:", error);
      setError(error.message);
      onError(error.message);
      setProcessing(false);
      return;
    }

    try {
      const response = await fetch('/api/create-payment-intent', {
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
        console.error("Payment Intent Creation Error:", data.error);
        setError(data.error);
        onError(data.error);
        setProcessing(false);
        return;
      }

      if (data.paymentIntent && data.paymentIntent.id) {
        onSuccess(data.paymentIntent.id);
      } else {
        console.error("Unexpected response from Payment Intent creation:", data);
        setError("Unexpected error during payment processing.");
        onError("Unexpected error during payment processing.");
      }

    } catch (err: any) {
      console.error("Error during Payment Intent creation:", err);
      setError(err.message);
      onError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        onChange={(event) => {
          if (event.error) {
            setError(event.error.message);
          } else {
            setError(null);
          }
        }}
      />
      {error && <div className="error-message">{error}</div>}
      <button type="submit" disabled={processing || disabled}>
        {processing ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
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
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your actual publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCheckoutProps {
  amount: number; // Amount in cents
  currency: string; // Currency code (e.g., USD)
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<StripeCheckoutProps> = ({ amount, currency, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe || !elements) {
      setDisabled(true);
      return;
    }
    setDisabled(false);
  }, [stripe, elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js is loaded.
      return;
    }

    setProcessing(true);

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.error("Stripe Payment Method Error:", error);
      setError(error.message);
      onError(error.message);
      setProcessing(false);
      return;
    }

    try {
      const response = await fetch('/api/create-payment-intent', {
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
        console.error("Payment Intent Creation Error:", data.error);
        setError(data.error);
        onError(data.error);
        setProcessing(false);
        return;
      }

      if (data.paymentIntent && data.paymentIntent.id) {
        onSuccess(data.paymentIntent.id);
      } else {
        console.error("Unexpected response from Payment Intent creation:", data);
        setError("Unexpected error during payment processing.");
        onError("Unexpected error during payment processing.");
      }

    } catch (err: any) {
      console.error("Error during Payment Intent creation:", err);
      setError(err.message);
      onError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        onChange={(event) => {
          if (event.error) {
            setError(event.error.message);
          } else {
            setError(null);
          }
        }}
      />
      {error && <div className="error-message">{error}</div>}
      <button type="submit" disabled={processing || disabled}>
        {processing ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
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
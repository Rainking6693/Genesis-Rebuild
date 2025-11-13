// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCheckoutProps {
  amount: number; // Amount in cents
  currency: string; // Currency code (e.g., USD)
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: Error) => void;
}

const CheckoutForm: React.FC<StripeCheckoutProps> = ({ amount, currency, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setProcessing(true);
    setError(null);

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: card,
      });

      if (error) {
        setError(error.message);
        onError(new Error(error.message));
        setProcessing(false);
        return;
      }

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
        setError(data.error);
        onError(new Error(data.error));
        setProcessing(false);
        return;
      }

      if (data.paymentIntent && data.paymentIntent.status === 'requires_action' && stripe) {
        const { error: confirmError } = await stripe.confirmCardPayment(
          data.paymentIntent.client_secret
        );

        if (confirmError) {
          setError(confirmError.message);
          onError(new Error(confirmError.message));
          setProcessing(false);
          return;
        }
      }

      if (data.paymentIntent && data.paymentIntent.status === 'succeeded') {
        onSuccess(data.paymentIntent.id);
        setProcessing(false);
      } else {
        setError("Payment failed. Please try again.");
        onError(new Error("Payment failed. Please try again."));
        setProcessing(false);
      }

    } catch (err: any) {
      setError(err.message);
      onError(err);
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
      />
      {error && <div className="error-message">{error}</div>}
      <button type="submit" disabled={processing || !stripe || !elements}>
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
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCheckoutProps {
  amount: number; // Amount in cents
  currency: string; // Currency code (e.g., USD)
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: Error) => void;
}

const CheckoutForm: React.FC<StripeCheckoutProps> = ({ amount, currency, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setProcessing(true);
    setError(null);

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: card,
      });

      if (error) {
        setError(error.message);
        onError(new Error(error.message));
        setProcessing(false);
        return;
      }

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
        setError(data.error);
        onError(new Error(data.error));
        setProcessing(false);
        return;
      }

      if (data.paymentIntent && data.paymentIntent.status === 'requires_action' && stripe) {
        const { error: confirmError } = await stripe.confirmCardPayment(
          data.paymentIntent.client_secret
        );

        if (confirmError) {
          setError(confirmError.message);
          onError(new Error(confirmError.message));
          setProcessing(false);
          return;
        }
      }

      if (data.paymentIntent && data.paymentIntent.status === 'succeeded') {
        onSuccess(data.paymentIntent.id);
        setProcessing(false);
      } else {
        setError("Payment failed. Please try again.");
        onError(new Error("Payment failed. Please try again."));
        setProcessing(false);
      }

    } catch (err: any) {
      setError(err.message);
      onError(err);
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
      />
      {error && <div className="error-message">{error}</div>}
      <button type="submit" disabled={processing || !stripe || !elements}>
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
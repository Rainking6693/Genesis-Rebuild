import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: any) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!stripe || !elements) {
        onPaymentError(new Error('Stripe or Elements are not available'));
        return;
      }

      try {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          onPaymentError(new Error('Card element not found'));
          return;
        }

        const { paymentIntent, error } = await stripe.confirmCardPayment(
          process.env.REACT_APP_STRIPE_CLIENT_SECRET!,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );

        if (error) {
          onPaymentError(error);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          onPaymentSuccess(paymentIntent);
        } else {
          onPaymentError(new Error('Payment intent status is not succeeded'));
        }
      } catch (err) {
        onPaymentError(err);
      }
    },
    [onPaymentSuccess, onPaymentError, stripe, elements]
  );

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
          hidePostalCode: true, // Improve accessibility by hiding the postal code field
        }}
      />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

const StripeProvider: React.FC = ({ children }) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      try {
        const stripeJs = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);
        setStripePromise(Promise.resolve(stripeJs));
      } catch (err) {
        setStripePromise(Promise.reject(err));
      }
    };
    loadStripePromise();
  }, []);

  return stripePromise ? (
    <Elements stripe={stripePromise}>{children}</Elements>
  ) : (
    <div>Loading...</div>
  );
};

export { StripeProvider, StripeCheckout };

import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: any) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!stripe || !elements) {
        onPaymentError(new Error('Stripe or Elements are not available'));
        return;
      }

      try {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          onPaymentError(new Error('Card element not found'));
          return;
        }

        const { paymentIntent, error } = await stripe.confirmCardPayment(
          process.env.REACT_APP_STRIPE_CLIENT_SECRET!,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );

        if (error) {
          onPaymentError(error);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          onPaymentSuccess(paymentIntent);
        } else {
          onPaymentError(new Error('Payment intent status is not succeeded'));
        }
      } catch (err) {
        onPaymentError(err);
      }
    },
    [onPaymentSuccess, onPaymentError, stripe, elements]
  );

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
          hidePostalCode: true, // Improve accessibility by hiding the postal code field
        }}
      />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

const StripeProvider: React.FC = ({ children }) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      try {
        const stripeJs = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);
        setStripePromise(Promise.resolve(stripeJs));
      } catch (err) {
        setStripePromise(Promise.reject(err));
      }
    };
    loadStripePromise();
  }, []);

  return stripePromise ? (
    <Elements stripe={stripePromise}>{children}</Elements>
  ) : (
    <div>Loading...</div>
  );
};

export { StripeProvider, StripeCheckout };
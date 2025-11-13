import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, StripeElementsOptions, StripeElements } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: any) => void;
  stripePublicKey: string;
  stripeClientSecret: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  onPaymentSuccess,
  onPaymentError,
  stripePublicKey,
  stripeClientSecret,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!stripe || !elements) {
        onPaymentError(new Error('Stripe or Elements is not available'));
        return;
      }

      try {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          onPaymentError(new Error('Card element is not available'));
          return;
        }

        const { paymentIntent, error } = await stripe.confirmCardPayment(stripeClientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

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
    [onPaymentSuccess, onPaymentError, stripe, elements, stripeClientSecret]
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

const StripeProvider: React.FC<{ stripePublicKey: string }> = ({ children, stripePublicKey }) => {
  const [stripePromise, setStripePromise] = useState<Promise<StripeElements> | null>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      try {
        const stripeJs = await loadStripe(stripePublicKey, {
          locale: 'en',
        } as StripeElementsOptions);
        setStripePromise(stripeJs);
      } catch (error) {
        console.error('Error loading Stripe:', error);
        setStripePromise(null);
      }
    };
    loadStripePromise();
  }, [stripePublicKey]);

  return stripePromise ? (
    <Elements stripe={stripePromise}>{children}</Elements>
  ) : (
    <div>Error loading Stripe. Please try again later.</div>
  );
};

export { StripeProvider, StripeCheckout };

import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, StripeElementsOptions, StripeElements } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: any) => void;
  stripePublicKey: string;
  stripeClientSecret: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  onPaymentSuccess,
  onPaymentError,
  stripePublicKey,
  stripeClientSecret,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!stripe || !elements) {
        onPaymentError(new Error('Stripe or Elements is not available'));
        return;
      }

      try {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          onPaymentError(new Error('Card element is not available'));
          return;
        }

        const { paymentIntent, error } = await stripe.confirmCardPayment(stripeClientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

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
    [onPaymentSuccess, onPaymentError, stripe, elements, stripeClientSecret]
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

const StripeProvider: React.FC<{ stripePublicKey: string }> = ({ children, stripePublicKey }) => {
  const [stripePromise, setStripePromise] = useState<Promise<StripeElements> | null>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      try {
        const stripeJs = await loadStripe(stripePublicKey, {
          locale: 'en',
        } as StripeElementsOptions);
        setStripePromise(stripeJs);
      } catch (error) {
        console.error('Error loading Stripe:', error);
        setStripePromise(null);
      }
    };
    loadStripePromise();
  }, [stripePublicKey]);

  return stripePromise ? (
    <Elements stripe={stripePromise}>{children}</Elements>
  ) : (
    <div>Error loading Stripe. Please try again later.</div>
  );
};

export { StripeProvider, StripeCheckout };
import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, StripeElementsOptions, StripeElements, StripeError } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentFailure: (error: StripeError) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ onPaymentSuccess, onPaymentFailure }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!stripe || !elements) {
        onPaymentFailure({ type: 'api_connection_error', message: 'Stripe SDK not loaded' });
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        onPaymentFailure({ type: 'validation_error', message: 'Card element not found' });
        return;
      }

      try {
        const { paymentIntent, error } = await stripe.confirmCardPayment(process.env.STRIPE_CLIENT_SECRET!, {
          payment_method: {
            card: cardElement,
          },
        });

        if (error) {
          onPaymentFailure(error);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          onPaymentSuccess(paymentIntent);
        } else {
          onPaymentFailure({ type: 'unknown_error', message: 'Unknown error occurred during payment' });
        }
      } catch (error) {
        if (error instanceof Error) {
          onPaymentFailure({ type: 'unknown_error', message: error.message });
        } else {
          onPaymentFailure({ type: 'unknown_error', message: 'An unknown error occurred' });
        }
      }
    },
    [onPaymentSuccess, onPaymentFailure, stripe, elements]
  );

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#32325d',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a',
            },
          },
          disabled: !stripe,
          hidePostalCode: true,
          iconStyle: 'solid',
          placeholder: 'Card details',
        }}
      />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

const StripeProvider: React.FC = ({ children }) => {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      try {
        const stripePromise = await loadStripe(process.env.STRIPE_PUBLIC_KEY!);
        setStripePromise(stripePromise);
      } catch (error) {
        console.error('Error loading Stripe SDK:', error);
        setStripePromise(null);
      }
    };
    loadStripePromise();
  }, []);

  return stripePromise ? (
    <Elements stripe={stripePromise}>{children}</Elements>
  ) : (
    <div>Error loading Stripe SDK. Please try again later.</div>
  );
};

export { StripeProvider, StripeCheckout };

import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, StripeElementsOptions, StripeElements, StripeError } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentFailure: (error: StripeError) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ onPaymentSuccess, onPaymentFailure }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!stripe || !elements) {
        onPaymentFailure({ type: 'api_connection_error', message: 'Stripe SDK not loaded' });
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        onPaymentFailure({ type: 'validation_error', message: 'Card element not found' });
        return;
      }

      try {
        const { paymentIntent, error } = await stripe.confirmCardPayment(process.env.STRIPE_CLIENT_SECRET!, {
          payment_method: {
            card: cardElement,
          },
        });

        if (error) {
          onPaymentFailure(error);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          onPaymentSuccess(paymentIntent);
        } else {
          onPaymentFailure({ type: 'unknown_error', message: 'Unknown error occurred during payment' });
        }
      } catch (error) {
        if (error instanceof Error) {
          onPaymentFailure({ type: 'unknown_error', message: error.message });
        } else {
          onPaymentFailure({ type: 'unknown_error', message: 'An unknown error occurred' });
        }
      }
    },
    [onPaymentSuccess, onPaymentFailure, stripe, elements]
  );

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#32325d',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a',
            },
          },
          disabled: !stripe,
          hidePostalCode: true,
          iconStyle: 'solid',
          placeholder: 'Card details',
        }}
      />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

const StripeProvider: React.FC = ({ children }) => {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      try {
        const stripePromise = await loadStripe(process.env.STRIPE_PUBLIC_KEY!);
        setStripePromise(stripePromise);
      } catch (error) {
        console.error('Error loading Stripe SDK:', error);
        setStripePromise(null);
      }
    };
    loadStripePromise();
  }, []);

  return stripePromise ? (
    <Elements stripe={stripePromise}>{children}</Elements>
  ) : (
    <div>Error loading Stripe SDK. Please try again later.</div>
  );
};

export { StripeProvider, StripeCheckout };
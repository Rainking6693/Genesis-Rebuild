import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripePaymentProps {
  clientSecret: string;
  onPaymentSuccess: () => void;
  onPaymentFailure: (error: string) => void;
}

const StripePayment: React.FC<StripePaymentProps> = ({
  clientSecret,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!stripe || !elements) {
        onPaymentFailure('Stripe is not initialized properly.');
        return;
      }

      try {
        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        });

        if (error) {
          onPaymentFailure(error.message || 'An error occurred during payment.');
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          onPaymentSuccess();
        } else {
          onPaymentFailure('Payment intent status is not "succeeded".');
        }
      } catch (error) {
        onPaymentFailure((error as Error).message || 'An error occurred during payment.');
      }
    },
    [clientSecret, elements, onPaymentFailure, onPaymentSuccess, stripe]
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
          hidePostalCode: true, // Improve accessibility by hiding the postal code field
        }}
      />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

const StripePaymentWrapper: React.FC<StripePaymentProps> = (props) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      const stripeKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
      if (stripeKey) {
        setStripePromise(loadStripe(stripeKey));
      } else {
        console.error('REACT_APP_STRIPE_PUBLIC_KEY is not defined in the environment variables.');
      }
    };
    loadStripePromise();
  }, []);

  return stripePromise ? (
    <Elements stripe={stripePromise}>
      <StripePayment {...props} />
    </Elements>
  ) : null;
};

export default StripePaymentWrapper;

import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripePaymentProps {
  clientSecret: string;
  onPaymentSuccess: () => void;
  onPaymentFailure: (error: string) => void;
}

const StripePayment: React.FC<StripePaymentProps> = ({
  clientSecret,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!stripe || !elements) {
        onPaymentFailure('Stripe is not initialized properly.');
        return;
      }

      try {
        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        });

        if (error) {
          onPaymentFailure(error.message || 'An error occurred during payment.');
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          onPaymentSuccess();
        } else {
          onPaymentFailure('Payment intent status is not "succeeded".');
        }
      } catch (error) {
        onPaymentFailure((error as Error).message || 'An error occurred during payment.');
      }
    },
    [clientSecret, elements, onPaymentFailure, onPaymentSuccess, stripe]
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
          hidePostalCode: true, // Improve accessibility by hiding the postal code field
        }}
      />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

const StripePaymentWrapper: React.FC<StripePaymentProps> = (props) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      const stripeKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
      if (stripeKey) {
        setStripePromise(loadStripe(stripeKey));
      } else {
        console.error('REACT_APP_STRIPE_PUBLIC_KEY is not defined in the environment variables.');
      }
    };
    loadStripePromise();
  }, []);

  return stripePromise ? (
    <Elements stripe={stripePromise}>
      <StripePayment {...props} />
    </Elements>
  ) : null;
};

export default StripePaymentWrapper;
import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentFailure: (error: any) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ onPaymentSuccess, onPaymentFailure }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!stripe || !elements) {
        onPaymentFailure(new Error('Stripe or Elements are not available'));
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        onPaymentFailure(new Error('Card element is not available'));
        return;
      }

      try {
        const { paymentIntent, error } = await stripe.confirmCardPayment(
          process.env.REACT_APP_STRIPE_CLIENT_SECRET!,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );

        if (error) {
          onPaymentFailure(error);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          onPaymentSuccess(paymentIntent);
        } else {
          onPaymentFailure(new Error('Payment intent status is not succeeded'));
        }
      } catch (error) {
        onPaymentFailure(error);
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

const StripeProvider: React.FC<StripeCheckoutProps> = ({ onPaymentSuccess, onPaymentFailure }) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      try {
        const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);
        setStripePromise(Promise.resolve(stripePromise));
      } catch (error) {
        setStripePromise(Promise.reject(error));
        onPaymentFailure(error);
      }
    };
    loadStripePromise();
  }, [onPaymentFailure]);

  return (
    <Elements stripe={stripePromise}>
      <StripeCheckout onPaymentSuccess={onPaymentSuccess} onPaymentFailure={onPaymentFailure} />
    </Elements>
  );
};

export default StripeProvider;

import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentFailure: (error: any) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ onPaymentSuccess, onPaymentFailure }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!stripe || !elements) {
        onPaymentFailure(new Error('Stripe or Elements are not available'));
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        onPaymentFailure(new Error('Card element is not available'));
        return;
      }

      try {
        const { paymentIntent, error } = await stripe.confirmCardPayment(
          process.env.REACT_APP_STRIPE_CLIENT_SECRET!,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );

        if (error) {
          onPaymentFailure(error);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          onPaymentSuccess(paymentIntent);
        } else {
          onPaymentFailure(new Error('Payment intent status is not succeeded'));
        }
      } catch (error) {
        onPaymentFailure(error);
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

const StripeProvider: React.FC<StripeCheckoutProps> = ({ onPaymentSuccess, onPaymentFailure }) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      try {
        const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);
        setStripePromise(Promise.resolve(stripePromise));
      } catch (error) {
        setStripePromise(Promise.reject(error));
        onPaymentFailure(error);
      }
    };
    loadStripePromise();
  }, [onPaymentFailure]);

  return (
    <Elements stripe={stripePromise}>
      <StripeCheckout onPaymentSuccess={onPaymentSuccess} onPaymentFailure={onPaymentFailure} />
    </Elements>
  );
};

export default StripeProvider;
import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, StripeElementsOptions, StripeElements, StripeError } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: StripeError) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!stripe || !elements) {
        onPaymentError({ type: 'api_connection_error', message: 'Stripe SDK not loaded' });
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        onPaymentError({ type: 'validation_error', message: 'Card element not found' });
        return;
      }

      try {
        const { paymentIntent, error } = await stripe.confirmCardPayment(process.env.STRIPE_CLIENT_SECRET!, {
          payment_method: {
            card: cardElement,
          },
        });

        if (error) {
          onPaymentError(error);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          onPaymentSuccess(paymentIntent);
        } else {
          onPaymentError({ type: 'payment_intent_error', message: 'Payment intent error' });
        }
      } catch (error) {
        onPaymentError(error as StripeError);
      }
    },
    [stripe, elements, onPaymentSuccess, onPaymentError]
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

const StripeProvider: React.FC = ({ children }) => {
  const [stripePromise, setStripePromise] = useState<Promise<StripeElements> | null>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      try {
        const stripePromise = await loadStripe(process.env.STRIPE_PUBLIC_KEY!, {
          locale: 'en',
        } as StripeElementsOptions);
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
    <div role="alert" aria-live="polite">
      Loading...
    </div>
  );
};

export default function StripeIntegration() {
  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('Payment successful:', paymentIntent);
  };

  const handlePaymentError = (error: StripeError) => {
    console.error('Payment error:', error);
  };

  return (
    <StripeProvider>
      <StripeCheckout onPaymentSuccess={handlePaymentSuccess} onPaymentError={handlePaymentError} />
    </StripeProvider>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, StripeElementsOptions, StripeElements, StripeError } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: StripeError) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!stripe || !elements) {
        onPaymentError({ type: 'api_connection_error', message: 'Stripe SDK not loaded' });
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        onPaymentError({ type: 'validation_error', message: 'Card element not found' });
        return;
      }

      try {
        const { paymentIntent, error } = await stripe.confirmCardPayment(process.env.STRIPE_CLIENT_SECRET!, {
          payment_method: {
            card: cardElement,
          },
        });

        if (error) {
          onPaymentError(error);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          onPaymentSuccess(paymentIntent);
        } else {
          onPaymentError({ type: 'payment_intent_error', message: 'Payment intent error' });
        }
      } catch (error) {
        onPaymentError(error as StripeError);
      }
    },
    [stripe, elements, onPaymentSuccess, onPaymentError]
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

const StripeProvider: React.FC = ({ children }) => {
  const [stripePromise, setStripePromise] = useState<Promise<StripeElements> | null>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      try {
        const stripePromise = await loadStripe(process.env.STRIPE_PUBLIC_KEY!, {
          locale: 'en',
        } as StripeElementsOptions);
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
    <div role="alert" aria-live="polite">
      Loading...
    </div>
  );
};

export default function StripeIntegration() {
  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('Payment successful:', paymentIntent);
  };

  const handlePaymentError = (error: StripeError) => {
    console.error('Payment error:', error);
  };

  return (
    <StripeProvider>
      <StripeCheckout onPaymentSuccess={handlePaymentSuccess} onPaymentError={handlePaymentError} />
    </StripeProvider>
  );
}
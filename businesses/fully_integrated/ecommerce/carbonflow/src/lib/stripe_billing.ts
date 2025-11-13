import React, { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions, StripeElements } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentFailure: (error: any) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ onPaymentSuccess, onPaymentFailure }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onPaymentFailure(new Error('Stripe or Elements is not available'));
      return;
    }

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        onPaymentFailure(new Error('Card element is not available'));
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
        onPaymentFailure(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      } else {
        onPaymentFailure(new Error('Payment intent status is not succeeded'));
      }
    } catch (error) {
      onPaymentFailure(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Stripe Checkout">
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
      <button type="submit" disabled={!stripe} aria-label="Pay">
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
        const stripeJs = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);
        setStripePromise(stripeJs);
      } catch (error) {
        console.error('Error loading Stripe:', error);
      }
    };
    loadStripePromise();
  }, []);

  return stripePromise ? (
    <Elements
      stripe={stripePromise}
      options={{
        fonts: [
          {
            cssSrc: 'https://fonts.googleapis.com/css?family=Roboto:400,500,600',
          },
        ],
      }}
    >
      {children}
    </Elements>
  ) : (
    <div>Loading...</div>
  );
};

export { StripeProvider, StripeCheckout };

import React, { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions, StripeElements } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentFailure: (error: any) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ onPaymentSuccess, onPaymentFailure }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onPaymentFailure(new Error('Stripe or Elements is not available'));
      return;
    }

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        onPaymentFailure(new Error('Card element is not available'));
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
        onPaymentFailure(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      } else {
        onPaymentFailure(new Error('Payment intent status is not succeeded'));
      }
    } catch (error) {
      onPaymentFailure(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Stripe Checkout">
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
      <button type="submit" disabled={!stripe} aria-label="Pay">
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
        const stripeJs = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);
        setStripePromise(stripeJs);
      } catch (error) {
        console.error('Error loading Stripe:', error);
      }
    };
    loadStripePromise();
  }, []);

  return stripePromise ? (
    <Elements
      stripe={stripePromise}
      options={{
        fonts: [
          {
            cssSrc: 'https://fonts.googleapis.com/css?family=Roboto:400,500,600',
          },
        ],
      }}
    >
      {children}
    </Elements>
  ) : (
    <div>Loading...</div>
  );
};

export { StripeProvider, StripeCheckout };
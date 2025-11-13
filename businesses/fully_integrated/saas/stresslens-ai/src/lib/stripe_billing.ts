import React, { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions, StripeElements } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: any) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onPaymentError(new Error('Stripe or Elements is not available'));
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onPaymentError(new Error('Card element is not available'));
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
        onPaymentError(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      } else {
        onPaymentError(new Error('Payment intent status is not succeeded'));
      }
    } catch (err) {
      onPaymentError(err);
    }
  };

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
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [stripeElements, setStripeElements] = useState<StripeElements | null>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      try {
        const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);
        setStripePromise(stripePromise);

        const stripeElements = stripePromise.elements() as StripeElements;
        setStripeElements(stripeElements);
      } catch (err) {
        console.error('Error loading Stripe:', err);
        onPaymentError(err); // Handle Stripe loading errors
      }
    };
    loadStripePromise();
  }, [onPaymentError]);

  return stripePromise && stripeElements ? (
    <Elements stripe={stripePromise} options={getStripeElementsOptions()}>
      {children}
    </Elements>
  ) : (
    <div>Loading...</div>
  );
};

function getStripeElementsOptions(): StripeElementsOptions {
  return {
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=Roboto:400,500,600',
      },
    ],
  };
}

export { StripeProvider, StripeCheckout };

import React, { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions, StripeElements } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: any) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onPaymentError(new Error('Stripe or Elements is not available'));
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onPaymentError(new Error('Card element is not available'));
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
        onPaymentError(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      } else {
        onPaymentError(new Error('Payment intent status is not succeeded'));
      }
    } catch (err) {
      onPaymentError(err);
    }
  };

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
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [stripeElements, setStripeElements] = useState<StripeElements | null>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      try {
        const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);
        setStripePromise(stripePromise);

        const stripeElements = stripePromise.elements() as StripeElements;
        setStripeElements(stripeElements);
      } catch (err) {
        console.error('Error loading Stripe:', err);
        onPaymentError(err); // Handle Stripe loading errors
      }
    };
    loadStripePromise();
  }, [onPaymentError]);

  return stripePromise && stripeElements ? (
    <Elements stripe={stripePromise} options={getStripeElementsOptions()}>
      {children}
    </Elements>
  ) : (
    <div>Loading...</div>
  );
};

function getStripeElementsOptions(): StripeElementsOptions {
  return {
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=Roboto:400,500,600',
      },
    ],
  };
}

export { StripeProvider, StripeCheckout };
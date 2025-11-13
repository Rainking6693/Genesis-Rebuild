import React, { useState, useEffect } from 'react';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
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
      onPaymentFailure(new Error('Stripe or Elements not available'));
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onPaymentFailure(new Error('Card element not found'));
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
          hidePostalCode: true, // Improve accessibility by hiding the postal code field
        }}
      />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

const StripeProvider: React.FC<StripeCheckoutProps> = (props) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      try {
        const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);
        setStripe(stripePromise);
        setElements(stripePromise.elements());
      } catch (error) {
        console.error('Error loading Stripe:', error);
        props.onPaymentFailure(error); // Notify the parent component of the error
      }
    };
    loadStripePromise();
  }, [props.onPaymentFailure]);

  return stripe && elements ? (
    <Elements stripe={stripe} options={{ locale: 'en' }}>
      <StripeCheckout {...props} />
    </Elements>
  ) : null;
};

export default StripeProvider;

import React, { useState, useEffect } from 'react';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
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
      onPaymentFailure(new Error('Stripe or Elements not available'));
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onPaymentFailure(new Error('Card element not found'));
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
          hidePostalCode: true, // Improve accessibility by hiding the postal code field
        }}
      />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

const StripeProvider: React.FC<StripeCheckoutProps> = (props) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      try {
        const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);
        setStripe(stripePromise);
        setElements(stripePromise.elements());
      } catch (error) {
        console.error('Error loading Stripe:', error);
        props.onPaymentFailure(error); // Notify the parent component of the error
      }
    };
    loadStripePromise();
  }, [props.onPaymentFailure]);

  return stripe && elements ? (
    <Elements stripe={stripe} options={{ locale: 'en' }}>
      <StripeCheckout {...props} />
    </Elements>
  ) : null;
};

export default StripeProvider;
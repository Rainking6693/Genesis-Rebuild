import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  CardElementChangeEvent,
} from '@stripe/react-stripe-js';

// Define a more specific type for the PaymentIntent
interface PaymentIntentResult {
  paymentIntent?: {
    id: string;
    status: string;
    // Add other properties you need from the PaymentIntent
  };
  error?: {
    message: string;
    code?: string; // Stripe error codes
    type?: string; // Error type (e.g., 'card_error')
  };
}

interface StripePaymentProps {
  onPaymentSuccess: (paymentIntent: PaymentIntentResult['paymentIntent']) => void;
  onPaymentError: (error: PaymentIntentResult['error']) => void;
  clientSecret: string; // Require clientSecret as a prop
  // Optional prop for styling the CardElement
  cardElementOptions?: any;
}

const StripePayment: React.FC<StripePaymentProps> = ({
  onPaymentSuccess,
  onPaymentError,
  clientSecret,
  cardElementOptions,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!stripe || !elements || isSubmitting) {
        // Stripe.js hasn't loaded yet, or already submitting
        return;
      }

      setIsSubmitting(true);
      setCardError(null); // Clear any previous card errors

      try {
        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
          throw new Error("Card element is not mounted."); // Handle case where CardElement isn't available
        }

        const { paymentIntent, error } =
          await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement,
            },
          });

        if (error) {
          console.error('Payment error:', error);
          onPaymentError(error);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          console.log('Payment succeeded:', paymentIntent);
          onPaymentSuccess(paymentIntent);
        } else {
          throw new Error('Unexpected payment status');
        }
      } catch (error: any) {
        console.error('Unexpected error during payment:', error);
        onPaymentError({ message: error.message }); // Ensure error object has a message
      } finally {
        setIsSubmitting(false);
      }
    },
    [stripe, elements, clientSecret, onPaymentSuccess, onPaymentError, isSubmitting]
  );

  const handleCardChange = (event: CardElementChangeEvent) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement onChange={handleCardChange} options={cardElementOptions} />
      {cardError && (
        <div role="alert" aria-live="assertive" style={{ color: 'red' }}>
          {cardError}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        aria-disabled={!stripe || isSubmitting}
        aria-live="polite"
      >
        {isSubmitting ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
};

interface StripeContainerProps extends StripePaymentProps {
  stripePublicKey: string;
}

const StripeContainer: React.FC<StripeContainerProps> = (props) => {
  const { stripePublicKey, ...rest } = props;
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    const loadStripeInstance = async () => {
      try {
        const stripeInstance = await loadStripe(stripePublicKey);
        if (stripeInstance === null) {
          throw new Error("Stripe failed to load. Check your network connection and Stripe key.");
        }
        setStripePromise(stripeInstance);
      } catch (error: any) {
        console.error('Error loading Stripe:', error);
        setLoadError(error);
      }
    };

    loadStripeInstance();
  }, [stripePublicKey]);

  if (loadError) {
    return (
      <div role="alert" aria-live="assertive" style={{ color: 'red' }}>
        Error loading Stripe: {loadError.message}
      </div>
    );
  }

  return stripePromise ? (
    <Elements stripe={stripePromise}>
      <StripePayment {...rest} />
    </Elements>
  ) : (
    <div role="status" aria-live="polite">
      Loading payment form...
    </div>
  );
};

export default StripeContainer;

import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  CardElementChangeEvent,
} from '@stripe/react-stripe-js';

// Define a more specific type for the PaymentIntent
interface PaymentIntentResult {
  paymentIntent?: {
    id: string;
    status: string;
    // Add other properties you need from the PaymentIntent
  };
  error?: {
    message: string;
    code?: string; // Stripe error codes
    type?: string; // Error type (e.g., 'card_error')
  };
}

interface StripePaymentProps {
  onPaymentSuccess: (paymentIntent: PaymentIntentResult['paymentIntent']) => void;
  onPaymentError: (error: PaymentIntentResult['error']) => void;
  clientSecret: string; // Require clientSecret as a prop
  // Optional prop for styling the CardElement
  cardElementOptions?: any;
}

const StripePayment: React.FC<StripePaymentProps> = ({
  onPaymentSuccess,
  onPaymentError,
  clientSecret,
  cardElementOptions,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!stripe || !elements || isSubmitting) {
        // Stripe.js hasn't loaded yet, or already submitting
        return;
      }

      setIsSubmitting(true);
      setCardError(null); // Clear any previous card errors

      try {
        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
          throw new Error("Card element is not mounted."); // Handle case where CardElement isn't available
        }

        const { paymentIntent, error } =
          await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement,
            },
          });

        if (error) {
          console.error('Payment error:', error);
          onPaymentError(error);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          console.log('Payment succeeded:', paymentIntent);
          onPaymentSuccess(paymentIntent);
        } else {
          throw new Error('Unexpected payment status');
        }
      } catch (error: any) {
        console.error('Unexpected error during payment:', error);
        onPaymentError({ message: error.message }); // Ensure error object has a message
      } finally {
        setIsSubmitting(false);
      }
    },
    [stripe, elements, clientSecret, onPaymentSuccess, onPaymentError, isSubmitting]
  );

  const handleCardChange = (event: CardElementChangeEvent) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement onChange={handleCardChange} options={cardElementOptions} />
      {cardError && (
        <div role="alert" aria-live="assertive" style={{ color: 'red' }}>
          {cardError}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        aria-disabled={!stripe || isSubmitting}
        aria-live="polite"
      >
        {isSubmitting ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
};

interface StripeContainerProps extends StripePaymentProps {
  stripePublicKey: string;
}

const StripeContainer: React.FC<StripeContainerProps> = (props) => {
  const { stripePublicKey, ...rest } = props;
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    const loadStripeInstance = async () => {
      try {
        const stripeInstance = await loadStripe(stripePublicKey);
        if (stripeInstance === null) {
          throw new Error("Stripe failed to load. Check your network connection and Stripe key.");
        }
        setStripePromise(stripeInstance);
      } catch (error: any) {
        console.error('Error loading Stripe:', error);
        setLoadError(error);
      }
    };

    loadStripeInstance();
  }, [stripePublicKey]);

  if (loadError) {
    return (
      <div role="alert" aria-live="assertive" style={{ color: 'red' }}>
        Error loading Stripe: {loadError.message}
      </div>
    );
  }

  return stripePromise ? (
    <Elements stripe={stripePromise}>
      <StripePayment {...rest} />
    </Elements>
  ) : (
    <div role="status" aria-live="polite">
      Loading payment form...
    </div>
  );
};

export default StripeContainer;
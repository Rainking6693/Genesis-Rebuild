import React, { useState, useEffect, useCallback, useRef } from 'react';
import { loadStripe, Stripe, StripeError } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  CardElementChangeEvent,
} from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: StripeError | Error) => void;
  clientSecret: string | null;
  cardElementOptions?: Partial<CardElement.ElementOptions>;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  onPaymentSuccess,
  onPaymentError,
  clientSecret,
  cardElementOptions,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Disable submit button until Stripe is loaded and clientSecret is available
  useEffect(() => {
    if (!stripe || !elements || !clientSecret) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [stripe, elements, clientSecret]);

  const handleChange = useCallback((event: CardElementChangeEvent) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types
    setDisabled(event.empty || !stripe); // Disable if empty or stripe not loaded
  }, [stripe]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret || disabled || processing) {
      return; // Prevent multiple submissions or submissions when Stripe isn't ready
    }

    setProcessing(true);

    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );

      if (error) {
        onPaymentError(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      } else {
        onPaymentError(new Error('Unexpected payment intent status')); // Handle unexpected status
      }
    } catch (error: any) {
      onPaymentError(error);
    } finally {
      setProcessing(false); // Re-enable the button regardless of success or failure
      formRef.current?.reset(); // Reset the form
    }
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <CardElement
        onChange={handleChange}
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
          ...cardElementOptions, // Allow overriding default styles
        }}
      />
      <button
        type="submit"
        disabled={disabled || processing}
        aria-label="Pay"
        aria-live="polite"
      >
        {processing ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
};

interface StripeProviderProps {
  children: React.ReactNode;
  stripePublicKey: string;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children, stripePublicKey }) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      try {
        const stripe = await loadStripe(stripePublicKey);
        if (!stripe) {
          throw new Error('Stripe failed to load.');
        }
        setStripePromise(stripe);
      } catch (error: any) {
        console.error('Error loading Stripe:', error);
        setLoadError(error);
      }
    };

    loadStripePromise();
  }, [stripePublicKey]);

  if (loadError) {
    return (
      <div>
        Error loading Stripe. Please check your internet connection and Stripe
        public key.
        <details>
          <summary>Error Details</summary>
          <pre>{loadError.message}</pre>
        </details>
      </div>
    );
  }

  return stripePromise ? (
    <Elements stripe={stripePromise}>{children}</Elements>
  ) : (
    <div>Loading Stripe...</div>
  );
};

interface StripeIntegrationProps {
  stripePublicKey: string;
  clientSecret: string | null;
  onPaymentSuccess?: (paymentIntent: any) => void;
  onPaymentError?: (error: StripeError | Error) => void;
  cardElementOptions?: Partial<CardElement.ElementOptions>;
}

export default function StripeIntegration({
  stripePublicKey,
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
  cardElementOptions,
}: StripeIntegrationProps) {
  const defaultHandlePaymentSuccess = (paymentIntent: any) => {
    console.log('Payment successful:', paymentIntent);
  };

  const defaultHandlePaymentError = (error: StripeError | Error) => {
    console.error('Payment error:', error);
  };

  const handlePaymentSuccess = onPaymentSuccess || defaultHandlePaymentSuccess;
  const handlePaymentError = onPaymentError || defaultHandlePaymentError;

  return (
    <StripeProvider stripePublicKey={stripePublicKey}>
      <StripeCheckout
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
        clientSecret={clientSecret}
        cardElementOptions={cardElementOptions}
      />
    </StripeProvider>
  );
}

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { loadStripe, Stripe, StripeError } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  CardElementChangeEvent,
} from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: StripeError | Error) => void;
  clientSecret: string | null;
  cardElementOptions?: Partial<CardElement.ElementOptions>;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  onPaymentSuccess,
  onPaymentError,
  clientSecret,
  cardElementOptions,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Disable submit button until Stripe is loaded and clientSecret is available
  useEffect(() => {
    if (!stripe || !elements || !clientSecret) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [stripe, elements, clientSecret]);

  const handleChange = useCallback((event: CardElementChangeEvent) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types
    setDisabled(event.empty || !stripe); // Disable if empty or stripe not loaded
  }, [stripe]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret || disabled || processing) {
      return; // Prevent multiple submissions or submissions when Stripe isn't ready
    }

    setProcessing(true);

    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );

      if (error) {
        onPaymentError(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      } else {
        onPaymentError(new Error('Unexpected payment intent status')); // Handle unexpected status
      }
    } catch (error: any) {
      onPaymentError(error);
    } finally {
      setProcessing(false); // Re-enable the button regardless of success or failure
      formRef.current?.reset(); // Reset the form
    }
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <CardElement
        onChange={handleChange}
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
          ...cardElementOptions, // Allow overriding default styles
        }}
      />
      <button
        type="submit"
        disabled={disabled || processing}
        aria-label="Pay"
        aria-live="polite"
      >
        {processing ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
};

interface StripeProviderProps {
  children: React.ReactNode;
  stripePublicKey: string;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children, stripePublicKey }) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    const loadStripePromise = async () => {
      try {
        const stripe = await loadStripe(stripePublicKey);
        if (!stripe) {
          throw new Error('Stripe failed to load.');
        }
        setStripePromise(stripe);
      } catch (error: any) {
        console.error('Error loading Stripe:', error);
        setLoadError(error);
      }
    };

    loadStripePromise();
  }, [stripePublicKey]);

  if (loadError) {
    return (
      <div>
        Error loading Stripe. Please check your internet connection and Stripe
        public key.
        <details>
          <summary>Error Details</summary>
          <pre>{loadError.message}</pre>
        </details>
      </div>
    );
  }

  return stripePromise ? (
    <Elements stripe={stripePromise}>{children}</Elements>
  ) : (
    <div>Loading Stripe...</div>
  );
};

interface StripeIntegrationProps {
  stripePublicKey: string;
  clientSecret: string | null;
  onPaymentSuccess?: (paymentIntent: any) => void;
  onPaymentError?: (error: StripeError | Error) => void;
  cardElementOptions?: Partial<CardElement.ElementOptions>;
}

export default function StripeIntegration({
  stripePublicKey,
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
  cardElementOptions,
}: StripeIntegrationProps) {
  const defaultHandlePaymentSuccess = (paymentIntent: any) => {
    console.log('Payment successful:', paymentIntent);
  };

  const defaultHandlePaymentError = (error: StripeError | Error) => {
    console.error('Payment error:', error);
  };

  const handlePaymentSuccess = onPaymentSuccess || defaultHandlePaymentSuccess;
  const handlePaymentError = onPaymentError || defaultHandlePaymentError;

  return (
    <StripeProvider stripePublicKey={stripePublicKey}>
      <StripeCheckout
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
        clientSecret={clientSecret}
        cardElementOptions={cardElementOptions}
      />
    </StripeProvider>
  );
}
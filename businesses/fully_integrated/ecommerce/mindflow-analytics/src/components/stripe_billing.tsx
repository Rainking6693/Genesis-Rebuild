import React, { useState, useEffect, useCallback } from 'react';
import {
  loadStripe,
  StripeElementsOptions,
  StripeElements,
  StripeError,
  Stripe,
} from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  CardElementChangeEvent,
} from '@stripe/react-stripe-js';

// Define a more specific type for payment intent
interface PaymentIntentResult {
  id: string;
  status: string;
  // Add other relevant properties from the PaymentIntent object
}

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: PaymentIntentResult) => void;
  onPaymentFailure: (error: StripeError) => void;
  // Optional prop for customizing the button text
  buttonText?: string;
  // Optional prop to disable the button while processing
  isProcessing?: boolean;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  onPaymentSuccess,
  onPaymentFailure,
  buttonText = 'Pay',
  isProcessing = false,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [disabled, setDisabled] = useState(true); // Disable submit until card is valid

  const handleChange = useCallback((event: CardElementChangeEvent) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types
    setDisabled(event.empty || !!event.error);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe or Elements is not available');
      onPaymentFailure({ message: 'Stripe or Elements is not available' } as StripeError);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error('Card element is not available');
      onPaymentFailure({ message: 'Card element is not available' } as StripeError);
      return;
    }

    try {
      const clientSecret = process.env.REACT_APP_STRIPE_CLIENT_SECRET;
      if (!clientSecret) {
        console.error('Stripe client secret is missing');
        onPaymentFailure({ message: 'Stripe client secret is missing' } as StripeError);
        return;
      }

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        console.error('Payment confirmation error:', error);
        onPaymentFailure(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment successful:', paymentIntent);
        onPaymentSuccess(paymentIntent as PaymentIntentResult); // Type assertion here
      } else {
        console.warn('Payment intent status is not succeeded:', paymentIntent);
        onPaymentFailure({
          message: 'Payment intent status is not succeeded',
        } as StripeError);
      }
    } catch (error: any) {
      console.error('Payment processing error:', error);
      onPaymentFailure({ message: error.message || 'An unexpected error occurred' } as StripeError);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="card-element">
        Card details
      </label>
      <CardElement
        id="card-element"
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
          // Add accessibility attributes
          ariaInvalid: disabled,
        }}
      />
      <button type="submit" disabled={disabled || !stripe || isProcessing}>
        {isProcessing ? 'Processing...' : buttonText}
      </button>
    </form>
  );
};

interface StripeProviderProps {
  children: React.ReactNode;
  // Optional prop to pass in a pre-loaded Stripe instance.  Useful for testing.
  stripePromiseOverride?: Promise<Stripe | null> | null;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children, stripePromiseOverride }) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(
    stripePromiseOverride || null
  );
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    if (stripePromiseOverride) {
      // Use the override if provided.
      setLoading(false);
      return;
    }

    const loadStripePromise = async () => {
      try {
        const publicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
        if (!publicKey) {
          console.error('Stripe public key is missing');
          setStripePromise(null);
          setLoading(false);
          return;
        }
        const stripePromise = await loadStripe(publicKey);
        setStripePromise(stripePromise);
      } catch (error) {
        console.error('Error loading Stripe:', error);
        setStripePromise(null);
      } finally {
        setLoading(false);
      }
    };

    if (!stripePromiseOverride) {
      loadStripePromise();
    }
  }, [stripePromiseOverride]);

  if (loading) {
    return <div>Loading Stripe...</div>; // Display loading message
  }

  if (!stripePromise) {
    return <div>Failed to load Stripe. Please check your public key.</div>; // Display error message
  }

  return (
    <Elements stripe={stripePromise} options={getStripeOptions()}>
      {children}
    </Elements>
  );
};

function getStripeOptions(): StripeElementsOptions {
  return {
    locale: 'en',
    // Customize appearance for better user experience
    appearance: {
      theme: 'stripe',
    },
  };
}

interface StripePaymentComponentProps {
  // Add any props that this component needs
}

export default function StripePaymentComponent(props: StripePaymentComponentProps) {
  const [processing, setProcessing] = useState(false); // State for processing status

  const handlePaymentSuccess = (paymentIntent: PaymentIntentResult) => {
    console.log('Payment successful:', paymentIntent);
    setProcessing(false);
    // Implement your success logic here, e.g., redirect to a success page
  };

  const handlePaymentFailure = (error: StripeError) => {
    console.error('Payment failed:', error);
    setProcessing(false);
    // Implement your error handling logic here, e.g., display an error message to the user
  };

  return (
    <StripeProvider>
      <StripeCheckout
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
        isProcessing={processing}
        buttonText="Pay Now"
      />
    </StripeProvider>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import {
  loadStripe,
  StripeElementsOptions,
  StripeElements,
  StripeError,
  Stripe,
} from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  CardElementChangeEvent,
} from '@stripe/react-stripe-js';

// Define a more specific type for payment intent
interface PaymentIntentResult {
  id: string;
  status: string;
  // Add other relevant properties from the PaymentIntent object
}

interface StripeCheckoutProps {
  onPaymentSuccess: (paymentIntent: PaymentIntentResult) => void;
  onPaymentFailure: (error: StripeError) => void;
  // Optional prop for customizing the button text
  buttonText?: string;
  // Optional prop to disable the button while processing
  isProcessing?: boolean;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  onPaymentSuccess,
  onPaymentFailure,
  buttonText = 'Pay',
  isProcessing = false,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [disabled, setDisabled] = useState(true); // Disable submit until card is valid

  const handleChange = useCallback((event: CardElementChangeEvent) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types
    setDisabled(event.empty || !!event.error);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe or Elements is not available');
      onPaymentFailure({ message: 'Stripe or Elements is not available' } as StripeError);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error('Card element is not available');
      onPaymentFailure({ message: 'Card element is not available' } as StripeError);
      return;
    }

    try {
      const clientSecret = process.env.REACT_APP_STRIPE_CLIENT_SECRET;
      if (!clientSecret) {
        console.error('Stripe client secret is missing');
        onPaymentFailure({ message: 'Stripe client secret is missing' } as StripeError);
        return;
      }

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        console.error('Payment confirmation error:', error);
        onPaymentFailure(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment successful:', paymentIntent);
        onPaymentSuccess(paymentIntent as PaymentIntentResult); // Type assertion here
      } else {
        console.warn('Payment intent status is not succeeded:', paymentIntent);
        onPaymentFailure({
          message: 'Payment intent status is not succeeded',
        } as StripeError);
      }
    } catch (error: any) {
      console.error('Payment processing error:', error);
      onPaymentFailure({ message: error.message || 'An unexpected error occurred' } as StripeError);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="card-element">
        Card details
      </label>
      <CardElement
        id="card-element"
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
          // Add accessibility attributes
          ariaInvalid: disabled,
        }}
      />
      <button type="submit" disabled={disabled || !stripe || isProcessing}>
        {isProcessing ? 'Processing...' : buttonText}
      </button>
    </form>
  );
};

interface StripeProviderProps {
  children: React.ReactNode;
  // Optional prop to pass in a pre-loaded Stripe instance.  Useful for testing.
  stripePromiseOverride?: Promise<Stripe | null> | null;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children, stripePromiseOverride }) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(
    stripePromiseOverride || null
  );
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    if (stripePromiseOverride) {
      // Use the override if provided.
      setLoading(false);
      return;
    }

    const loadStripePromise = async () => {
      try {
        const publicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
        if (!publicKey) {
          console.error('Stripe public key is missing');
          setStripePromise(null);
          setLoading(false);
          return;
        }
        const stripePromise = await loadStripe(publicKey);
        setStripePromise(stripePromise);
      } catch (error) {
        console.error('Error loading Stripe:', error);
        setStripePromise(null);
      } finally {
        setLoading(false);
      }
    };

    if (!stripePromiseOverride) {
      loadStripePromise();
    }
  }, [stripePromiseOverride]);

  if (loading) {
    return <div>Loading Stripe...</div>; // Display loading message
  }

  if (!stripePromise) {
    return <div>Failed to load Stripe. Please check your public key.</div>; // Display error message
  }

  return (
    <Elements stripe={stripePromise} options={getStripeOptions()}>
      {children}
    </Elements>
  );
};

function getStripeOptions(): StripeElementsOptions {
  return {
    locale: 'en',
    // Customize appearance for better user experience
    appearance: {
      theme: 'stripe',
    },
  };
}

interface StripePaymentComponentProps {
  // Add any props that this component needs
}

export default function StripePaymentComponent(props: StripePaymentComponentProps) {
  const [processing, setProcessing] = useState(false); // State for processing status

  const handlePaymentSuccess = (paymentIntent: PaymentIntentResult) => {
    console.log('Payment successful:', paymentIntent);
    setProcessing(false);
    // Implement your success logic here, e.g., redirect to a success page
  };

  const handlePaymentFailure = (error: StripeError) => {
    console.error('Payment failed:', error);
    setProcessing(false);
    // Implement your error handling logic here, e.g., display an error message to the user
  };

  return (
    <StripeProvider>
      <StripeCheckout
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
        isProcessing={processing}
        buttonText="Pay Now"
      />
    </StripeProvider>
  );
}
import React, { useEffect, useState } from 'react';
import { StripeProvider, Elements, Stripe, Loader, ErrorMessage } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

interface Props {
  stripePublishableKey: string;
  message: string;
}

const MyComponent: React.FC<Props> = ({ stripePublishableKey, message }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadStripe(stripePublishableKey)
      .then((stripeInstance) => {
        setStripe(stripeInstance);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, [stripePublishableKey]);

  if (isLoading) {
    return <Loader />;
  }

  if (!stripe) {
    return (
      <div>
        <ErrorMessage error={error} />
        <div>Error: Stripe instance not loaded</div>
      </div>
    );
  }

  return (
    <StripeProvider stripe={stripe}>
      <Elements>
        <div>{message}</div>
        {/* Add Stripe Checkout component here */}
      </Elements>
    </StripeProvider>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import { StripeProvider, Elements, Stripe, Loader, ErrorMessage } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

interface Props {
  stripePublishableKey: string;
  message: string;
}

const MyComponent: React.FC<Props> = ({ stripePublishableKey, message }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadStripe(stripePublishableKey)
      .then((stripeInstance) => {
        setStripe(stripeInstance);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, [stripePublishableKey]);

  if (isLoading) {
    return <Loader />;
  }

  if (!stripe) {
    return (
      <div>
        <ErrorMessage error={error} />
        <div>Error: Stripe instance not loaded</div>
      </div>
    );
  }

  return (
    <StripeProvider stripe={stripe}>
      <Elements>
        <div>{message}</div>
        {/* Add Stripe Checkout component here */}
      </Elements>
    </StripeProvider>
  );
};

export default MyComponent;
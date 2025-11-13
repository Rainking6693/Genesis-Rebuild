import React, { useState, useEffect } from 'react';
import { StripeProvider, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import ErrorMessage from './ErrorMessage';

interface Props {
  stripePublishableKey: string;
  message: string;
  clientSecret?: string;
}

const MyComponent: React.FC<Props> = ({ stripePublishableKey, message, clientSecret }) => {
  const [stripeApiKey, setStripeApiKey] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!stripePublishableKey) return;

    loadStripe(stripePublishableKey).then((stripe) => setStripeApiKey(stripe));
  }, [stripePublishableKey]);

  const handleStripeError = (error: any) => {
    setErrorMessage(error.message);
  };

  if (!stripeApiKey) return <div>Loading...</div>;

  return (
    <StripeProvider apiKey={stripeApiKey}>
      <div>
        <h1>{message}</h1>
        {errorMessage && <ErrorMessage message={errorMessage} />}
        {clientSecret && <Elements options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>}
      </div>
    </StripeProvider>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';
import { StripeProvider, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import ErrorMessage from './ErrorMessage';

interface Props {
  stripePublishableKey: string;
  message: string;
  clientSecret?: string;
}

const MyComponent: React.FC<Props> = ({ stripePublishableKey, message, clientSecret }) => {
  const [stripeApiKey, setStripeApiKey] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!stripePublishableKey) return;

    loadStripe(stripePublishableKey).then((stripe) => setStripeApiKey(stripe));
  }, [stripePublishableKey]);

  const handleStripeError = (error: any) => {
    setErrorMessage(error.message);
  };

  if (!stripeApiKey) return <div>Loading...</div>;

  return (
    <StripeProvider apiKey={stripeApiKey}>
      <div>
        <h1>{message}</h1>
        {errorMessage && <ErrorMessage message={errorMessage} />}
        {clientSecret && <Elements options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>}
      </div>
    </StripeProvider>
  );
};

export default MyComponent;
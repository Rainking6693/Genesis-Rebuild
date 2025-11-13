import React, { FC, useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';

const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27', // Use a specific API version
});

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);
  const [stripeLoaded, setStripeLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Check if the Stripe object is loaded
    stripe.load(() => setStripeLoaded(true));
  }, []);

  const handlePayment = async (amount: number) => {
    if (!stripeLoaded) {
      setError('Stripe.js has not been loaded correctly.');
      return;
    }

    try {
      const paymentIntent = await stripe.createPaymentIntent({
        amount,
        currency: 'usd',
      });

      // Redirect to Checkout or handle the payment intent response
      // ...
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {error && <div role="alert" aria-live="assertive">{error}</div>}
      <div dangerouslySetInnerHTML={{ __html: message }} />
      {stripeLoaded && <button onClick={() => handlePayment(1000)}>Pay</button>}
    </div>
  );
};

MyComponent.defaultProps = {
  message: 'Loading...',
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';

const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27', // Use a specific API version
});

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);
  const [stripeLoaded, setStripeLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Check if the Stripe object is loaded
    stripe.load(() => setStripeLoaded(true));
  }, []);

  const handlePayment = async (amount: number) => {
    if (!stripeLoaded) {
      setError('Stripe.js has not been loaded correctly.');
      return;
    }

    try {
      const paymentIntent = await stripe.createPaymentIntent({
        amount,
        currency: 'usd',
      });

      // Redirect to Checkout or handle the payment intent response
      // ...
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {error && <div role="alert" aria-live="assertive">{error}</div>}
      <div dangerouslySetInnerHTML={{ __html: message }} />
      {stripeLoaded && <button onClick={() => handlePayment(1000)}>Pay</button>}
    </div>
  );
};

MyComponent.defaultProps = {
  message: 'Loading...',
};

export default MyComponent;
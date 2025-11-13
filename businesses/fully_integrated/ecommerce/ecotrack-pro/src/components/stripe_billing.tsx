import React, { FC, useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';

const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27', // Use a specific API version
  // Add timeout for API calls to improve resiliency
  timeout: 10000,
});

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Validate the Stripe API key is present
    if (!stripe.active) {
      setError('Stripe API key is missing or invalid.');
      return;
    }
  }, []);

  const handlePayment = async (amount: number) => {
    if (loading) return;
    setLoading(true);

    try {
      const paymentIntent = await stripe.createPaymentIntent({
        amount,
        currency: 'usd',
      });

      // Redirect to Checkout or handle the payment intent client-side
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {!loading ? (
        <>
          <div dangerouslySetInnerHTML={{ __html: message }} />
          <button onClick={() => handlePayment(1000)}>
            {loading ? 'Loading...' : 'Pay'}
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

MyComponent.defaultProps = {
  message: 'Loading...',
};

export default MyComponent;

// Added a type to the stripe.active property
type StripeActive = boolean | null;

import React, { FC, useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';

const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27', // Use a specific API version
  // Add timeout for API calls to improve resiliency
  timeout: 10000,
});

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Validate the Stripe API key is present
    if (!stripe.active) {
      setError('Stripe API key is missing or invalid.');
      return;
    }
  }, []);

  const handlePayment = async (amount: number) => {
    if (loading) return;
    setLoading(true);

    try {
      const paymentIntent = await stripe.createPaymentIntent({
        amount,
        currency: 'usd',
      });

      // Redirect to Checkout or handle the payment intent client-side
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {!loading ? (
        <>
          <div dangerouslySetInnerHTML={{ __html: message }} />
          <button onClick={() => handlePayment(1000)}>
            {loading ? 'Loading...' : 'Pay'}
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

MyComponent.defaultProps = {
  message: 'Loading...',
};

export default MyComponent;

// Added a type to the stripe.active property
type StripeActive = boolean | null;
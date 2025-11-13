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
    if (stripe) {
      setStripeLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (stripeLoaded) {
      // Check if the Stripe object has loaded successfully
      stripe.empty.then(() => {
        setError('Stripe is not loaded');
      });
    }
  }, [stripeLoaded]);

  const handleBilling = async (amount: number, currency: string) => {
    if (!stripeLoaded) {
      setError('Stripe is not loaded');
      return;
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });

      // Redirect to checkout or handle payment intent client-side
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {error && <div className="error-message">Error: {error}</div>}
      <div id="main-content" dangerouslySetInnerHTML={{ __html: message }} />
      <div id="error-container" className={error ? 'visible' : ''}>
        <div className="error-message">Error: {error}</div>
      </div>
      <button onClick={() => handleBilling(1000, 'usd')}>Billing</button>
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
    if (stripe) {
      setStripeLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (stripeLoaded) {
      // Check if the Stripe object has loaded successfully
      stripe.empty.then(() => {
        setError('Stripe is not loaded');
      });
    }
  }, [stripeLoaded]);

  const handleBilling = async (amount: number, currency: string) => {
    if (!stripeLoaded) {
      setError('Stripe is not loaded');
      return;
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });

      // Redirect to checkout or handle payment intent client-side
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {error && <div className="error-message">Error: {error}</div>}
      <div id="main-content" dangerouslySetInnerHTML={{ __html: message }} />
      <div id="error-container" className={error ? 'visible' : ''}>
        <div className="error-message">Error: {error}</div>
      </div>
      <button onClick={() => handleBilling(1000, 'usd')}>Billing</button>
    </div>
  );
};

MyComponent.defaultProps = {
  message: 'Loading...',
};

export default MyComponent;
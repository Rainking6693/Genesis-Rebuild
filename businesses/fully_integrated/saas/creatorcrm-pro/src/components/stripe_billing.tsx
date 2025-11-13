import React, { FC, useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [stripeApiKey, setStripeApiKey] = useState<string | null>(null);

  useEffect(() => {
    const getStripeApiKey = async () => {
      const apiKey = process.env.REACT_APP_STRIPE_API_KEY;
      if (!apiKey) {
        // Handle the case where the REACT_APP_STRIPE_API_KEY is not set
        console.error('Stripe API key not found in environment variables.');
        return;
      }

      try {
        setStripeApiKey(apiKey);
      } catch (error) {
        console.error('Error setting Stripe API key:', error);
      }
    };

    getStripeApiKey();
  }, []);

  if (!stripeApiKey) {
    return <div>Loading Stripe API key...</div>;
  }

  return (
    <div>
      {/* Add ARIA labels for accessibility */}
      <h1 aria-label="CreatorCRM Pro - Stripe Billing">CreatorCRM Pro - Stripe Billing</h1>
      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <div dangerouslySetInnerHTML={{ __html: message }} aria-label="Message" />
        </Elements>
      )}
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [stripeApiKey, setStripeApiKey] = useState<string | null>(null);

  useEffect(() => {
    const getStripeApiKey = async () => {
      const apiKey = process.env.REACT_APP_STRIPE_API_KEY;
      if (!apiKey) {
        // Handle the case where the REACT_APP_STRIPE_API_KEY is not set
        console.error('Stripe API key not found in environment variables.');
        return;
      }

      try {
        setStripeApiKey(apiKey);
      } catch (error) {
        console.error('Error setting Stripe API key:', error);
      }
    };

    getStripeApiKey();
  }, []);

  if (!stripeApiKey) {
    return <div>Loading Stripe API key...</div>;
  }

  return (
    <div>
      {/* Add ARIA labels for accessibility */}
      <h1 aria-label="CreatorCRM Pro - Stripe Billing">CreatorCRM Pro - Stripe Billing</h1>
      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <div dangerouslySetInnerHTML={{ __html: message }} aria-label="Message" />
        </Elements>
      )}
    </div>
  );
};

export default MyComponent;
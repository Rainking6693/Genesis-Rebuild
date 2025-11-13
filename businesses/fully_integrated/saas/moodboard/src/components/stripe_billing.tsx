import React, { FunctionComponent, useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, ElementsProps } from '@stripe/react-stripe-js';

interface Props extends ElementsProps {
  stripeKey: string;
  message: string;
}

const FunctionalComponent: FunctionComponent<Props> = ({ stripeKey, elements, message }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (stripeKey) {
      Stripe.setApiKey(stripeKey)
        .then(() => {
          setStripeInstance(new Stripe(stripeKey));
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    }
  }, [stripeKey]);

  const handleSubscription = async (event: any) => {
    if (!stripeInstance) return;

    try {
      const { error } = await event.complete();

      if (error) {
        console.error('Error during checkout:', error);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      <Elements options={{ stripe: stripeInstance }} {...{ elements }}>
        {/* Add your subscription checkout form here */}
      </Elements>
      <div>{message}</div>
      {stripeInstance && (
        <div>
          <button onClick={handleSubscription} disabled={!stripeInstance}>Subscribe</button>
        </div>
      )}
    </div>
  );
};

export default FunctionalComponent;

import React, { FunctionComponent, useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, ElementsProps } from '@stripe/react-stripe-js';

interface Props extends ElementsProps {
  stripeKey: string;
  message: string;
}

const FunctionalComponent: FunctionComponent<Props> = ({ stripeKey, elements, message }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (stripeKey) {
      Stripe.setApiKey(stripeKey)
        .then(() => {
          setStripeInstance(new Stripe(stripeKey));
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    }
  }, [stripeKey]);

  const handleSubscription = async (event: any) => {
    if (!stripeInstance) return;

    try {
      const { error } = await event.complete();

      if (error) {
        console.error('Error during checkout:', error);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      <Elements options={{ stripe: stripeInstance }} {...{ elements }}>
        {/* Add your subscription checkout form here */}
      </Elements>
      <div>{message}</div>
      {stripeInstance && (
        <div>
          <button onClick={handleSubscription} disabled={!stripeInstance}>Subscribe</button>
        </div>
      )}
    </div>
  );
};

export default FunctionalComponent;
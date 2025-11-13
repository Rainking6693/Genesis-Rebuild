import React, { useState, useEffect } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, ElementsProps, SubscriptionCreatedEvent } from '@stripe/react-stripe-js';

interface Props {
  stripeKey: string;
  subscriptionPlan: any;
  onSuccess: (subscriptionId: string) => void;
  errorMessage: string;
}

const MyComponent: React.FC<Props> = ({ stripeKey, subscriptionPlan, onSuccess, errorMessage }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (stripeKey) {
      const newStripe = new Stripe(stripeKey, {
        apiVersion: '2020-08-27', // Set the API version for compatibility
      });
      setStripeInstance(newStripe);
    }
  }, [stripeKey]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripeInstance) return;

    setIsLoading(true);

    try {
      const { subscription }: SubscriptionCreatedEvent = await stripeInstance.createSubscription(subscriptionPlan);
      setSubscriptionId(subscription.id);
      onSuccess(subscription.id);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (message: string) => {
    setError(new Error(message));
  };

  const elementsProps: ElementsProps = {
    stripe: stripeInstance,
  };

  const errorMessage = error ? <div role="alert">{error.message}</div> : null;

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="subscriptionId" value={subscriptionId || ''} disabled={isLoading} />
      {errorMessage}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Subscribing...' : 'Subscribe'}
      </button>
      <Elements {...elementsProps} />
    </form>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, ElementsProps, SubscriptionCreatedEvent } from '@stripe/react-stripe-js';

interface Props {
  stripeKey: string;
  subscriptionPlan: any;
  onSuccess: (subscriptionId: string) => void;
  errorMessage: string;
}

const MyComponent: React.FC<Props> = ({ stripeKey, subscriptionPlan, onSuccess, errorMessage }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (stripeKey) {
      const newStripe = new Stripe(stripeKey, {
        apiVersion: '2020-08-27', // Set the API version for compatibility
      });
      setStripeInstance(newStripe);
    }
  }, [stripeKey]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripeInstance) return;

    setIsLoading(true);

    try {
      const { subscription }: SubscriptionCreatedEvent = await stripeInstance.createSubscription(subscriptionPlan);
      setSubscriptionId(subscription.id);
      onSuccess(subscription.id);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (message: string) => {
    setError(new Error(message));
  };

  const elementsProps: ElementsProps = {
    stripe: stripeInstance,
  };

  const errorMessage = error ? <div role="alert">{error.message}</div> : null;

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="subscriptionId" value={subscriptionId || ''} disabled={isLoading} />
      {errorMessage}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Subscribing...' : 'Subscribe'}
      </button>
      <Elements {...elementsProps} />
    </form>
  );
};

export default MyComponent;
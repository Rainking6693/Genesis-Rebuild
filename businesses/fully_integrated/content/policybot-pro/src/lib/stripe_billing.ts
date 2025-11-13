import React, { FC, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Stripe } from '@stripe/stripe-js';

const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY);

const handleError = (error: Error) => {
  console.error(error);
  // Show error message to user
  alert('An error occurred while processing your request. Please try again later.');
};

interface SubscriptionStatus {
  status: string;
}

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);

  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      const customer = await stripe.customers.retrieve('cus_XXXX'); // Replace with your customer ID
      const subscription = await stripe.subscriptions.retrieve(customer.subscriptions.data[0].id); // Replace with your subscription ID
      setSubscriptionStatus({ status: subscription.status });
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  const subscriptionStatusMemo = useMemo(() => subscriptionStatus, [subscriptionStatus]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>{message}</p>
          {subscriptionStatusMemo && (
            <p role="status" aria-live="polite">
              {subscriptionStatusMemo.status}
            </p>
          )}
        </>
      )}
    </div>
  );
};

MyComponent.defaultProps = {
  message: 'Loading...',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export const MemoizedMyComponent = React.memo(MyComponent);

import React, { FC, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Stripe } from '@stripe/stripe-js';

const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY);

const handleError = (error: Error) => {
  console.error(error);
  // Show error message to user
  alert('An error occurred while processing your request. Please try again later.');
};

interface SubscriptionStatus {
  status: string;
}

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);

  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      const customer = await stripe.customers.retrieve('cus_XXXX'); // Replace with your customer ID
      const subscription = await stripe.subscriptions.retrieve(customer.subscriptions.data[0].id); // Replace with your subscription ID
      setSubscriptionStatus({ status: subscription.status });
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  const subscriptionStatusMemo = useMemo(() => subscriptionStatus, [subscriptionStatus]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>{message}</p>
          {subscriptionStatusMemo && (
            <p role="status" aria-live="polite">
              {subscriptionStatusMemo.status}
            </p>
          )}
        </>
      )}
    </div>
  );
};

MyComponent.defaultProps = {
  message: 'Loading...',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export const MemoizedMyComponent = React.memo(MyComponent);
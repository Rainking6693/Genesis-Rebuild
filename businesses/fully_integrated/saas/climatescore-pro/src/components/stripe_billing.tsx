import React, { FC, useEffect, useState } from 'react';

interface Props {
  apiKey: string;
  customerId: string;
  subscriptionId: string;
  message?: string;
  errorMessage?: string;
}

const MyComponent: FC<Props> = ({
  apiKey,
  customerId,
  subscriptionId,
  message,
  errorMessage,
}) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | null>(null);

  useEffect(() => {
    const stripe = Stripe(apiKey);
    let subscription;

    if (customerId && subscriptionId) {
      setStatus('loading');

      stripe.customers.retrieve(customerId, async (err, customer) => {
        if (err) {
          setStatus('error');
          return;
        }

        subscription = customer.subscriptions.retrieve(subscriptionId, async (err, subscription) => {
          if (err) {
            setStatus('error');
            return;
          }

          if (subscription) {
            setStatus('success');
          } else {
            setStatus('error');
          }
        });
      });
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [apiKey, customerId, subscriptionId]);

  return (
    <div>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'success' && <p>{message || 'Subscription successfully retrieved.'}</p>}
      {status === 'error' && <p>{errorMessage || 'An error occurred while retrieving the subscription.'}</p>}
    </div>
  );
};

export default MyComponent;

In this updated code, I've added the following improvements:

1. Added props for `apiKey`, `customerId`, and `subscriptionId` to interact with the Stripe API.
2. Added a `useEffect` hook to fetch the subscription when the component mounts and unmounts.
3. Added a `status` state variable to track the component's current state (idle, loading, success, error).
4. Added error handling for potential issues when retrieving the customer and subscription.
5. Added a `message` prop to display a custom message when the subscription is successfully retrieved.
6. Added an `errorMessage` prop to display an error message when an error occurs while retrieving the subscription.
7. Added loading, success, and error states to the component's UI.
8. Made the component more maintainable by separating the Stripe API calls and error handling.

This updated component now provides a more robust and user-friendly experience for the SaaS business.
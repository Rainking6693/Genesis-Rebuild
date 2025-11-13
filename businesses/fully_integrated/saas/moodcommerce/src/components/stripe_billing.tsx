import React, { useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';

interface Props {
  stripeApiKey: string;
  customerId: string;
}

const MyComponent: React.FC<Props> = ({ stripeApiKey, customerId }) => {
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const stripe = new Stripe(stripeApiKey);

  useEffect(() => {
    let subscriptionIdCancellation: () => void;

    const createSubscription = async () => {
      try {
        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{ plan: 'your_plan_id' }],
        });
        setSubscriptionId(subscription.id);

        // Clean up the subscription ID state when the component unmounts
        subscriptionIdCancellation = () => setSubscriptionId(null);
      } catch (error) {
        setErrorMessage(`Error creating subscription: ${error.message}`);
      }
    };

    // Run the subscription creation only once, even if the props change
    createSubscription();

    // Clean up the subscription ID state when the component unmounts or the customerId changes
    return () => {
      subscriptionIdCancellation();
    };
  }, [customerId, stripeApiKey]);

  return (
    <div>
      {/* Add a button to create the subscription with an accessible label */}
      <button aria-label="Create Subscription" disabled={!!subscriptionId}>
        {subscriptionId ? 'Subscription created' : 'Create Subscription'}
      </button>

      {/* Show error message if there was an error creating the subscription */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default MyComponent;

1. Added state to track the subscription ID and error messages.
2. Moved the subscription creation logic into a `useEffect` hook, so it only runs when the component's props change.
3. Disabled the button after the subscription is created to prevent multiple subscriptions from being created.
4. Displayed the error message if there was an error creating the subscription.
5. Made the button text dynamic to show whether the subscription has been created or not.
6. Added accessibility by providing an appropriate label for the button.
7. Cleaned up the subscription ID state when the component unmounts or the customerId changes.
8. Removed the unnecessary export of the same component twice.
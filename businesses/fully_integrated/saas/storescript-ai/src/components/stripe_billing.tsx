import React, { useEffect, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { Elements, StripeCheckout } from '@stripe/react-stripe-js';
import { Subscription } from '@stripe/stripe-billing-portal';

type Props = {
  stripeApiKey: string;
  options?: Stripe.Checkout.Options;
  children: React.ReactNode;
};

const MyComponent: React.FC<Props> = ({ stripeApiKey, options, children }) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);

  useEffect(() => {
    let stripe: Stripe | null = null;

    const initStripe = async () => {
      try {
        stripe = new Stripe(stripeApiKey);
        setStripeInstance(stripe);
      } catch (error) {
        console.error('Error initializing Stripe:', error);
      }
    };

    if (!stripeInstance) {
      initStripe();
    }

    // Cleanup: Remove the Stripe instance when the component unmounts
    return () => {
      if (stripe) stripe.close();
    };
  }, [stripeApiKey]);

  if (!stripeInstance) {
    return <div>Loading Stripe...</div>;
  }

  return (
    <Elements stripe={stripeInstance}>
      {options && <StripeCheckout {...options}>{children}</StripeCheckout>}
    </Elements>
  );
};

export default MyComponent;

type SubscriptionProps = {
  subscriptionId: string;
};

const MyComponent: React.FC<SubscriptionProps> = ({ subscriptionId }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let stripe: Stripe | null = null;

    const initStripe = async () => {
      try {
        stripe = new Stripe(process.env.REACT_APP_STRIPE_API_KEY);
      } catch (error) {
        console.error('Error initializing Stripe:', error);
        setError(error);
        return;
      }
    };

    if (!subscription && !error) {
      initStripe();

      const getSubscription = async () => {
        try {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          setSubscription(subscription);
        } catch (error) {
          console.error('Error retrieving subscription:', error);
        }
      };

      getSubscription().catch((error) => {
        console.error('Error retrieving subscription:', error);
        setError(error);
      });
    }

    // Cleanup: Remove the Stripe instance when the component unmounts
    return () => {
      if (stripe) stripe.close();
    };
  }, [subscriptionId, error]);

  const handleCancelSubscription = async () => {
    if (isCancelling) return;
    setIsCancelling(true);

    try {
      if (subscription) {
        await subscription.cancel();
        // Handle successful cancellation
      } else {
        console.error('No subscription found to cancel');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div>
      {error && <div>Error initializing Stripe: {error.message}</div>}
      {subscription && (
        <>
          {/* Display subscription details */}
          <div>Subscription ID: {subscription.id}</div>
          <div>Status: {subscription.status}</div>
          <div>Current Period End: {subscription.current_period_end * 1000}</div>
          <button aria-label="Cancel Subscription" onClick={handleCancelSubscription}>
            {isCancelling ? 'Cancelling Subscription...' : 'Cancel Subscription'}
          </button>
        </>
      )}
    </div>
  );
};

export default MyComponent;

In this updated code, I've added the following improvements:

1. Checked if the Stripe instance is already initialized before creating a new one to prevent multiple instances.
2. Added an error state to handle errors during Stripe initialization and subscription retrieval.
3. Checked if a subscription exists before attempting to cancel it.
4. Improved accessibility by providing proper ARIA labels for the cancel button.
5. Added a more descriptive error message when an error occurs during Stripe initialization or subscription retrieval.
6. Added a more descriptive button label based on the `isCancelling` state.
7. Improved maintainability by separating the Stripe initialization logic from the subscription retrieval logic.
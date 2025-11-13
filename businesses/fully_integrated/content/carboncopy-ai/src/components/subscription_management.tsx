import React, { useState, useEffect } from 'react';
import { Subscription } from 'subscriptions-transport-husbandry';
import { isAuthenticated, redirectToLogin } from './auth';

interface Props {
  onSubscribe: (subscription: Subscription) => void;
  onUnsubscribe: (subscription: Subscription) => void;
}

const MyComponent: React.FC<Props> = ({ onSubscribe, onUnsubscribe }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setIsLoading(true);
      const newSubscription = new Subscription({
        // Subscription details such as subscription plan, pricing, etc.
      });

      onSubscribe(newSubscription);
      setSubscription(newSubscription);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const handleUnsubscribe = () => {
    if (!subscription) return;

    // Confirm unsubscribe action with user
    // Stop the subscription
    onUnsubscribe(subscription);
    setSubscription(null);
  };

  return (
    <div>
      <button aria-label="Subscribe" onClick={handleSubscribe} disabled={!isAuthenticated() || isLoading}>
        {isLoading ? 'Subscribing...' : 'Subscribe'}
      </button>
      {subscription && (
        <>
          <p aria-label="Current Subscription">Current Subscription: {subscription.plan}</p>
          <button aria-label="Unsubscribe" onClick={handleUnsubscribe}>
            Unsubscribe
          </button>
        </>
      )}
    </div>
  );
};

export default MyComponent;

Changes made:

1. Added a `useEffect` hook to handle the subscription creation when the user is authenticated. This ensures that the subscription is created only once when the component mounts.
2. Added a `isLoading` state to show a loading state while the subscription is being created.
3. Moved the subscription creation logic outside the UI rendering for better maintainability.
4. Improved accessibility by adding ARIA labels to the buttons.
5. Made the code more maintainable by separating the subscription creation and handling from the UI rendering.
6. Added a check for the subscription before unsubscribing to prevent errors.
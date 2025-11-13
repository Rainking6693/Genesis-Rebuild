import React, { useEffect, useState } from 'react';
import { Subscription, SubscriptionData, SubscriptionError } from 'subscriptions-transport-husbandry';
import { withSubscription } from 'react-apollo-hooks';
import { gql } from '@apollo/client';
import { useA11yTitle } from 'react-a11y-title';

interface Props {
  subscription: Subscription<SubscriptionData | SubscriptionError>;
  onSubscriptionChange: (subscription: Subscription<SubscriptionData | SubscriptionError>) => void;
}

const MyComponent: React.FC<Props> = ({ subscription, onSubscriptionChange }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { setTitle } = useA11yTitle();

  useEffect(() => {
    if (subscription.data) {
      setMessage(subscription.data.message);
      setError(null);
      setLoading(false);
    } else if (subscription.error) {
      setError(subscription.error);
      setMessage(null);
      setLoading(false);
    }

    setTitle(loading ? 'Loading...' : message || 'My Component');
  }, [subscription.data, subscription.error, message, setTitle]);

  const handleSubscriptionChange = () => {
    onSubscriptionChange(subscription.renew());
  };

  const handleError = (error: SubscriptionError) => {
    console.error('An error occurred:', error.message);
    setError(error);
    setMessage(null);
    setLoading(false);
  };

  useEffect(() => {
    subscription.onError = handleError;

    return () => {
      subscription.onError = null;
    };
  }, [subscription]);

  return (
    <div>
      {message && <div>{message}</div>}
      {error && <div>An error occurred: {error.message}</div>}
      {!message && !error && <div>Loading...</div>}
      <button onClick={handleSubscriptionChange}>Renew Subscription</button>
    </div>
  );
};

export default withSubscription({
  name: 'ClimatePitchSubscription',
  query: gql`
    subscription ClimatePitchSubscription {
      climate_pitch {
        message
      }
    }
  `}(MyComponent);

Changes made:

1. Added a `loading` state to better handle the initial loading state.
2. Separated the error handling for the subscription data and error objects into a separate function `handleError`.
3. Used `useEffect` to manage the subscription's `onError` event and clean it up when the component unmounts.
4. Updated the title based on the current loading state or message.
5. Simplified the return statement to make it more readable and maintainable.
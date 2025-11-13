import React, { useEffect, useState } from 'react';
import { useSubscription } from '@ecoflow/subscription-service';
import { useRef } from 'react';

interface Props {
  subscriptionId: string;
}

const loadingMessageId = 'loading-message';
const subscriptionErrorMessageId = 'subscription-error-message';

const useSubscriptionData = (subscriptionId: string) => {
  const subscription = useSubscription(subscriptionId);
  const subscriptionIdCancellation = useRef<() => void | undefined>(undefined);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!subscription) return;

    subscriptionIdCancellation.current = subscription.subscribe((data) => {
      setMessage(data);
      setIsLoading(false);
    });

    return () => {
      subscriptionIdCancellation.current?.();
    };
  }, [subscriptionId, subscription]);

  return { message, isLoading, error };
};

const MyComponent: React.FC<Props> = ({ subscriptionId }) => {
  const { message, isLoading, error } = useSubscriptionData(subscriptionId);
  const [loading, setLoading] = useState(isLoading);
  const [hasError, setHasError] = useState(!!error);
  const loadingClassName = hasError ? 'error' : '';
  const errorClassName = hasError ? '' : 'hidden';

  const loadingStyle = {
    ...(loading && { display: 'block' }),
  };

  const errorStyle = {
    ...(hasError && { display: 'block' }),
  };

  useEffect(() => {
    setLoading(isLoading);
    setHasError(!!error);
  }, [isLoading, error]);

  const reload = () => {
    window.location.reload();
  };

  return (
    <div data-testid="subscription-component" className={loadingClassName}>
      <h1 id={loadingMessageId} style={loadingStyle}>
        {loading ? 'Loading...' : message}
      </h1>
      <h2 id={subscriptionErrorMessageId} style={errorStyle}>
        {hasError ? (
          <>
            Error: {error?.message}
            <br />
            <a href="#" onClick={reload}>
              Reload
            </a>
          </>
        ) : null}
      </h2>
    </div>
  );
};

export default MyComponent;
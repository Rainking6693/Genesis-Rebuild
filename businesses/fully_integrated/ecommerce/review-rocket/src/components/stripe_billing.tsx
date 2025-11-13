import React, { useState, useCallback, useEffect } from 'react';

interface BillingComponentProps {
  planName: string;
  planDescription: string;
  price: number;
  currency: string;
  stripeProductId: string;
  onSubscribe: (productId: string) => Promise<void>;
  onError?: (error: Error) => void;
}

/**
 * BillingComponent: Displays a billing plan and handles subscription initiation.
 *
 * This component presents a billing plan's details (name, description, price) and
 * includes a button to subscribe to the plan.  It uses the Stripe Product ID to
 * initiate the subscription process via the `onSubscribe` callback.
 */
const BillingComponent: React.FC<BillingComponentProps> = ({
  planName,
  planDescription,
  price,
  currency,
  stripeProductId,
  onSubscribe,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset error state when the component props change
    setError(null);
  }, [planName, planDescription, price, currency, stripeProductId]);

  const handleSubscribeClick = useCallback(async () => {
    try {
      setIsLoading(true);
      await onSubscribe(stripeProductId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [onSubscribe, stripeProductId, onError]);

  return (
    <div className="billing-plan">
      <h3>{planName}</h3>
      <p>{planDescription}</p>
      <p>
        Price: {currency}
        {price.toFixed(2)}
      </p>
      <button
        onClick={handleSubscribeClick}
        disabled={isLoading}
        aria-label={`Subscribe to the ${planName} plan`}
      >
        {isLoading ? 'Loading...' : 'Subscribe'}
      </button>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default BillingComponent;

import React, { useState, useCallback, useEffect } from 'react';

interface BillingComponentProps {
  planName: string;
  planDescription: string;
  price: number;
  currency: string;
  stripeProductId: string;
  onSubscribe: (productId: string) => Promise<void>;
  onError?: (error: Error) => void;
}

/**
 * BillingComponent: Displays a billing plan and handles subscription initiation.
 *
 * This component presents a billing plan's details (name, description, price) and
 * includes a button to subscribe to the plan.  It uses the Stripe Product ID to
 * initiate the subscription process via the `onSubscribe` callback.
 */
const BillingComponent: React.FC<BillingComponentProps> = ({
  planName,
  planDescription,
  price,
  currency,
  stripeProductId,
  onSubscribe,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset error state when the component props change
    setError(null);
  }, [planName, planDescription, price, currency, stripeProductId]);

  const handleSubscribeClick = useCallback(async () => {
    try {
      setIsLoading(true);
      await onSubscribe(stripeProductId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [onSubscribe, stripeProductId, onError]);

  return (
    <div className="billing-plan">
      <h3>{planName}</h3>
      <p>{planDescription}</p>
      <p>
        Price: {currency}
        {price.toFixed(2)}
      </p>
      <button
        onClick={handleSubscribeClick}
        disabled={isLoading}
        aria-label={`Subscribe to the ${planName} plan`}
      >
        {isLoading ? 'Loading...' : 'Subscribe'}
      </button>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default BillingComponent;
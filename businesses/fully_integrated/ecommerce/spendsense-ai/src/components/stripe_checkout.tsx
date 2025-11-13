import React, { useState, useEffect } from 'react';

interface Props {
  name: string;
  stripePublicKey?: string;
  customerId?: string;
  sessionId?: string;
  error?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const MyComponent: React.FC<Props> = ({
  name,
  stripePublicKey,
  customerId,
  sessionId,
  error,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stripePublicKey) {
      console.error('Missing Stripe public key');
      return;
    }

    if (customerId && sessionId) {
      console.error('Both customerId and sessionId provided');
      return;
    }

    if (!customerId && !sessionId) {
      console.error('Either customerId or sessionId is required');
      return;
    }

    // Initialize Stripe
    const stripe = Stripe(stripePublicKey);

    if (customerId) {
      stripe.customers.retrieve(customerId, ({ customer }) => {
        if (customer) {
          // Redirect to customer's page or perform other actions
          if (onSuccess) onSuccess();
        } else {
          // Handle error case
          if (onError) onError(new Error('Customer not found'));
        }
      });
    } else {
      stripe.redirectToCheckout({ sessionId }).then(() => {
        if (onSuccess) onSuccess();
      }).catch((error) => {
        if (onError) onError(error);
      });
    }

    setLoading(false);
  }, [stripePublicKey, customerId, sessionId, onSuccess, onError]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>Hello, {name}!</h1>
          {error && <p>Error: {error.message}</p>}
        </>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';

interface Props {
  name: string;
  stripePublicKey?: string;
  customerId?: string;
  sessionId?: string;
  error?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const MyComponent: React.FC<Props> = ({
  name,
  stripePublicKey,
  customerId,
  sessionId,
  error,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stripePublicKey) {
      console.error('Missing Stripe public key');
      return;
    }

    if (customerId && sessionId) {
      console.error('Both customerId and sessionId provided');
      return;
    }

    if (!customerId && !sessionId) {
      console.error('Either customerId or sessionId is required');
      return;
    }

    // Initialize Stripe
    const stripe = Stripe(stripePublicKey);

    if (customerId) {
      stripe.customers.retrieve(customerId, ({ customer }) => {
        if (customer) {
          // Redirect to customer's page or perform other actions
          if (onSuccess) onSuccess();
        } else {
          // Handle error case
          if (onError) onError(new Error('Customer not found'));
        }
      });
    } else {
      stripe.redirectToCheckout({ sessionId }).then(() => {
        if (onSuccess) onSuccess();
      }).catch((error) => {
        if (onError) onError(error);
      });
    }

    setLoading(false);
  }, [stripePublicKey, customerId, sessionId, onSuccess, onError]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>Hello, {name}!</h1>
          {error && <p>Error: {error.message}</p>}
        </>
      )}
    </div>
  );
};

export default MyComponent;
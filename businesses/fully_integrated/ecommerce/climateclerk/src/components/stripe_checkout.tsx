import React, { useState, useEffect } from 'react';

interface Props {
  stripePublishableKey: string;
  amount: number;
  currency: string;
  description: string;
  onSuccess: (stripeToken: string) => void;
  onError: (error: Error) => void;
}

const MyComponent: React.FC<Props> = ({
  stripePublishableKey,
  amount,
  currency,
  description,
  onSuccess,
  onError,
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (!stripePublishableKey) {
      console.error('Missing Stripe publishable key');
      onError(new Error('Missing Stripe publishable key'));
      return;
    }

    // Simulate fetching the client secret from your server
    const clientSecretGenerated = Math.random().toString();
    setClientSecret(clientSecretGenerated);
  }, [stripePublishableKey]);

  const handleCheckout = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!clientSecret) {
      console.error('Missing client secret');
      onError(new Error('Missing client secret'));
      return;
    }

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        description,
        clientSecret,
      }),
    });

    if (!response.ok) {
      const error = new Error('Failed to create checkout session');
      onError(error);
      return;
    }

    const data = await response.json();
    onSuccess(data.stripeToken);
  };

  if (!clientSecret) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleCheckout}>
      <div>
        <label htmlFor="stripe-element">Payment</label>
        {/* Stripe.js will replace this div with the actual Stripe Element */}
        <div id="stripe-element" />
      </div>
      <button type="submit" disabled={!clientSecret}>
        Pay {amount} {currency}
      </button>
    </form>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';

interface Props {
  stripePublishableKey: string;
  amount: number;
  currency: string;
  description: string;
  onSuccess: (stripeToken: string) => void;
  onError: (error: Error) => void;
}

const MyComponent: React.FC<Props> = ({
  stripePublishableKey,
  amount,
  currency,
  description,
  onSuccess,
  onError,
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (!stripePublishableKey) {
      console.error('Missing Stripe publishable key');
      onError(new Error('Missing Stripe publishable key'));
      return;
    }

    // Simulate fetching the client secret from your server
    const clientSecretGenerated = Math.random().toString();
    setClientSecret(clientSecretGenerated);
  }, [stripePublishableKey]);

  const handleCheckout = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!clientSecret) {
      console.error('Missing client secret');
      onError(new Error('Missing client secret'));
      return;
    }

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        description,
        clientSecret,
      }),
    });

    if (!response.ok) {
      const error = new Error('Failed to create checkout session');
      onError(error);
      return;
    }

    const data = await response.json();
    onSuccess(data.stripeToken);
  };

  if (!clientSecret) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleCheckout}>
      <div>
        <label htmlFor="stripe-element">Payment</label>
        {/* Stripe.js will replace this div with the actual Stripe Element */}
        <div id="stripe-element" />
      </div>
      <button type="submit" disabled={!clientSecret}>
        Pay {amount} {currency}
      </button>
    </form>
  );
};

export default MyComponent;
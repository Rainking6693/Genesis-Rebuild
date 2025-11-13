import React, { useEffect, useState } from 'react';

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
  const [loading, setLoading] = useState(false);
  const [stripe, setStripe] = useState<any>(null);

  useEffect(() => {
    if (!stripePublishableKey || !stripe) return;

    const script = document.createElement('script');
    script.src = `https://js.stripe.com/v3/`;
    script.onload = () => {
      setStripe(Stripe(stripePublishableKey));
    };
    script.onerror = () => {
      onError(new Error('Failed to load Stripe script.'));
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [stripePublishableKey]);

  const handleCheckout = async () => {
    if (!stripe) return;

    setLoading(true);

    try {
      const token = await stripe.createToken({ name: 'Ecommerce User' });

      if (token.error) {
        onError(new Error(token.error.message));
      } else {
        onSuccess(token.token.id);
      }
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h2>Checkout</h2>
          <p>{description}</p>
          <button disabled={!stripe} onClick={handleCheckout}>
            Pay {amount} {currency}
          </button>
        </div>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';

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
  const [loading, setLoading] = useState(false);
  const [stripe, setStripe] = useState<any>(null);

  useEffect(() => {
    if (!stripePublishableKey || !stripe) return;

    const script = document.createElement('script');
    script.src = `https://js.stripe.com/v3/`;
    script.onload = () => {
      setStripe(Stripe(stripePublishableKey));
    };
    script.onerror = () => {
      onError(new Error('Failed to load Stripe script.'));
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [stripePublishableKey]);

  const handleCheckout = async () => {
    if (!stripe) return;

    setLoading(true);

    try {
      const token = await stripe.createToken({ name: 'Ecommerce User' });

      if (token.error) {
        onError(new Error(token.error.message));
      } else {
        onSuccess(token.token.id);
      }
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h2>Checkout</h2>
          <p>{description}</p>
          <button disabled={!stripe} onClick={handleCheckout}>
            Pay {amount} {currency}
          </button>
        </div>
      )}
    </div>
  );
};

export default MyComponent;
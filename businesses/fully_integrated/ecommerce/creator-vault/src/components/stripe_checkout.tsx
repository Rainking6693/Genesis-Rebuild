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
    if (!stripePublishableKey) {
      onError(new Error('Stripe publishable key is missing.'));
      return;
    }

    if (!window.document.createElement('script').constructor) {
      onError(new Error('Modern browser is required.'));
      return;
    }

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
    if (!stripe) {
      onError(new Error('Stripe object not initialized.'));
      return;
    }

    setLoading(true);

    try {
      const result = await stripe.redirectToCheckout({
        amount: amount * 100,
        currency,
        description,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });

      onSuccess(result.payment_intent_client_secret);
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
        <button onClick={handleCheckout}>Checkout</button>
      )}
    </div>
  );
};

export default MyComponent;

This updated component now accepts the Stripe publishable key, amount, currency, description, and callback functions for success and error. It also handles the following:

1. Checks if the Stripe publishable key and modern browser are provided.
2. Loads the Stripe script asynchronously.
3. Initializes the Stripe object when the script is loaded.
4. Handles the checkout process and sets the loading state accordingly.
5. Provides a loading state while checking out.
6. Improves accessibility by providing a button for the checkout process.
import React, { useState, useEffect } from 'react';

interface Props {
  stripePublicKey: string;
  productId: string;
  successUrl: string;
  cancelUrl: string;
  amount: number;
  currency: string;
  email: string;
}

const MyComponent: React.FC<Props> = ({
  stripePublicKey,
  productId,
  successUrl,
  cancelUrl,
  amount,
  currency,
  email,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stripePublicKey) {
      setError('Stripe public key is missing.');
      return;
    }
  }, [stripePublicKey]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripe.load(stripePublicKey);
      const checkoutSession = await stripe.checkout.sessions.create({
        line_items: [{ price_data: { product_data: { product_id }, amount, currency } }],
        payment_method_types: ['card'],
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: email,
      });

      await stripe.redirectToCheckout({ sessionId: checkoutSession.id });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button disabled={loading} onClick={handleCheckout}>
        Checkout ({loading ? 'Loading...' : 'Pay Now'})
      </button>
    </div>
  );
};

export default MyComponent;

In this updated component, I added the following improvements:

1. Added props for Stripe public key, product ID, success URL, cancel URL, amount, currency, and email.
2. Used the `useState` and `useEffect` hooks to manage state and side effects.
3. Loaded the Stripe library and created a checkout session when the checkout button is clicked.
4. Handled errors during the checkout process and displayed an error message to the user.
5. Added a loading state to disable the checkout button while the checkout process is in progress.
6. Improved accessibility by adding an error message container with a class name "error".
7. Made the component more maintainable by separating the checkout logic from the rendering logic.
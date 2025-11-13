import React, { useState, useEffect } from 'react';

interface Props {
  message: string;
  stripePublicKey: string;
  productId: string;
  successUrl: string;
  cancelUrl: string;
  amount: number;
  currency: string;
  email: string;
}

const MyComponent: React.FC<Props> = ({
  message,
  stripePublicKey,
  productId,
  successUrl,
  cancelUrl,
  amount,
  currency,
  email,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stripePublicKey) {
      setError('Stripe public key is missing.');
      return;
    }
  }, [stripePublicKey]);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      const stripe = (window as any).Stripe(stripePublicKey);
      const checkoutSession = await stripe.checkout.session.create({
        line_items: [{ price_data: { product_data: { product_id }, unit_amount: amount * 100, currency } }],
        payment_method_types: ['card'],
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: email,
      });

      await stripe.redirectToCheckout({ sessionId: checkoutSession.id });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div>{message}</div>
      {stripePublicKey && (
        <button onClick={handleCheckout} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Checkout'}
        </button>
      )}
    </div>
  );
};

export default MyComponent;

In this updated component, I've added the following improvements:

1. Added props for stripePublicKey, productId, successUrl, cancelUrl, amount, currency, and email.
2. Checked if the stripePublicKey is provided before creating the checkout session to handle edge cases.
3. Added loading state and error handling for a smoother user experience.
4. Added a button for the checkout process with proper disabled state management.
5. Added an error class for styling the error messages.
6. Used the `any` type for the window object to avoid TypeScript complaining about the Stripe global variable.

This updated component should provide a more robust and accessible Stripe Checkout experience for your ecommerce business.
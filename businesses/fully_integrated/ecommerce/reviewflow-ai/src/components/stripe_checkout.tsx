import React, { useState, useEffect } from 'react';

interface Props {
  message: string;
  stripePublicKey: string;
  stripeProductId: string;
  amount: number;
  currency: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const MyComponent: React.FC<Props> = ({
  message,
  stripePublicKey,
  stripeProductId,
  amount,
  currency,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stripePublicKey || !stripeProductId || !amount || !currency) {
      onError(new Error('Missing required props'));
      return;
    }

    const stripe = Stripe(stripePublicKey);

    async function handleCheckout() {
      try {
        setLoading(true);
        const checkoutSession = await stripe.checkout.session.create({
          line_items: [{ price_data: { currency, product_data: { name: 'Product Name', description: 'Product Description' }, unit_amount: amount * 100 } ] },
          mode: 'payment',
          success_url: window.location.origin,
          cancel_url: window.location.origin + '/checkout-canceled',
          customer_creation_options: { name: 'Customer Name' },
          metadata: { order_id: new Date().getTime() },
          payment_method_types: ['card'],
          setup_future_usage: 'off_session',
          allow_promotion_codes: false,
          localization: {
            label_options: {
              button_text: 'Pay Now',
            },
          },
        });

        stripe.redirectToCheckout({ sessionId: checkoutSession.id });
      } catch (error) {
        onError(error);
      } finally {
        setLoading(false);
      }
    }

    if (stripe) {
      handleCheckout();
    }
  }, [stripePublicKey, stripeProductId, amount, currency, onSuccess, onError]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h2>{message}</h2>
          {/* Add a button with ARIA attributes for accessibility */}
          <button aria-label="Pay Now" disabled={!stripe}>
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
};

export default MyComponent;

This updated component now accepts additional props for Stripe's required parameters, checks for missing props, and handles the checkout process using Stripe's `checkout.session.create` method. It also adds a loading state and a button with ARIA attributes for improved accessibility. The component is more maintainable as it follows best practices for handling asynchronous operations and error handling.
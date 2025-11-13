import React, { useState, useEffect } from 'react';

interface Props {
  // Add a new prop for the Stripe public key
  stripePublicKey: string;
  // Add a new prop for the product details
  productDetails: {
    id: string;
    name: string;
    price: number;
    currency: string;
  };
  // Add a new prop for the checkout session id (optional)
  checkoutSessionId?: string;
  // Add a new prop for the error message (optional)
  errorMessage?: string;
  // Add a new prop for the loading state (optional)
  isLoading?: boolean;
}

const MyComponent: React.FC<Props> = ({
  stripePublicKey,
  productDetails,
  checkoutSessionId,
  errorMessage,
  isLoading = false,
}) => {
  const [sessionId, setSessionId] = useState<string | null>(checkoutSessionId);

  useEffect(() => {
    if (checkoutSessionId) {
      setSessionId(checkoutSessionId);
    }
  }, [checkoutSessionId]);

  const handleCheckout = async () => {
    // Initialize Stripe
    const stripe = (window as any).Stripe(stripePublicKey);

    // Create a checkout session
    const checkoutSession = await stripe.checkout.session.create({
      // Add the product details to the checkout session
      line_items: [
        {
          price_data: {
            currency: productDetails.currency,
            product_data: {
              name: productDetails.name,
            },
            unit_amount: productDetails.price * 100, // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      // Customize the checkout appearance
      appearance: {
        theme: 'stripe',
      },
      // Redirect the user after the checkout is complete
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    });

    setSessionId(checkoutSession.id);
  };

  return (
    <div>
      {/* Show the error message if there's one */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Show the loading state if it's true */}
      {isLoading && <p>Loading...</p>}

      {/* Show the checkout button if a sessionId is available */}
      {sessionId && (
        <div>
          <p>Total: {productDetails.price} {productDetails.currency}</p>
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      )}
    </div>
  );
};

export default MyComponent;

This updated component now accepts a `stripePublicKey` prop, which is required for initializing Stripe. It also accepts a `productDetails` prop, which contains the product's ID, name, price, and currency. The component checks if the checkout session ID is provided and sets it accordingly. It also handles the loading state and error messages. The checkout button is only shown if a valid session ID is available.
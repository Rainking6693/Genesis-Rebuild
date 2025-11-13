// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';

interface StripeCheckoutProps {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, successUrl, cancelUrl }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This effect will only run once, on component mount
    // to load stripe.js
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => {
      // Stripe is loaded, but we don't initialize it here.
      // Initialization happens when the button is clicked.
    };
    script.onerror = () => {
      setError('Failed to load Stripe.js');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch Stripe public key from environment variable (ideally from backend)
      const response = await fetch('/api/get-stripe-public-key'); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error(`Failed to fetch Stripe public key: ${response.status}`);
      }
      const data = await response.json();
      const stripePublicKey = data.publicKey;

      if (!stripePublicKey) {
        throw new Error('Stripe public key not found.');
      }

      const stripe = (window as any).Stripe(stripePublicKey); // Initialize Stripe

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        successUrl: successUrl,
        cancelUrl: cancelUrl,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      console.error('Stripe Checkout Error:', err);
      setError(err.message || 'An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Processing...' : 'Checkout with Stripe'}
      </button>
    </div>
  );
};

export default StripeCheckout;

// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';

interface StripeCheckoutProps {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, successUrl, cancelUrl }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This effect will only run once, on component mount
    // to load stripe.js
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => {
      // Stripe is loaded, but we don't initialize it here.
      // Initialization happens when the button is clicked.
    };
    script.onerror = () => {
      setError('Failed to load Stripe.js');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch Stripe public key from environment variable (ideally from backend)
      const response = await fetch('/api/get-stripe-public-key'); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error(`Failed to fetch Stripe public key: ${response.status}`);
      }
      const data = await response.json();
      const stripePublicKey = data.publicKey;

      if (!stripePublicKey) {
        throw new Error('Stripe public key not found.');
      }

      const stripe = (window as any).Stripe(stripePublicKey); // Initialize Stripe

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        successUrl: successUrl,
        cancelUrl: cancelUrl,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      console.error('Stripe Checkout Error:', err);
      setError(err.message || 'An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Processing...' : 'Checkout with Stripe'}
      </button>
    </div>
  );
};

export default StripeCheckout;

Now, I will use the `Write` tool to create the file:

Finally, I will output the build report:
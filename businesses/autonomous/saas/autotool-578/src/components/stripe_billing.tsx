// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  return (
    <Elements stripe={stripePromise}>
      <BillingForm customerId={customerId} />
    </Elements>
  );
};

interface BillingFormProps {
  customerId: string;
}

const BillingForm: React.FC<BillingFormProps> = ({ customerId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch('/api/create-setup-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerId }),
        });

        if (!response.ok) {
          throw new Error(`Failed to create setup intent: ${response.status}`);
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch client secret.');
      }
    };

    fetchClientSecret();
  }, [customerId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError("Stripe.js hasn't loaded yet.");
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element not found.");
      setLoading(false);
      return;
    }

    try {
      const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Customer Name', // Replace with actual customer name
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || 'Failed to confirm card setup.');
      } else if (setupIntent && setupIntent.status === 'succeeded') {
        // Payment method successfully attached to customer
        console.log('Payment method attached:', setupIntent.payment_method);
        // Optionally, update the UI or redirect the user
        alert('Payment method successfully updated!');
      } else {
        setError('Unexpected error occurred during card setup.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <label>
        Card details
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </label>
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Updating...' : 'Update Payment Method'}
      </button>
    </form>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  return (
    <Elements stripe={stripePromise}>
      <BillingForm customerId={customerId} />
    </Elements>
  );
};

interface BillingFormProps {
  customerId: string;
}

const BillingForm: React.FC<BillingFormProps> = ({ customerId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch('/api/create-setup-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerId }),
        });

        if (!response.ok) {
          throw new Error(`Failed to create setup intent: ${response.status}`);
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch client secret.');
      }
    };

    fetchClientSecret();
  }, [customerId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError("Stripe.js hasn't loaded yet.");
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element not found.");
      setLoading(false);
      return;
    }

    try {
      const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Customer Name', // Replace with actual customer name
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || 'Failed to confirm card setup.');
      } else if (setupIntent && setupIntent.status === 'succeeded') {
        // Payment method successfully attached to customer
        console.log('Payment method attached:', setupIntent.payment_method);
        // Optionally, update the UI or redirect the user
        alert('Payment method successfully updated!');
      } else {
        setError('Unexpected error occurred during card setup.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <label>
        Card details
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </label>
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Updating...' : 'Update Payment Method'}
      </button>
    </form>
  );
};

export default StripeBilling;
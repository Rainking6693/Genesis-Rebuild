// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface BillingDetails {
  name: string;
  email: string;
  address: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

interface SubscriptionStatus {
  status: 'active' | 'inactive' | 'trialing' | 'canceled';
  current_period_end: number | null; // Timestamp
}

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    name: '',
    email: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js is loaded.
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("Card Element not found.");
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails,
      });

      if (error) {
        setError(error.message || "An unexpected error occurred.");
        setProcessing(false);
        return;
      }

      // Call your backend to create a subscription with the payment method
      const response = await fetch('/api/create-subscription', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethod: paymentMethod.id, billingDetails }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        // Subscription created successfully
        console.log('Subscription created:', data);
        // Redirect or update UI as needed
      }

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={billingDetails.name}
          onChange={(e) => setBillingDetails({...billingDetails, name: e.target.value})}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={billingDetails.email}
          onChange={(e) => setBillingDetails({...billingDetails, email: e.target.value})}
        />
      </label>
      {/* Add more billing details fields as needed */}
      <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={processing || !stripe || !elements}>
        {processing ? 'Processing...' : 'Subscribe'}
      </button>
    </form>
  );
};

const StripeBilling = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface BillingDetails {
  name: string;
  email: string;
  address: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

interface SubscriptionStatus {
  status: 'active' | 'inactive' | 'trialing' | 'canceled';
  current_period_end: number | null; // Timestamp
}

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    name: '',
    email: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js is loaded.
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("Card Element not found.");
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails,
      });

      if (error) {
        setError(error.message || "An unexpected error occurred.");
        setProcessing(false);
        return;
      }

      // Call your backend to create a subscription with the payment method
      const response = await fetch('/api/create-subscription', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethod: paymentMethod.id, billingDetails }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        // Subscription created successfully
        console.log('Subscription created:', data);
        // Redirect or update UI as needed
      }

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={billingDetails.name}
          onChange={(e) => setBillingDetails({...billingDetails, name: e.target.value})}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={billingDetails.email}
          onChange={(e) => setBillingDetails({...billingDetails, email: e.target.value})}
        />
      </label>
      {/* Add more billing details fields as needed */}
      <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={processing || !stripe || !elements}>
        {processing ? 'Processing...' : 'Subscribe'}
      </button>
    </form>
  );
};

const StripeBilling = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeBilling;
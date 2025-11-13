// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface SubscriptionStatus {
  status: 'active' | 'inactive' | 'trialing' | 'canceled';
  current_period_end: number | null;
}

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({ status: 'inactive', current_period_end: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/stripe/subscription-status?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching subscription status.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [customerId]);

  if (loading) {
    return <div>Loading subscription status...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscription Status</h2>
      <p>Status: {subscriptionStatus.status}</p>
      {subscriptionStatus.status === 'active' && (
        <p>Current Period End: {new Date(subscriptionStatus.current_period_end! * 1000).toLocaleDateString()}</p>
      )}
      <PaymentForm customerId={customerId} setSubscriptionStatus={setSubscriptionStatus} />
    </div>
  );
};

interface PaymentFormProps {
  customerId: string;
  setSubscriptionStatus: (status: SubscriptionStatus) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ customerId, setSubscriptionStatus }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js is loaded.
      return;
    }

    setProcessing(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setPaymentError("Card details are missing.");
      setProcessing(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setPaymentError(error.message || "Payment method creation failed.");
        setProcessing(false);
        return;
      }

      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          paymentMethodId: paymentMethod.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Subscription creation failed: ${response.status}`);
      }

      const data = await response.json();
      setSubscriptionStatus({ status: 'active', current_period_end: data.current_period_end }); // Assuming the API returns the updated status
      alert("Subscription created successfully!");

    } catch (err: any) {
      setPaymentError(err.message || "An unexpected error occurred during subscription creation.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Card details
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </label>
      {paymentError && <div style={{ color: 'red' }}>{paymentError}</div>}
      <button type="submit" disabled={!stripe || processing}>
        {processing ? 'Processing...' : 'Subscribe'}
      </button>
    </form>
  );
};

const StripeBillingWrapper: React.FC<StripeBillingProps> = ({ customerId }) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeBilling customerId={customerId} />
    </Elements>
  );
};

export default StripeBillingWrapper;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface SubscriptionStatus {
  status: 'active' | 'inactive' | 'trialing' | 'canceled';
  current_period_end: number | null;
}

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({ status: 'inactive', current_period_end: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/stripe/subscription-status?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching subscription status.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [customerId]);

  if (loading) {
    return <div>Loading subscription status...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscription Status</h2>
      <p>Status: {subscriptionStatus.status}</p>
      {subscriptionStatus.status === 'active' && (
        <p>Current Period End: {new Date(subscriptionStatus.current_period_end! * 1000).toLocaleDateString()}</p>
      )}
      <PaymentForm customerId={customerId} setSubscriptionStatus={setSubscriptionStatus} />
    </div>
  );
};

interface PaymentFormProps {
  customerId: string;
  setSubscriptionStatus: (status: SubscriptionStatus) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ customerId, setSubscriptionStatus }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.  Make sure to disable
      // form submission until Stripe.js is loaded.
      return;
    }

    setProcessing(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setPaymentError("Card details are missing.");
      setProcessing(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setPaymentError(error.message || "Payment method creation failed.");
        setProcessing(false);
        return;
      }

      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          paymentMethodId: paymentMethod.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Subscription creation failed: ${response.status}`);
      }

      const data = await response.json();
      setSubscriptionStatus({ status: 'active', current_period_end: data.current_period_end }); // Assuming the API returns the updated status
      alert("Subscription created successfully!");

    } catch (err: any) {
      setPaymentError(err.message || "An unexpected error occurred during subscription creation.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Card details
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </label>
      {paymentError && <div style={{ color: 'red' }}>{paymentError}</div>}
      <button type="submit" disabled={!stripe || processing}>
        {processing ? 'Processing...' : 'Subscribe'}
      </button>
    </form>
  );
};

const StripeBillingWrapper: React.FC<StripeBillingProps> = ({ customerId }) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeBilling customerId={customerId} />
    </Elements>
  );
};

export default StripeBillingWrapper;
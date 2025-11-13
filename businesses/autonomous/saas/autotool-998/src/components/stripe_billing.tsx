// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from '@stripe/stripe-js';

interface BillingInfo {
  plan: string;
  paymentMethod: string;
  nextPaymentDate: string;
}

interface StripeBillingProps {
  stripePublicKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripePublicKey, customerId }) => {
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await Stripe(stripePublicKey);
        setStripe(stripeInstance);
      } catch (err: any) {
        setError(`Failed to initialize Stripe: ${err.message}`);
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  useEffect(() => {
    const fetchBillingInfo = async () => {
      if (!stripe) return;

      setLoading(true);
      try {
        // Simulate fetching billing info from backend
        const response = await fetch(`/api/billing/${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBillingInfo(data);
      } catch (err: any) {
        setError(`Failed to fetch billing information: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (stripe) {
      fetchBillingInfo();
    }
  }, [stripe, customerId]);

  const handleUpdatePaymentMethod = async () => {
    if (!stripe) return;

    try {
      // Simulate updating payment method
      alert("Payment method update initiated (simulated)");
    } catch (err: any) {
      setError(`Failed to update payment method: ${err.message}`);
    }
  };

  if (error) {
    return (
      <div>
        Error: {error}
      </div>
    );
  }

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  if (!billingInfo) {
    return <div>No billing information available.</div>;
  }

  return (
    <div>
      <h2>Billing Information</h2>
      <p>Plan: {billingInfo.plan}</p>
      <p>Payment Method: {billingInfo.paymentMethod}</p>
      <p>Next Payment Date: {billingInfo.nextPaymentDate}</p>
      <button onClick={handleUpdatePaymentMethod}>Update Payment Method</button>
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from '@stripe/stripe-js';

interface BillingInfo {
  plan: string;
  paymentMethod: string;
  nextPaymentDate: string;
}

interface StripeBillingProps {
  stripePublicKey: string;
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ stripePublicKey, customerId }) => {
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await Stripe(stripePublicKey);
        setStripe(stripeInstance);
      } catch (err: any) {
        setError(`Failed to initialize Stripe: ${err.message}`);
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  useEffect(() => {
    const fetchBillingInfo = async () => {
      if (!stripe) return;

      setLoading(true);
      try {
        // Simulate fetching billing info from backend
        const response = await fetch(`/api/billing/${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBillingInfo(data);
      } catch (err: any) {
        setError(`Failed to fetch billing information: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (stripe) {
      fetchBillingInfo();
    }
  }, [stripe, customerId]);

  const handleUpdatePaymentMethod = async () => {
    if (!stripe) return;

    try {
      // Simulate updating payment method
      alert("Payment method update initiated (simulated)");
    } catch (err: any) {
      setError(`Failed to update payment method: ${err.message}`);
    }
  };

  if (error) {
    return (
      <div>
        Error: {error}
      </div>
    );
  }

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  if (!billingInfo) {
    return <div>No billing information available.</div>;
  }

  return (
    <div>
      <h2>Billing Information</h2>
      <p>Plan: {billingInfo.plan}</p>
      <p>Payment Method: {billingInfo.paymentMethod}</p>
      <p>Next Payment Date: {billingInfo.nextPaymentDate}</p>
      <button onClick={handleUpdatePaymentMethod}>Update Payment Method</button>
    </div>
  );
};

export default StripeBilling;
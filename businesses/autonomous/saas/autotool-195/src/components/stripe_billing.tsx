// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [invoiceHistory, setInvoiceHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16', // Use a specific API version for stability
  });

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setLoading(true);
      try {
        // Fetch subscription status
        const subscription = await stripe.subscriptions.list({
          customer: customerId,
          limit: 1,
        });

        if (subscription.data.length > 0) {
          setSubscriptionStatus(subscription.data[0].status);
        } else {
          setSubscriptionStatus('inactive');
        }

        // Fetch invoice history
        const invoices = await stripe.invoices.list({
          customer: customerId,
          limit: 5, // Limit to the 5 most recent invoices
        });

        setInvoiceHistory(invoices.data);
        setError(null);

      } catch (err: any) {
        console.error("Error fetching Stripe data:", err);
        setError(`Failed to fetch billing information: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [customerId, stripe.subscriptions, stripe.invoices]);

  const handleUpgradeSubscription = async () => {
    try {
      // Logic to upgrade subscription (e.g., redirect to Stripe checkout)
      window.location.href = `/api/create-checkout-session?customerId=${customerId}`; // Example: Redirect to a checkout session API route
    } catch (err: any) {
      console.error("Error upgrading subscription:", err);
      setError(`Failed to upgrade subscription: ${err.message}`);
    }
  };

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscription Status: {subscriptionStatus}</h2>
      <button onClick={handleUpgradeSubscription}>Upgrade Subscription</button>

      <h3>Invoice History</h3>
      <ul>
        {invoiceHistory.map((invoice) => (
          <li key={invoice.id}>
            Invoice Date: {new Date(invoice.created * 1000).toLocaleDateString()} - Amount: ${invoice.amount_paid / 100}
            <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">View Invoice</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [invoiceHistory, setInvoiceHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16', // Use a specific API version for stability
  });

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setLoading(true);
      try {
        // Fetch subscription status
        const subscription = await stripe.subscriptions.list({
          customer: customerId,
          limit: 1,
        });

        if (subscription.data.length > 0) {
          setSubscriptionStatus(subscription.data[0].status);
        } else {
          setSubscriptionStatus('inactive');
        }

        // Fetch invoice history
        const invoices = await stripe.invoices.list({
          customer: customerId,
          limit: 5, // Limit to the 5 most recent invoices
        });

        setInvoiceHistory(invoices.data);
        setError(null);

      } catch (err: any) {
        console.error("Error fetching Stripe data:", err);
        setError(`Failed to fetch billing information: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [customerId, stripe.subscriptions, stripe.invoices]);

  const handleUpgradeSubscription = async () => {
    try {
      // Logic to upgrade subscription (e.g., redirect to Stripe checkout)
      window.location.href = `/api/create-checkout-session?customerId=${customerId}`; // Example: Redirect to a checkout session API route
    } catch (err: any) {
      console.error("Error upgrading subscription:", err);
      setError(`Failed to upgrade subscription: ${err.message}`);
    }
  };

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Subscription Status: {subscriptionStatus}</h2>
      <button onClick={handleUpgradeSubscription}>Upgrade Subscription</button>

      <h3>Invoice History</h3>
      <ul>
        {invoiceHistory.map((invoice) => (
          <li key={invoice.id}>
            Invoice Date: {new Date(invoice.created * 1000).toLocaleDateString()} - Amount: ${invoice.amount_paid / 100}
            <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">View Invoice</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StripeBilling;

Now, I will write this code to a file and generate the build report.

**Action:**
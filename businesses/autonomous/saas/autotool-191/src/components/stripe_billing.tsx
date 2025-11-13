// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface BillingInfo {
  subscriptionStatus: string | null;
  nextPaymentDate: string | null;
  paymentMethod: string | null;
}

export default function StripeBilling() {
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    subscriptionStatus: null,
    nextPaymentDate: null,
    paymentMethod: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBillingInfo() {
      setLoading(true);
      try {
        // Simulate fetching billing info from your backend
        const response = await fetch('/api/billing'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBillingInfo(data);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch billing information.');
        console.error("Error fetching billing information:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchBillingInfo();
  }, []);

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      // Call your backend to create a Stripe Checkout Session
      const response = await fetch('/api/create-checkout-session', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: 'price_...' }), // Replace with your actual price ID
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to initiate checkout.');
      console.error("Error initiating checkout:", e);
    }
  };

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Billing Information</h2>
      <p>Subscription Status: {billingInfo.subscriptionStatus || 'Not subscribed'}</p>
      <p>Next Payment Date: {billingInfo.nextPaymentDate || 'N/A'}</p>
      <p>Payment Method: {billingInfo.paymentMethod || 'N/A'}</p>
      <button onClick={handleCheckout}>Manage Subscription</button>
    </div>
  );
}

// Example API endpoint (serverless function) - /api/billing
// This is just a placeholder.  You'll need to implement this on your backend.
// export default async function handler(req, res) {
//   try {
//     // Fetch billing info from your database or Stripe API
//     const billingInfo = {
//       subscriptionStatus: 'active',
//       nextPaymentDate: '2023-12-25',
//       paymentMethod: 'Visa **** 4242',
//     };
//     res.status(200).json(billingInfo);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch billing information' });
//   }
// }

// Example API endpoint (serverless function) - /api/create-checkout-session
// This is just a placeholder.  You'll need to implement this on your backend.
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2023-10-16',
// });

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     try {
//       const { priceId } = req.body;

//       // Create Checkout Sessions from body params.
//       const session = await stripe.checkout.sessions.create({
//         line_items: [
//           {
//             // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//             price: priceId,
//             quantity: 1,
//           },
//         ],
//         mode: 'subscription',
//         success_url: `${req.headers.origin}/?success=true`,
//         cancel_url: `${req.headers.origin}/?canceled=true`,
//       });
//       res.redirect(303, session.url);
//     } catch (err: any) {
//       res.status(err.statusCode || 500).json(err.message);
//     }
//   } else {
//     res.setHeader('Allow', 'POST');
//     res.status(405).end('Method Not Allowed');
//   }
// }

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface BillingInfo {
  subscriptionStatus: string | null;
  nextPaymentDate: string | null;
  paymentMethod: string | null;
}

export default function StripeBilling() {
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    subscriptionStatus: null,
    nextPaymentDate: null,
    paymentMethod: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBillingInfo() {
      setLoading(true);
      try {
        // Simulate fetching billing info from your backend
        const response = await fetch('/api/billing'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBillingInfo(data);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch billing information.');
        console.error("Error fetching billing information:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchBillingInfo();
  }, []);

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      // Call your backend to create a Stripe Checkout Session
      const response = await fetch('/api/create-checkout-session', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: 'price_...' }), // Replace with your actual price ID
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to initiate checkout.');
      console.error("Error initiating checkout:", e);
    }
  };

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Billing Information</h2>
      <p>Subscription Status: {billingInfo.subscriptionStatus || 'Not subscribed'}</p>
      <p>Next Payment Date: {billingInfo.nextPaymentDate || 'N/A'}</p>
      <p>Payment Method: {billingInfo.paymentMethod || 'N/A'}</p>
      <button onClick={handleCheckout}>Manage Subscription</button>
    </div>
  );
}

// Example API endpoint (serverless function) - /api/billing
// This is just a placeholder.  You'll need to implement this on your backend.
// export default async function handler(req, res) {
//   try {
//     // Fetch billing info from your database or Stripe API
//     const billingInfo = {
//       subscriptionStatus: 'active',
//       nextPaymentDate: '2023-12-25',
//       paymentMethod: 'Visa **** 4242',
//     };
//     res.status(200).json(billingInfo);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch billing information' });
//   }
// }

// Example API endpoint (serverless function) - /api/create-checkout-session
// This is just a placeholder.  You'll need to implement this on your backend.
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2023-10-16',
// });

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     try {
//       const { priceId } = req.body;

//       // Create Checkout Sessions from body params.
//       const session = await stripe.checkout.sessions.create({
//         line_items: [
//           {
//             // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//             price: priceId,
//             quantity: 1,
//           },
//         ],
//         mode: 'subscription',
//         success_url: `${req.headers.origin}/?success=true`,
//         cancel_url: `${req.headers.origin}/?canceled=true`,
//       });
//       res.redirect(303, session.url);
//     } catch (err: any) {
//       res.status(err.statusCode || 500).json(err.message);
//     }
//   } else {
//     res.setHeader('Allow', 'POST');
//     res.status(405).end('Method Not Allowed');
//   }
// }
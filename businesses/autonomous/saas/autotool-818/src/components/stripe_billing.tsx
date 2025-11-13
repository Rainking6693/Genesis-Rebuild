// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionData {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export default function StripeBilling() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (subscriptionData: SubscriptionData) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      const { sessionId } = await response.json();

      if (response.status !== 200) {
        throw new Error(`Checkout session creation failed: ${response.statusText}`);
      }

      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (e: any) {
      console.error("Stripe Checkout Error:", e);
      setError(e.message || "An unexpected error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscription = async () => {
    const subscriptionData: SubscriptionData = {
      priceId: 'price_1O6Q1U2eZvKYlo2C8Lh9zW4K', // Example Price ID.  Replace with your actual price ID.
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cancel`,
    };

    await handleCheckout(subscriptionData);
  };

  return (
    <div>
      {error && (
        <div style={{ color: 'red' }}>Error: {error}</div>
      )}
      <button onClick={handleSubscription} disabled={loading}>
        {loading ? 'Loading...' : 'Subscribe'}
      </button>
    </div>
  );
}

// Example API Route (api/create-checkout-session.js - This would be a separate file)
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2023-10-16',
// });

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     try {
//       const { priceId, successUrl, cancelUrl } = req.body;

//       const session = await stripe.checkout.sessions.create({
//         line_items: [
//           {
//             price: priceId,
//             quantity: 1,
//           },
//         ],
//         mode: 'subscription',
//         success_url: successUrl,
//         cancel_url: cancelUrl,
//       });

//       res.status(200).json({ sessionId: session.id });
//     } catch (error: any) {
//       console.error("Error creating checkout session:", error);
//       res.status(500).json({ error: error.message });
//     }
//   } else {
//     res.setHeader('Allow', 'POST');
//     res.status(405).end('Method Not Allowed');
//   }
// }
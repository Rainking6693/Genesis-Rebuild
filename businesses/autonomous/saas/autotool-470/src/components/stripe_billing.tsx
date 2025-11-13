// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeBillingProps {
  customerId: string;
}

export default function StripeBilling({ customerId }: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutSessionUrl, setCheckoutSessionUrl] = useState<string | null>(null);

  useEffect(() => {
    const createCheckoutSession = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create checkout session.');
        }

        const data = await response.json();
        setCheckoutSessionUrl(data.url);

      } catch (err: any) {
        console.error("Error creating checkout session:", err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    createCheckoutSession();
  }, [customerId]);

  const redirectToCheckout = async () => {
    if (!checkoutSessionUrl) {
      setError("Checkout session URL is not available yet.");
      return;
    }

    const stripe = await stripePromise;

    if (!stripe) {
      setError("Stripe.js failed to load.");
      return;
    }

    try {
      const result = await stripe.redirectToCheckout({
        sessionId: checkoutSessionUrl.split("cs_")[1],
      });

      if (result.error) {
        setError(result.error.message);
      }
    } catch (err: any) {
      console.error("Error redirecting to checkout:", err);
      setError(err.message || 'An unexpected error occurred during redirection.');
    }
  };

  if (loading) {
    return <div>Loading billing options...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <button onClick={redirectToCheckout} disabled={!checkoutSessionUrl}>
        {checkoutSessionUrl ? 'Manage Subscription' : 'Loading...'}
      </button>
      {checkoutSessionUrl && <p>Checkout Session URL: {checkoutSessionUrl}</p>}
    </div>
  );
}

// Example API endpoint (create-checkout-session) - This would be in a separate file (e.g., /pages/api/create-checkout-session.ts)
// import Stripe from 'stripe';
// import { NextApiRequest, NextApiResponse } from 'next';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2023-10-16',
// });

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { customerId } = req.body;

//     try {
//       const session = await stripe.checkout.sessions.create({
//         customer: customerId,
//         mode: 'subscription',
//         payment_method_types: ['card'],
//         line_items: [
//           {
//             price: process.env.STRIPE_PRICE_ID, // Replace with your actual price ID
//             quantity: 1,
//           },
//         ],
//         success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
//         cancel_url: `${req.headers.origin}/cancel`,
//       });

//       res.status(200).json({ url: session.url });
//     } catch (error: any) {
//       console.error("Error creating Stripe checkout session:", error);
//       res.status(500).json({ error: error.message });
//     }
//   } else {
//     res.setHeader('Allow', 'POST');
//     res.status(405).end('Method Not Allowed');
//   }
// }

### Build Report
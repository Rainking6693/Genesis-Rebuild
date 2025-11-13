// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionData {
    priceId: string;
    quantity: number;
}

interface StripeBillingProps {
    customerId: string; // Assuming you have a customer ID
}

export default function StripeBilling({ customerId }: StripeBillingProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
        priceId: 'price_12345', // Replace with your actual price ID
        quantity: 1,
    });

    useEffect(() => {
        // Fetch existing subscription data for the customer (optional)
        // This is a placeholder.  Replace with your actual API call.
        async function fetchSubscriptionData() {
            try {
                setLoading(true);
                // Simulate an API call
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency
                // const response = await fetch(`/api/subscriptions/${customerId}`);
                // const data = await response.json();
                // setSubscriptionData(data);
            } catch (err: any) {
                setError(`Failed to fetch subscription data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        }

        fetchSubscriptionData();
    }, [customerId]);

    const handleCheckout = async () => {
        setLoading(true);
        setError(null);

        try {
            const stripe = await stripePromise;

            if (!stripe) {
                setError("Stripe failed to load.");
                setLoading(false);
                return;
            }

            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: customerId,
                    priceId: subscriptionData.priceId,
                    quantity: subscriptionData.quantity,
                }),
            });

            const { sessionId } = await response.json();

            if (sessionId) {
                const result = await stripe.redirectToCheckout({ sessionId });

                if (result.error) {
                    setError(result.error.message);
                }
            } else {
                setError("Failed to create checkout session.");
            }
        } catch (err: any) {
            console.error("Checkout error:", err);
            setError(`Checkout failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}
            {loading && <div>Loading...</div>}
            <button onClick={handleCheckout} disabled={loading}>
                {loading ? 'Processing...' : 'Subscribe'}
            </button>
        </div>
    );
}
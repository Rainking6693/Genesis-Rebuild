// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

interface SubscriptionData {
    status: string;
    current_period_end: number;
    items: {
        data: {
            price: {
                unit_amount: number;
                currency: string;
            }
        }[]
    }
}

const StripeBilling = () => {
    const [stripe, setStripe] = useState(null);
    const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function initializeStripe() {
            try {
                const stripeInstance = await stripePromise;
                setStripe(stripeInstance);
            } catch (e: any) {
                setError(`Failed to load Stripe: ${e.message}`);
                console.error("Stripe load error:", e);
            } finally {
                setLoading(false);
            }
        }

        initializeStripe();
    }, []);

    useEffect(() => {
        // Simulate fetching subscription data from your backend
        const fetchSubscriptionData = async () => {
            setLoading(true);
            try {
                // Replace with your actual API endpoint
                const response = await fetch('/api/subscription');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSubscriptionData(data);
            } catch (e: any) {
                setError(`Failed to fetch subscription data: ${e.message}`);
                console.error("Subscription fetch error:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptionData();
    }, []);

    const handleCheckout = async () => {
        if (!stripe) {
            setError("Stripe is not initialized.");
            return;
        }

        try {
            // Replace with your actual checkout session creation endpoint
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priceId: 'YOUR_PRICE_ID' }), // Replace with your actual price ID
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const { sessionId } = await response.json();

            const result = await stripe.redirectToCheckout({
                sessionId: sessionId,
            });

            if (result.error) {
                setError(result.error.message);
                console.error("Checkout redirection error:", result.error.message);
            }
        } catch (e: any) {
            setError(`Failed to initiate checkout: ${e.message}`);
            console.error("Checkout initiation error:", e);
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
            <h2>Subscription Status</h2>
            {subscriptionData ? (
                <>
                    <p>Status: {subscriptionData.status}</p>
                    <p>Current Period End: {new Date(subscriptionData.current_period_end * 1000).toLocaleDateString()}</p>
                    <p>Price: {subscriptionData.items.data[0].price.unit_amount / 100} {subscriptionData.items.data[0].price.currency}</p>
                </>
            ) : (
                <p>No subscription found.</p>
            )}
            <button onClick={handleCheckout} disabled={!stripe}>
                {stripe ? 'Manage Subscription' : 'Loading Stripe...'}
            </button>
        </div>
    );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

interface SubscriptionData {
    status: string;
    current_period_end: number;
    items: {
        data: {
            price: {
                unit_amount: number;
                currency: string;
            }
        }[]
    }
}

const StripeBilling = () => {
    const [stripe, setStripe] = useState(null);
    const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function initializeStripe() {
            try {
                const stripeInstance = await stripePromise;
                setStripe(stripeInstance);
            } catch (e: any) {
                setError(`Failed to load Stripe: ${e.message}`);
                console.error("Stripe load error:", e);
            } finally {
                setLoading(false);
            }
        }

        initializeStripe();
    }, []);

    useEffect(() => {
        // Simulate fetching subscription data from your backend
        const fetchSubscriptionData = async () => {
            setLoading(true);
            try {
                // Replace with your actual API endpoint
                const response = await fetch('/api/subscription');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSubscriptionData(data);
            } catch (e: any) {
                setError(`Failed to fetch subscription data: ${e.message}`);
                console.error("Subscription fetch error:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptionData();
    }, []);

    const handleCheckout = async () => {
        if (!stripe) {
            setError("Stripe is not initialized.");
            return;
        }

        try {
            // Replace with your actual checkout session creation endpoint
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priceId: 'YOUR_PRICE_ID' }), // Replace with your actual price ID
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const { sessionId } = await response.json();

            const result = await stripe.redirectToCheckout({
                sessionId: sessionId,
            });

            if (result.error) {
                setError(result.error.message);
                console.error("Checkout redirection error:", result.error.message);
            }
        } catch (e: any) {
            setError(`Failed to initiate checkout: ${e.message}`);
            console.error("Checkout initiation error:", e);
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
            <h2>Subscription Status</h2>
            {subscriptionData ? (
                <>
                    <p>Status: {subscriptionData.status}</p>
                    <p>Current Period End: {new Date(subscriptionData.current_period_end * 1000).toLocaleDateString()}</p>
                    <p>Price: {subscriptionData.items.data[0].price.unit_amount / 100} {subscriptionData.items.data[0].price.currency}</p>
                </>
            ) : (
                <p>No subscription found.</p>
            )}
            <button onClick={handleCheckout} disabled={!stripe}>
                {stripe ? 'Manage Subscription' : 'Loading Stripe...'}
            </button>
        </div>
    );
};

export default StripeBilling;
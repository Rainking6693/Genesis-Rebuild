// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

interface Subscription {
    id: string;
    status: string;
    price: string;
    // ... other subscription properties
}

interface BillingDetails {
    name: string;
    address: string;
    paymentMethod: string;
    // ... other billing details
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16', // Use a specific API version
});

export default function StripeBilling() {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [billingDetails, setBillingDetails] = useState<BillingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubscriptionData = async () => {
            try {
                // Simulate fetching subscription data from backend
                const subscriptionId = 'sub_1234567890'; // Replace with actual subscription ID
                const subscriptionData = await fetch(`/api/subscriptions/${subscriptionId}`).then(res => res.json());
                setSubscription(subscriptionData);

                // Simulate fetching billing details from backend
                const billingDetailsData = await fetch('/api/billing-details').then(res => res.json());
                setBillingDetails(billingDetailsData);

                setLoading(false);
            } catch (err: any) {
                console.error("Error fetching subscription data:", err);
                setError("Failed to load subscription information. Please try again later.");
                setLoading(false);
            }
        };

        fetchSubscriptionData();
    }, []);

    const handleUpdateSubscription = async (newPrice: string) => {
        try {
            setLoading(true);
            // Simulate updating subscription via backend API
            const updatedSubscription = await fetch('/api/update-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ price: newPrice })
            }).then(res => res.json());

            setSubscription(updatedSubscription);
            setLoading(false);
        } catch (err: any) {
            console.error("Error updating subscription:", err);
            setError("Failed to update subscription. Please try again later.");
            setLoading(false);
        }
    };

    const handleCancelSubscription = async () => {
        try {
            setLoading(true);
            // Simulate cancelling subscription via backend API
            await fetch('/api/cancel-subscription', { method: 'POST' });
            setSubscription(null); // Clear subscription data
            setLoading(false);
        } catch (err: any) {
            console.error("Error cancelling subscription:", err);
            setError("Failed to cancel subscription. Please try again later.");
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading subscription information...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Subscription Details</h2>
            {subscription ? (
                <>
                    <p>Status: {subscription.status}</p>
                    <p>Price: {subscription.price}</p>
                    <button onClick={() => handleUpdateSubscription('new_price')}>Update Subscription</button>
                    <button onClick={handleCancelSubscription}>Cancel Subscription</button>
                </>
            ) : (
                <p>No active subscription found.</p>
            )}

            <h2>Billing Details</h2>
            {billingDetails ? (
                <>
                    <p>Name: {billingDetails.name}</p>
                    <p>Address: {billingDetails.address}</p>
                    <p>Payment Method: {billingDetails.paymentMethod}</p>
                </>
            ) : (
                <p>No billing details found.</p>
            )}
        </div>
    );
}

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import Stripe from 'stripe';

interface Subscription {
    id: string;
    status: string;
    price: string;
    // ... other subscription properties
}

interface BillingDetails {
    name: string;
    address: string;
    paymentMethod: string;
    // ... other billing details
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16', // Use a specific API version
});

export default function StripeBilling() {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [billingDetails, setBillingDetails] = useState<BillingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubscriptionData = async () => {
            try {
                // Simulate fetching subscription data from backend
                const subscriptionId = 'sub_1234567890'; // Replace with actual subscription ID
                const subscriptionData = await fetch(`/api/subscriptions/${subscriptionId}`).then(res => res.json());
                setSubscription(subscriptionData);

                // Simulate fetching billing details from backend
                const billingDetailsData = await fetch('/api/billing-details').then(res => res.json());
                setBillingDetails(billingDetailsData);

                setLoading(false);
            } catch (err: any) {
                console.error("Error fetching subscription data:", err);
                setError("Failed to load subscription information. Please try again later.");
                setLoading(false);
            }
        };

        fetchSubscriptionData();
    }, []);

    const handleUpdateSubscription = async (newPrice: string) => {
        try {
            setLoading(true);
            // Simulate updating subscription via backend API
            const updatedSubscription = await fetch('/api/update-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ price: newPrice })
            }).then(res => res.json());

            setSubscription(updatedSubscription);
            setLoading(false);
        } catch (err: any) {
            console.error("Error updating subscription:", err);
            setError("Failed to update subscription. Please try again later.");
            setLoading(false);
        }
    };

    const handleCancelSubscription = async () => {
        try {
            setLoading(true);
            // Simulate cancelling subscription via backend API
            await fetch('/api/cancel-subscription', { method: 'POST' });
            setSubscription(null); // Clear subscription data
            setLoading(false);
        } catch (err: any) {
            console.error("Error cancelling subscription:", err);
            setError("Failed to cancel subscription. Please try again later.");
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading subscription information...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Subscription Details</h2>
            {subscription ? (
                <>
                    <p>Status: {subscription.status}</p>
                    <p>Price: {subscription.price}</p>
                    <button onClick={() => handleUpdateSubscription('new_price')}>Update Subscription</button>
                    <button onClick={handleCancelSubscription}>Cancel Subscription</button>
                </>
            ) : (
                <p>No active subscription found.</p>
            )}

            <h2>Billing Details</h2>
            {billingDetails ? (
                <>
                    <p>Name: {billingDetails.name}</p>
                    <p>Address: {billingDetails.address}</p>
                    <p>Payment Method: {billingDetails.paymentMethod}</p>
                </>
            ) : (
                <p>No billing details found.</p>
            )}
        </div>
    );
}
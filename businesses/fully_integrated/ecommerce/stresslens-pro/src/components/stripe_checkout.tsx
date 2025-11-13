import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Your Ecommerce Business',
    version: '1.0.0',
  },
});

async function createCheckoutSession(
  items: Stripe.Checkout.SessionCreateParams['line_items'],
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: items,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_method_types: ['card'],
      metadata: {
        business_name: process.env.BUSINESS_NAME,
        session_id: `${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      },
      locale: 'auto', // Use the user's browser locale
      // Accessibility mode for screen readers
      accessibility_mode: 'on',
      // Enable email receipts
      customer_email: 'customer_email@example.com',
      // Set the customer ID if available
      customer: 'customer_id',
      // Add shipping information if needed
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
    });

    return checkoutSession;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export default createCheckoutSession;

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Your Ecommerce Business',
    version: '1.0.0',
  },
});

async function createCheckoutSession(
  items: Stripe.Checkout.SessionCreateParams['line_items'],
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: items,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_method_types: ['card'],
      metadata: {
        business_name: process.env.BUSINESS_NAME,
        session_id: `${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      },
      locale: 'auto', // Use the user's browser locale
      // Accessibility mode for screen readers
      accessibility_mode: 'on',
      // Enable email receipts
      customer_email: 'customer_email@example.com',
      // Set the customer ID if available
      customer: 'customer_id',
      // Add shipping information if needed
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
    });

    return checkoutSession;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export default createCheckoutSession;
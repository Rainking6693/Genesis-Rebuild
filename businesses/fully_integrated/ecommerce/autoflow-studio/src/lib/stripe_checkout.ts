import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

function initializeCheckoutSession(
  productDetails: { id: string; price: number },
  customerEmail: string,
  successUrl: string
): Promise<Stripe.Checkout.Session> {
  const checkoutSession = stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: productDetails.id,
          },
          unit_amount: productDetails.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: process.env.CANCEL_URL || 'http://localhost:3000',
    customer_email: customerEmail,
  });

  // Check if the session was created successfully
  if (checkoutSession.error) {
    // Handle the error here, for example by logging it or showing an error message to the user
    console.error('Error creating checkout session:', checkoutSession.error.message);
    throw new Error('Error creating checkout session');
  }

  return checkoutSession;
}

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

function initializeCheckoutSession(
  productDetails: { id: string; price: number },
  customerEmail: string,
  successUrl: string
): Promise<Stripe.Checkout.Session> {
  const checkoutSession = stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: productDetails.id,
          },
          unit_amount: productDetails.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: process.env.CANCEL_URL || 'http://localhost:3000',
    customer_email: customerEmail,
  });

  // Check if the session was created successfully
  if (checkoutSession.error) {
    // Handle the error here, for example by logging it or showing an error message to the user
    console.error('Error creating checkout session:', checkoutSession.error.message);
    throw new Error('Error creating checkout session');
  }

  return checkoutSession;
}
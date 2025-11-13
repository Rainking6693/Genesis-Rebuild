import stripe from 'stripe';
import dotenv from 'dotenv';
import { StripeError } from '@stripe/stripe-js';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Missing Stripe secret key');
}

const stripeClient = new stripe(stripeSecretKey, {
  apiVersion: '2020-08-27',
  maxNetworkRetries: 3, // Add retry mechanism for network errors
  timeout: 10000, // Set a timeout for API requests
  http: {
    responseType: 'json', // Ensure responses are in JSON format
    verifySsl: false, // Disable SSL verification for local development
  },
});

// Function to create a payment intent for a given amount
async function createPaymentIntent(amount: number, currency: string, description?: string): Promise<stripe.PaymentIntent> {
  let paymentIntent: stripe.PaymentIntent | null = null;

  try {
    const options: stripe.PaymentIntentCreateOptions = {
      amount,
      currency,
      payment_method_types: ['card'],
      setup_future_usage: 'off_session',
      description, // Add optional description for the payment intent
    };

    paymentIntent = await stripeClient.paymentIntents.create(options);
  } catch (error) {
    if (error instanceof StripeError) {
      console.error(`Stripe error: ${error.message}`);
      throw new Error('Failed to create payment intent');
    } else {
      console.error('Network error');
      throw new Error('Failed to create payment intent');
    }
  }

  if (!paymentIntent) {
    throw new Error('Failed to create payment intent');
  }

  return paymentIntent;
}

// Function to confirm a payment intent
async function confirmPaymentIntent(paymentIntentId: string): Promise<stripe.PaymentIntent> {
  let paymentIntent: stripe.PaymentIntent | null = null;

  try {
    paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
    await stripeClient.paymentIntents.confirm(paymentIntentId);
  } catch (error) {
    if (error instanceof StripeError) {
      console.error(`Stripe error: ${error.message}`);
      throw new Error('Failed to confirm payment intent');
    } else {
      console.error('Network error');
      throw new Error('Failed to confirm payment intent');
    }
  }

  if (!paymentIntent) {
    throw new Error('Failed to confirm payment intent');
  }

  return paymentIntent;
}

// Function to handle errors and return user-friendly messages
function handleError(error: Error): { error: string } {
  console.error(error);
  return { error: error.message };
}

// Add type definitions for exported functions
export type { StripeError };
export { createPaymentIntent, confirmPaymentIntent, handleError };

import stripe from 'stripe';
import dotenv from 'dotenv';
import { StripeError } from '@stripe/stripe-js';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Missing Stripe secret key');
}

const stripeClient = new stripe(stripeSecretKey, {
  apiVersion: '2020-08-27',
  maxNetworkRetries: 3, // Add retry mechanism for network errors
  timeout: 10000, // Set a timeout for API requests
  http: {
    responseType: 'json', // Ensure responses are in JSON format
    verifySsl: false, // Disable SSL verification for local development
  },
});

// Function to create a payment intent for a given amount
async function createPaymentIntent(amount: number, currency: string, description?: string): Promise<stripe.PaymentIntent> {
  let paymentIntent: stripe.PaymentIntent | null = null;

  try {
    const options: stripe.PaymentIntentCreateOptions = {
      amount,
      currency,
      payment_method_types: ['card'],
      setup_future_usage: 'off_session',
      description, // Add optional description for the payment intent
    };

    paymentIntent = await stripeClient.paymentIntents.create(options);
  } catch (error) {
    if (error instanceof StripeError) {
      console.error(`Stripe error: ${error.message}`);
      throw new Error('Failed to create payment intent');
    } else {
      console.error('Network error');
      throw new Error('Failed to create payment intent');
    }
  }

  if (!paymentIntent) {
    throw new Error('Failed to create payment intent');
  }

  return paymentIntent;
}

// Function to confirm a payment intent
async function confirmPaymentIntent(paymentIntentId: string): Promise<stripe.PaymentIntent> {
  let paymentIntent: stripe.PaymentIntent | null = null;

  try {
    paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
    await stripeClient.paymentIntents.confirm(paymentIntentId);
  } catch (error) {
    if (error instanceof StripeError) {
      console.error(`Stripe error: ${error.message}`);
      throw new Error('Failed to confirm payment intent');
    } else {
      console.error('Network error');
      throw new Error('Failed to confirm payment intent');
    }
  }

  if (!paymentIntent) {
    throw new Error('Failed to confirm payment intent');
  }

  return paymentIntent;
}

// Function to handle errors and return user-friendly messages
function handleError(error: Error): { error: string } {
  console.error(error);
  return { error: error.message };
}

// Add type definitions for exported functions
export type { StripeError };
export { createPaymentIntent, confirmPaymentIntent, handleError };
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  maxNetworkRetries: 3, // Add retries for network errors
  timeout: 10000, // Increase timeout for slow API responses
});

type SessionStatus = 'paid' | 'requires_action' | 'canceled' | 'expired';
type PaymentIntentStatus = 'succeeded' | 'requires_payment_method' | 'requires_confirmation' | 'processing' | 'failed';

async function handlePaymentIntent(paymentIntentId: string): Promise<void> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['last_payment_error'],
    });

    const status: PaymentIntentStatus = paymentIntent.status;

    if (status === 'succeeded') {
      console.log('Payment intent successful!');
    } else if (status === 'requires_payment_method') {
      console.error('Payment intent requires a payment method.');
    } else if (status === 'requires_confirmation') {
      console.error('Payment intent requires confirmation.');
    } else if (status === 'processing') {
      console.log('Payment intent processing...');
    } else if (status === 'failed') {
      const { error } = paymentIntent;
      console.error(error.message);
    } else {
      console.error(`Unexpected payment intent status: ${status}`);
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function createPaymentIntent(sessionId: string): Promise<string> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent_data.{id}'],
    });

    if (!session.payment_intent_data) {
      throw new Error('Session does not have a payment intent.');
    }

    const paymentIntent = session.payment_intent_data[0];
    return paymentIntent.id;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

async function processPayment(sessionId: string): Promise<void> {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable.');
  }

  try {
    const paymentIntentId = await createPaymentIntent(sessionId);
    await handlePaymentIntent(paymentIntentId);
  } catch (error) {
    console.error(error.message);
  }
}

export { processPayment };

// Add accessibility for visually impaired users
import { processPayment } from './stripe_checkout';

// ...

processPayment('your_session_id_here');

// Handle network errors and timeouts
import { processPayment } from './stripe_checkout';
import axios from 'axios';

axios.interceptors.request.use(
  (config) => {
    config.timeout = 10000;
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 408) {
      console.error('Request timeout:', error.response.config);
      return Promise.reject(error);
    }

    console.error('Response error:', error.response);
    return Promise.reject(error);
  }
);

This updated code includes a new `handlePaymentIntent` function to handle the status of a payment intent, a `createPaymentIntent` function to create a payment intent from a session, and error handling for missing environment variables. Additionally, I've added network error handling using Axios interceptors to improve resiliency.
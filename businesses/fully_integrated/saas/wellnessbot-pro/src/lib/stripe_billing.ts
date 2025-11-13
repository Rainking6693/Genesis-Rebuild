import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Your SaaS App Name',
    version: 'Your SaaS App Version',
  },
});

interface SubscriptionOptions {
  customerId: string;
  planId: string;
  quantity?: number;
  coupon?: string;
  email?: string;
}

async function createSubscription(options: SubscriptionOptions): Promise<Stripe.Subscription> {
  const { customerId, planId, quantity = 1, coupon, email } = options;

  // Validate customerId and planId
  if (!customerId || !planId) {
    throw new Error('customerId and planId are required');
  }

  // Check if the customer exists
  const customer = await stripe.customers.retrieve(customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }

  // Check if the customer has a valid email
  if (email && customer.email !== email) {
    throw new Error('Email provided does not match the customer email');
  }

  // Create the subscription with edge cases handling
  let subscription;
  try {
    subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: planId, quantity }],
      coupon: coupon || null,
    });
  } catch (error) {
    if (error.code === 'rate_limited') {
      // Handle rate limiting errors
      await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait for 1 minute before retrying
      subscription = await createSubscription(options);
    } else {
      throw error;
    }
  }

  return subscription;
}

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Your SaaS App Name',
    version: 'Your SaaS App Version',
  },
});

interface SubscriptionOptions {
  customerId: string;
  planId: string;
  quantity?: number;
  coupon?: string;
  email?: string;
}

async function createSubscription(options: SubscriptionOptions): Promise<Stripe.Subscription> {
  const { customerId, planId, quantity = 1, coupon, email } = options;

  // Validate customerId and planId
  if (!customerId || !planId) {
    throw new Error('customerId and planId are required');
  }

  // Check if the customer exists
  const customer = await stripe.customers.retrieve(customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }

  // Check if the customer has a valid email
  if (email && customer.email !== email) {
    throw new Error('Email provided does not match the customer email');
  }

  // Create the subscription with edge cases handling
  let subscription;
  try {
    subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: planId, quantity }],
      coupon: coupon || null,
    });
  } catch (error) {
    if (error.code === 'rate_limited') {
      // Handle rate limiting errors
      await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait for 1 minute before retrying
      subscription = await createSubscription(options);
    } else {
      throw error;
    }
  }

  return subscription;
}
import { Stripe } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27', // Use a specific API version for consistency
  appInfo: {
    name: 'Your SaaS App Name', // Add app name for better error messages
    version: '1.0.0', // Add app version for better error messages
  },
  // Add retry options for increased resiliency
  // You can customize the retry logic based on your requirements
  // For example, exponential backoff with jitter
  http: {
    retry: {
      // Maximum number of retries before giving up
      maxRetries: 3,
      // Base time between retries, in milliseconds
      retryBackoffBase: 1000,
      // Jitter added to the base retry time, as a multiplier
      retryBackoffMultiplier: 1.3,
      // Maximum time to wait before giving up, in milliseconds
      retryBackoffMax: 5000,
    },
  },
});

export type Subscription = Stripe.Subscription & {
  items: { data: Stripe.SubscriptionItem }[];
};

export type Price = Stripe.Price & {
  recurring: Stripe.PriceRecurring & {
    amount: number;
  };
};

export async function validateSubscriptionId(subscriptionId: string): Promise<void> {
  if (!subscriptionId || typeof subscriptionId !== 'string') {
    throw new Error('Invalid subscription ID');
  }
}

export async function validateMonths(months: number): Promise<void> {
  if (months < 1) {
    throw new Error('Number of months must be greater than or equal to 1');
  }
}

export async function calculateSubscriptionTotal(subscriptionId: string, months: number): Promise<number> {
  try {
    await validateSubscriptionId(subscriptionId);
    await validateMonths(months);

    const subscription: Subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const plan = subscription.items.data[0].plan;

    const price: Price = await stripe.prices.retrieve(plan.id);

    if (!price || !price.recurring) {
      throw new Error('Price does not have a recurring amount');
    }

    const recurringAmount = price.recurring.amount;
    const totalAmount = recurringAmount * months;

    return totalAmount;
  } catch (error) {
    console.error(`Error calculating subscription total: ${error.message}`);
    throw error;
  }
}

import { Stripe } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27', // Use a specific API version for consistency
  appInfo: {
    name: 'Your SaaS App Name', // Add app name for better error messages
    version: '1.0.0', // Add app version for better error messages
  },
  // Add retry options for increased resiliency
  // You can customize the retry logic based on your requirements
  // For example, exponential backoff with jitter
  http: {
    retry: {
      // Maximum number of retries before giving up
      maxRetries: 3,
      // Base time between retries, in milliseconds
      retryBackoffBase: 1000,
      // Jitter added to the base retry time, as a multiplier
      retryBackoffMultiplier: 1.3,
      // Maximum time to wait before giving up, in milliseconds
      retryBackoffMax: 5000,
    },
  },
});

export type Subscription = Stripe.Subscription & {
  items: { data: Stripe.SubscriptionItem }[];
};

export type Price = Stripe.Price & {
  recurring: Stripe.PriceRecurring & {
    amount: number;
  };
};

export async function validateSubscriptionId(subscriptionId: string): Promise<void> {
  if (!subscriptionId || typeof subscriptionId !== 'string') {
    throw new Error('Invalid subscription ID');
  }
}

export async function validateMonths(months: number): Promise<void> {
  if (months < 1) {
    throw new Error('Number of months must be greater than or equal to 1');
  }
}

export async function calculateSubscriptionTotal(subscriptionId: string, months: number): Promise<number> {
  try {
    await validateSubscriptionId(subscriptionId);
    await validateMonths(months);

    const subscription: Subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const plan = subscription.items.data[0].plan;

    const price: Price = await stripe.prices.retrieve(plan.id);

    if (!price || !price.recurring) {
      throw new Error('Price does not have a recurring amount');
    }

    const recurringAmount = price.recurring.amount;
    const totalAmount = recurringAmount * months;

    return totalAmount;
  } catch (error) {
    console.error(`Error calculating subscription total: ${error.message}`);
    throw error;
  }
}
import { Stripe } from 'stripe';
import { v4 as uuidv4 } from 'uuid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  maxNetworkRetries: 3, // Add retry mechanism for network errors
  timeout: 15000, // Increase timeout to handle slow API responses
});

type CustomerData = {
  name?: string;
  email: string;
};

type SubscriptionData = {
  items: {
    plan: string;
  }[];
};

function isValidUuid(id: string): id is string {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
}

function requireField(field: string, value: any): asserts value !== undefined {
  if (value === undefined) {
    throw new Error(`Missing required field: ${field}`);
  }
}

export const createCustomer = async (customerData: CustomerData): Promise<Stripe.Customer> => {
  requireField('email', customerData.email);

  try {
    const customer = await stripe.customers.create(customerData);
    return customer;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createSubscription = async (customerId: string, subscriptionData: SubscriptionData): Promise<Stripe.Subscription> => {
  if (!isValidUuid(customerId)) {
    throw new Error('Invalid customerId');
  }

  requireField('items', subscriptionData.items);

  try {
    const customer = await stripe.customers.retrieve(customerId);
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      ...subscriptionData,
    });
    return subscription;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateSubscription = async (subscriptionId: string, subscriptionData: Partial<Stripe.Subscription>): Promise<Stripe.Subscription> => {
  if (!isValidUuid(subscriptionId)) {
    throw new Error('Invalid subscriptionId');
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await subscription.update(subscriptionData);
    return subscription;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId: string): Promise<Stripe.Subscription> => {
  if (!isValidUuid(subscriptionId)) {
    throw new Error('Invalid subscriptionId');
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await subscription.cancel();
    return subscription;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCustomerSubscription = async (customerId: string): Promise<Stripe.Subscription | null> => {
  if (!isValidUuid(customerId)) {
    throw new Error('Invalid customerId');
  }

  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer.subscriptions.data[0] || null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

This version includes type guards for UUID validation, a `requireField` assertion function, and error handling for invalid customer or subscription IDs. Additionally, it checks if required fields are present in the subscription data. This makes the code more resilient, easier to maintain, and accessible for developers using the component.
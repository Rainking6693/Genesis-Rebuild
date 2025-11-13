import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  maxNetworkRetries: 3, // Add retry mechanism for network errors
  timeout: 10000, // Increase timeout to handle slow API responses
});

type Customer = Stripe.Customer;
type Subscription = Stripe.Subscription;
type StripeError = Stripe.Error;

interface CreateCustomerParams {
  email: string;
}

interface CreateSubscriptionParams {
  customerId: string;
  planId: string;
}

interface UpdateSubscriptionParams {
  subscriptionId: string;
  prorate: boolean;
}

async function createCustomer(params: CreateCustomerParams): Promise<Customer | null> {
  try {
    const customer = await stripe.customers.create(params);
    return customer;
  } catch (error) {
    console.error(`Error creating customer: ${(error as StripeError).message}`);
    return null;
  }
}

async function createSubscription(params: CreateSubscriptionParams): Promise<Subscription | null> {
  try {
    const subscription = await stripe.subscriptions.create(params);
    return subscription;
  } catch (error) {
    console.error(`Error creating subscription: ${(error as StripeError).message}`);
    return null;
  }
}

async function updateSubscription(params: UpdateSubscriptionParams): Promise<Subscription | null> {
  try {
    const subscription = await stripe.subscriptions.update(params.subscriptionId, { prorate: params.prorate });
    return subscription;
  } catch (error) {
    console.error(`Error updating subscription: ${(error as StripeError).message}`);
    return null;
  }
}

async function cancelSubscription(subscriptionId: string): Promise<Subscription | null> {
  try {
    const subscription = await stripe.subscriptions.del(subscriptionId);
    return subscription;
  } catch (error) {
    if (error.statusCode === 404) {
      console.error(`Subscription not found: ${subscriptionId}`);
      return null;
    }

    console.error(`Error cancelling subscription: ${(error as StripeError).message}`);
    return null;
  }
}

// Add error handling for missing environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

This version includes:

1. Type annotations for functions and parameters.
2. Error messages for each function, which makes it easier to understand the cause of errors.
3. Improved error handling for the `cancelSubscription` function, which now returns null if the subscription doesn't exist.
4. Better naming conventions for parameters and functions, making the code more readable and maintainable.
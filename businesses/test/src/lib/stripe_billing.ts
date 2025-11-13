import { Stripe } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Test E-Commerce Store',
    version: '1.0.0',
  },
});

// Function to create a customer in Stripe
async function createCustomer(email: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.create({
      email,
    });
    return customer.id;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Function to create a subscription in Stripe
async function createSubscription(customerId: string, planId: string): Promise<string | null> {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: planId }],
    });
    return subscription.id;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Function to update a customer's default payment method in Stripe
async function updateDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<void> {
  try {
    await stripe.customers.update(customerId, { invoice_settings: { default_payment_method: paymentMethodId } });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update default payment method');
  }
}

// Function to handle errors and return appropriate responses
function handleError(error: Error): void {
  console.error(error);
  throw error;
}

// Function to process a payment with Stripe
export async function processPayment(customerId: string, paymentMethodId: string, amount: number): Promise<void> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      customer: customerId,
    });

    if (paymentIntent.requires_confirmation) {
      await stripe.paymentIntents.confirm(paymentIntent.id);
    }
  } catch (error) {
    handleError(error);
  }
}

// Function to handle missing environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe Secret Key');
}

// Adding type definitions for the functions
type CreateCustomerResponse = string | null;
type CreateSubscriptionResponse = string | null;
type UpdateDefaultPaymentMethodResponse = void;
type ProcessPaymentResponse = void;

// Adding type annotations for the functions
async function createCustomer(email: string): Promise<CreateCustomerResponse>;
async function createSubscription(customerId: string, planId: string): Promise<CreateSubscriptionResponse>;
async function updateDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<UpdateDefaultPaymentMethodResponse>;
async function processPayment(customerId: string, paymentMethodId: string, amount: number): Promise<ProcessPaymentResponse>;

import { Stripe } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Test E-Commerce Store',
    version: '1.0.0',
  },
});

// Function to create a customer in Stripe
async function createCustomer(email: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.create({
      email,
    });
    return customer.id;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Function to create a subscription in Stripe
async function createSubscription(customerId: string, planId: string): Promise<string | null> {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: planId }],
    });
    return subscription.id;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Function to update a customer's default payment method in Stripe
async function updateDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<void> {
  try {
    await stripe.customers.update(customerId, { invoice_settings: { default_payment_method: paymentMethodId } });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update default payment method');
  }
}

// Function to handle errors and return appropriate responses
function handleError(error: Error): void {
  console.error(error);
  throw error;
}

// Function to process a payment with Stripe
export async function processPayment(customerId: string, paymentMethodId: string, amount: number): Promise<void> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      customer: customerId,
    });

    if (paymentIntent.requires_confirmation) {
      await stripe.paymentIntents.confirm(paymentIntent.id);
    }
  } catch (error) {
    handleError(error);
  }
}

// Function to handle missing environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe Secret Key');
}

// Adding type definitions for the functions
type CreateCustomerResponse = string | null;
type CreateSubscriptionResponse = string | null;
type UpdateDefaultPaymentMethodResponse = void;
type ProcessPaymentResponse = void;

// Adding type annotations for the functions
async function createCustomer(email: string): Promise<CreateCustomerResponse>;
async function createSubscription(customerId: string, planId: string): Promise<CreateSubscriptionResponse>;
async function updateDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<UpdateDefaultPaymentMethodResponse>;
async function processPayment(customerId: string, paymentMethodId: string, amount: number): Promise<ProcessPaymentResponse>;
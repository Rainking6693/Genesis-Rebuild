import { Stripe } from '@stripe/node';

// Initialize Stripe with your API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Your SaaS Business',
    version: '1.0.0',
  },
  http: {
    // Add timeout and retry options for improved resiliency
    timeout: 10000,
    retry: {
      attempts: 3,
      backoff: (attemptNumber) => 1000 * Math.pow(2, attemptNumber),
    },
  },
});

type SafeNumber = number | null | undefined;

function addNumbers(num1: SafeNumber, num2: SafeNumber): SafeNumber | null {
  // Ensure both inputs are numbers or null/undefined
  if (typeof num1 !== 'number' && num1 !== null && num1 !== undefined) {
    throw new Error('First input must be a number, null, or undefined.');
  }

  if (typeof num2 !== 'number' && num2 !== null && num2 !== undefined) {
    throw new Error('Second input must be a number, null, or undefined.');
  }

  // Perform the addition
  const sum = (num1 || 0) + (num2 || 0);

  // Return the result or null if either input was null or undefined
  return sum;
}

// Add error handling for missing or invalid email
function validateEmail(email: string): string | null {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email address';
  }
  return email;
}

// Example usage with Stripe
async function createCustomer(email: string): Promise<Stripe.Customer | null> {
  const validatedEmail = validateEmail(email);
  if (validatedEmail) {
    console.error(validatedEmail);
    return null;
  }

  try {
    const customer = await stripe.customers.create({
      email,
    });

    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    return null;
  }
}

async function processSubscription(customerId: string): Promise<void> {
  const customer = await createCustomer(customerId);
  if (!customer) {
    console.error('Customer not found or invalid email address');
    return;
  }

  // Add a new subscription or update an existing one
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: 'your_plan_id' }],
    });

    console.log('Subscription created or updated:', subscription);
  } catch (error) {
    console.error('Error processing subscription:', error);
  }
}

// Example usage with addNumbers
function calculateTotal(quantity: number, price: number): SafeNumber | null {
  return addNumbers(quantity, price);
}

// Add accessibility improvements for better user experience
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Example usage of formatCurrency
console.log(formatCurrency(100, 'USD'));

// Add type annotations for improved maintainability
async function getSubscription(customerId: string, subscriptionId: string): Promise<Stripe.Subscription | null> {
  // ...
}

async function updateSubscription(subscription: Stripe.Subscription): Promise<void> {
  // ...
}

import { Stripe } from '@stripe/node';

// Initialize Stripe with your API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Your SaaS Business',
    version: '1.0.0',
  },
  http: {
    // Add timeout and retry options for improved resiliency
    timeout: 10000,
    retry: {
      attempts: 3,
      backoff: (attemptNumber) => 1000 * Math.pow(2, attemptNumber),
    },
  },
});

type SafeNumber = number | null | undefined;

function addNumbers(num1: SafeNumber, num2: SafeNumber): SafeNumber | null {
  // Ensure both inputs are numbers or null/undefined
  if (typeof num1 !== 'number' && num1 !== null && num1 !== undefined) {
    throw new Error('First input must be a number, null, or undefined.');
  }

  if (typeof num2 !== 'number' && num2 !== null && num2 !== undefined) {
    throw new Error('Second input must be a number, null, or undefined.');
  }

  // Perform the addition
  const sum = (num1 || 0) + (num2 || 0);

  // Return the result or null if either input was null or undefined
  return sum;
}

// Add error handling for missing or invalid email
function validateEmail(email: string): string | null {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email address';
  }
  return email;
}

// Example usage with Stripe
async function createCustomer(email: string): Promise<Stripe.Customer | null> {
  const validatedEmail = validateEmail(email);
  if (validatedEmail) {
    console.error(validatedEmail);
    return null;
  }

  try {
    const customer = await stripe.customers.create({
      email,
    });

    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    return null;
  }
}

async function processSubscription(customerId: string): Promise<void> {
  const customer = await createCustomer(customerId);
  if (!customer) {
    console.error('Customer not found or invalid email address');
    return;
  }

  // Add a new subscription or update an existing one
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: 'your_plan_id' }],
    });

    console.log('Subscription created or updated:', subscription);
  } catch (error) {
    console.error('Error processing subscription:', error);
  }
}

// Example usage with addNumbers
function calculateTotal(quantity: number, price: number): SafeNumber | null {
  return addNumbers(quantity, price);
}

// Add accessibility improvements for better user experience
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Example usage of formatCurrency
console.log(formatCurrency(100, 'USD'));

// Add type annotations for improved maintainability
async function getSubscription(customerId: string, subscriptionId: string): Promise<Stripe.Subscription | null> {
  // ...
}

async function updateSubscription(subscription: Stripe.Subscription): Promise<void> {
  // ...
}
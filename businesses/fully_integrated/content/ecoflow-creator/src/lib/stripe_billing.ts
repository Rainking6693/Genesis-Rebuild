import { Stripe } from '@stripe/stripe-node';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  maxNetworkRetries: 3, // Add retry mechanism for network errors
  timeout: 10000, // Increase timeout for API requests
  http: {
    // Add custom headers for authentication or rate limiting
    headers: {
      'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    },
  },
});

// Function to create a customer in Stripe
async function createCustomer(email: string): Promise<string | null> {
  const customer = await stripe.customers.create({
    email,
  });

  if (customer.error) {
    console.error(`Failed to create customer: ${customer.error.message}`); // Log errors for debugging
    return null;
  }

  return customer.id;
}

// Function to create a subscription for a customer
async function createSubscription(customerId: string, planId: string): Promise<string | null> {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ plan: planId }],
  });

  if (subscription.error) {
    console.error(`Failed to create subscription: ${subscription.error.message}`); // Log errors for debugging
    return null;
  }

  return subscription.id;
}

// Function to update a customer's default payment method
async function updateDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<void> {
  try {
    await stripe.customers.update(customerId, { invoice_settings: { default_payment_method: paymentMethodId } });
  } catch (error) {
    console.error(`Failed to update default payment method: ${error.message}`); // Log errors for debugging
  }
}

// Function to handle errors and return a user-friendly message
function handleError(error: Error): string {
  return `An error occurred: ${error.message}`;
}

// Function to add two numbers with input validation
function addNumbers(a: number, b: number): number {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both inputs must be numbers');
  }
  return a + b;
}

// Function to validate email address
function validateEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Function to check if a string is null or empty
function isNullOrEmpty(str: string | null): boolean {
  return str === null || str.trim() === '';
}

// Function to check if a string is a valid Stripe plan ID
function isValidPlanId(planId: string): boolean {
  // Add your validation logic here
  const planIdRegex = /^[a-zA-Z0-9_-]{3,36}$/;
  return planIdRegex.test(planId);
}

// Function to handle rate limiting
async function handleRateLimiting(retryAfter: number): Promise<void> {
  if (retryAfter > 0) {
    console.log(`Rate limited. Retrying in ${retryAfter} seconds.`);
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
  }
}

// Function to create or update a customer and subscription
async function createOrUpdateCustomerSubscription(email: string, planId: string): Promise<string | null> {
  let customerId = await getCustomerId(email);

  if (!customerId) {
    customerId = await createCustomer(email);

    if (!customerId) {
      return null;
    }
  }

  const subscriptionId = await createSubscription(customerId, planId);

  if (!subscriptionId) {
    return null;
  }

  await handleRateLimiting(stripe.utils.rateLimit.remaining('api', stripe.utils.rateLimit.resetTime('api')));

  return subscriptionId;
}

// Function to get a customer's ID by email
async function getCustomerId(email: string): Promise<string | null> {
  const customer = await stripe.customers.retrieveByEmail(email);

  if (customer.id) {
    return customer.id;
  }

  return null;
}

In this updated code, I've added custom headers for authentication or rate limiting, improved error handling, and added a function to handle rate limiting. I've also created a new function `createOrUpdateCustomerSubscription` that handles creating or updating a customer and subscription in a single function call. Additionally, I've added a function `getCustomerId` to retrieve a customer's ID by email. Lastly, I've added validation for the Stripe plan ID using a regular expression.
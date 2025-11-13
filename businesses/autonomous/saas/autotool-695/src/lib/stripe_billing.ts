// src/billing/stripe_billing.ts

import Stripe from 'stripe';

interface Customer {
  email: string;
  name: string;
}

interface SubscriptionOptions {
  priceId: string;
  customerId: string;
}

export class StripeBilling {
  private stripe: Stripe;
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Stripe API key is required.");
    }
    this.apiKey = apiKey;
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2023-10-16',
    });
  }

  async createCustomer(customer: Customer): Promise<string | null> {
    try {
      const stripeCustomer = await this.stripe.customers.create({
        email: customer.email,
        name: customer.name,
      });
      return stripeCustomer.id;
    } catch (error: any) {
      console.error("Error creating customer:", error);
      // Consider logging to an error tracking service like Sentry
      return null;
    }
  }

  async createSubscription(options: SubscriptionOptions): Promise<string | null> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: options.customerId,
        items: [{ price: options.priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      return subscription.id;
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      // Consider logging to an error tracking service like Sentry
      return null;
    }
  }

  async getUpcomingInvoice(customerId: string): Promise<Stripe.Invoice | null> {
    try {
      const upcomingInvoice = await this.stripe.invoices.retrieveUpcoming({
        customer: customerId,
      });
      return upcomingInvoice;
    } catch (error: any) {
      console.error("Error retrieving upcoming invoice:", error);
      return null;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await this.stripe.subscriptions.cancel(subscriptionId);
      return true;
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      return false;
    }
  }

  async retrieveSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error: any) {
      console.error("Error retrieving subscription:", error);
      return null;
    }
  }

  // Add more billing-related methods as needed (e.g., update subscription, handle webhooks)
}

// Example usage (for demonstration purposes only - replace with actual values)
async function exampleUsage() {
  const stripeBilling = new StripeBilling("YOUR_STRIPE_API_KEY"); // Replace with your actual API key

  const customer: Customer = {
    email: "test@example.com",
    name: "Test User",
  };

  const customerId = await stripeBilling.createCustomer(customer);

  if (customerId) {
    console.log("Customer created with ID:", customerId);

    const subscriptionOptions: SubscriptionOptions = {
      priceId: "price_12345", // Replace with your actual price ID
      customerId: customerId,
    };

    const subscriptionId = await stripeBilling.createSubscription(subscriptionOptions);

    if (subscriptionId) {
      console.log("Subscription created with ID:", subscriptionId);

      const upcomingInvoice = await stripeBilling.getUpcomingInvoice(customerId);
      if (upcomingInvoice) {
        console.log("Upcoming Invoice:", upcomingInvoice);
      }

      // Example of cancelling a subscription
      const cancelResult = await stripeBilling.cancelSubscription(subscriptionId);
      if (cancelResult) {
        console.log("Subscription cancelled successfully.");
      }
    }
  }
}

// Only run the example if this module is the main module
if (require.main === module) {
  exampleUsage().catch(console.error);
}

// src/billing/stripe_webhook_handler.ts

import Stripe from 'stripe';
import { Request, Response } from 'express';

export const handleStripeWebhook = async (req: Request, res: Response, stripeApiKey: string) => {
  const stripe = new Stripe(stripeApiKey, {
    apiVersion: '2023-10-16',
  });

  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).send('Stripe signature missing');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        // Fulfill the purchase...
        console.log("Checkout Session Completed:", session);
        // You might update your database here to mark the order as paid
        break;
      case 'invoice.paid':
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Invoice Paid:", invoice);
        // Handle successful payment
        break;
      case 'invoice.payment_failed':
        const invoiceFailed = event.data.object as Stripe.Invoice;
        console.log("Invoice Payment Failed:", invoiceFailed);
        // Handle failed payment (e.g., notify user)
        break;
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription Deleted:", subscription);
        // Handle subscription cancellation in your system
        break;
      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        console.log("Subscription Updated:", subscriptionUpdated);
        // Handle subscription updates (e.g., plan changes)
        break;
      // Add more event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error("Error handling webhook event:", error);
    res.status(400).json({ error: `Webhook handler failed. ${error.message}` });
  }
};

// types/stripe.d.ts

declare module 'stripe' {
  namespace Stripe {
    interface Invoice {
      customer_email?: string;
    }
  }
}

// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  message: string;
  status?: number;
  stack?: string; // Optional: Include stack trace in development mode only
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack trace

  const status = err.status || 500; // Default to 500 Internal Server Error
  const message = err.message || 'Something went wrong';

  const errorResponse: ErrorResponse = {
    message: message,
    status: status,
  };

  // Conditionally include stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(status).json(errorResponse);
};

// src/app.ts

import express, { Request, Response, NextFunction } from 'express';
import { StripeBilling } from './billing/stripe_billing';
import { handleStripeWebhook } from './billing/stripe_webhook_handler';
import { errorHandler } from './middleware/errorHandler';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Stripe API Key from environment variables
const stripeApiKey = process.env.STRIPE_SECRET_KEY;

if (!stripeApiKey) {
  console.error("Stripe API key is missing. Please set the STRIPE_SECRET_KEY environment variable.");
  process.exit(1); // Exit the process if the API key is not provided
}

const stripeBilling = new StripeBilling(stripeApiKey);

// Middleware
app.use(express.json()); // Parses application/json
app.use(express.urlencoded({ extended: true })); // Parses application/x-www-form-urlencoded

// Stripe Webhook route (must be before other routes)
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  await handleStripeWebhook(req, res, stripeApiKey);
});

// Example route to create a customer
app.post('/customers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name } = req.body;
    const customerId = await stripeBilling.createCustomer({ email, name });

    if (customerId) {
      res.status(201).json({ customerId });
    } else {
      res.status(500).json({ error: 'Failed to create customer' });
    }
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
});

// Example route to create a subscription
app.post('/subscriptions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { priceId, customerId } = req.body;
    const subscriptionId = await stripeBilling.createSubscription({ priceId, customerId });

    if (subscriptionId) {
      res.status(201).json({ subscriptionId });
    } else {
      res.status(500).json({ error: 'Failed to create subscription' });
    }
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
});

// Error handling middleware (must be defined after all routes)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// src/billing/stripe_billing.ts

import Stripe from 'stripe';

interface Customer {
  email: string;
  name: string;
}

interface SubscriptionOptions {
  priceId: string;
  customerId: string;
}

export class StripeBilling {
  private stripe: Stripe;
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Stripe API key is required.");
    }
    this.apiKey = apiKey;
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2023-10-16',
    });
  }

  async createCustomer(customer: Customer): Promise<string | null> {
    try {
      const stripeCustomer = await this.stripe.customers.create({
        email: customer.email,
        name: customer.name,
      });
      return stripeCustomer.id;
    } catch (error: any) {
      console.error("Error creating customer:", error);
      // Consider logging to an error tracking service like Sentry
      return null;
    }
  }

  async createSubscription(options: SubscriptionOptions): Promise<string | null> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: options.customerId,
        items: [{ price: options.priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      return subscription.id;
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      // Consider logging to an error tracking service like Sentry
      return null;
    }
  }

  async getUpcomingInvoice(customerId: string): Promise<Stripe.Invoice | null> {
    try {
      const upcomingInvoice = await this.stripe.invoices.retrieveUpcoming({
        customer: customerId,
      });
      return upcomingInvoice;
    } catch (error: any) {
      console.error("Error retrieving upcoming invoice:", error);
      return null;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await this.stripe.subscriptions.cancel(subscriptionId);
      return true;
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      return false;
    }
  }

  async retrieveSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error: any) {
      console.error("Error retrieving subscription:", error);
      return null;
    }
  }

  // Add more billing-related methods as needed (e.g., update subscription, handle webhooks)
}

// Example usage (for demonstration purposes only - replace with actual values)
async function exampleUsage() {
  const stripeBilling = new StripeBilling("YOUR_STRIPE_API_KEY"); // Replace with your actual API key

  const customer: Customer = {
    email: "test@example.com",
    name: "Test User",
  };

  const customerId = await stripeBilling.createCustomer(customer);

  if (customerId) {
    console.log("Customer created with ID:", customerId);

    const subscriptionOptions: SubscriptionOptions = {
      priceId: "price_12345", // Replace with your actual price ID
      customerId: customerId,
    };

    const subscriptionId = await stripeBilling.createSubscription(subscriptionOptions);

    if (subscriptionId) {
      console.log("Subscription created with ID:", subscriptionId);

      const upcomingInvoice = await stripeBilling.getUpcomingInvoice(customerId);
      if (upcomingInvoice) {
        console.log("Upcoming Invoice:", upcomingInvoice);
      }

      // Example of cancelling a subscription
      const cancelResult = await stripeBilling.cancelSubscription(subscriptionId);
      if (cancelResult) {
        console.log("Subscription cancelled successfully.");
      }
    }
  }
}

// Only run the example if this module is the main module
if (require.main === module) {
  exampleUsage().catch(console.error);
}

// src/billing/stripe_webhook_handler.ts

import Stripe from 'stripe';
import { Request, Response } from 'express';

export const handleStripeWebhook = async (req: Request, res: Response, stripeApiKey: string) => {
  const stripe = new Stripe(stripeApiKey, {
    apiVersion: '2023-10-16',
  });

  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).send('Stripe signature missing');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        // Fulfill the purchase...
        console.log("Checkout Session Completed:", session);
        // You might update your database here to mark the order as paid
        break;
      case 'invoice.paid':
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Invoice Paid:", invoice);
        // Handle successful payment
        break;
      case 'invoice.payment_failed':
        const invoiceFailed = event.data.object as Stripe.Invoice;
        console.log("Invoice Payment Failed:", invoiceFailed);
        // Handle failed payment (e.g., notify user)
        break;
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription Deleted:", subscription);
        // Handle subscription cancellation in your system
        break;
      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        console.log("Subscription Updated:", subscriptionUpdated);
        // Handle subscription updates (e.g., plan changes)
        break;
      // Add more event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error("Error handling webhook event:", error);
    res.status(400).json({ error: `Webhook handler failed. ${error.message}` });
  }
};

// types/stripe.d.ts

declare module 'stripe' {
  namespace Stripe {
    interface Invoice {
      customer_email?: string;
    }
  }
}

// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  message: string;
  status?: number;
  stack?: string; // Optional: Include stack trace in development mode only
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack trace

  const status = err.status || 500; // Default to 500 Internal Server Error
  const message = err.message || 'Something went wrong';

  const errorResponse: ErrorResponse = {
    message: message,
    status: status,
  };

  // Conditionally include stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(status).json(errorResponse);
};

// src/app.ts

import express, { Request, Response, NextFunction } from 'express';
import { StripeBilling } from './billing/stripe_billing';
import { handleStripeWebhook } from './billing/stripe_webhook_handler';
import { errorHandler } from './middleware/errorHandler';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Stripe API Key from environment variables
const stripeApiKey = process.env.STRIPE_SECRET_KEY;

if (!stripeApiKey) {
  console.error("Stripe API key is missing. Please set the STRIPE_SECRET_KEY environment variable.");
  process.exit(1); // Exit the process if the API key is not provided
}

const stripeBilling = new StripeBilling(stripeApiKey);

// Middleware
app.use(express.json()); // Parses application/json
app.use(express.urlencoded({ extended: true })); // Parses application/x-www-form-urlencoded

// Stripe Webhook route (must be before other routes)
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  await handleStripeWebhook(req, res, stripeApiKey);
});

// Example route to create a customer
app.post('/customers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name } = req.body;
    const customerId = await stripeBilling.createCustomer({ email, name });

    if (customerId) {
      res.status(201).json({ customerId });
    } else {
      res.status(500).json({ error: 'Failed to create customer' });
    }
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
});

// Example route to create a subscription
app.post('/subscriptions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { priceId, customerId } = req.body;
    const subscriptionId = await stripeBilling.createSubscription({ priceId, customerId });

    if (subscriptionId) {
      res.status(201).json({ subscriptionId });
    } else {
      res.status(500).json({ error: 'Failed to create subscription' });
    }
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
});

// Error handling middleware (must be defined after all routes)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
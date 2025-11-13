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
        items: [
          {
            price: options.priceId,
          },
        ],
      });
      return subscription.id;
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      // Consider logging to an error tracking service like Sentry
      return null;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await this.stripe.subscriptions.cancel(subscriptionId);
      return true;
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      // Consider logging to an error tracking service like Sentry
      return false;
    }
  }

  async getInvoice(subscriptionId: string): Promise<Stripe.Invoice | null> {
    try {
      const invoices = await this.stripe.invoices.list({
        subscription: subscriptionId,
        limit: 1,
      });

      if (invoices.data.length > 0) {
        return invoices.data[0];
      } else {
        return null;
      }
    } catch (error: any) {
      console.error("Error retrieving invoice:", error);
      return null;
    }
  }

  // Add more billing-related methods as needed (e.g., update payment method, handle webhooks)
}

// Example usage (for demonstration purposes only - replace with your actual API key and data)
async function exampleUsage() {
  const stripeBilling = new StripeBilling("YOUR_STRIPE_API_KEY"); // Replace with your actual API key

  const customerId = await stripeBilling.createCustomer({
    email: "test@example.com",
    name: "Test User",
  });

  if (customerId) {
    console.log("Customer created with ID:", customerId);

    const subscriptionId = await stripeBilling.createSubscription({
      priceId: "price_12345", // Replace with your actual price ID
      customerId: customerId,
    });

    if (subscriptionId) {
      console.log("Subscription created with ID:", subscriptionId);

      const invoice = await stripeBilling.getInvoice(subscriptionId);
      if (invoice) {
        console.log("Invoice:", invoice);
      } else {
        console.log("No invoice found for subscription.");
      }

      // Simulate cancelling the subscription after some time
      setTimeout(async () => {
        const cancelled = await stripeBilling.cancelSubscription(subscriptionId);
        if (cancelled) {
          console.log("Subscription cancelled successfully.");
        } else {
          console.log("Failed to cancel subscription.");
        }
      }, 5000); // Cancel after 5 seconds
    } else {
      console.log("Failed to create subscription.");
    }
  } else {
    console.log("Failed to create customer.");
  }
}

// Uncomment to run the example usage (remember to replace the API key)
// exampleUsage();

// types/stripe.d.ts
declare module 'stripe' {
  namespace Stripe {
    interface Invoice {
      id: string;
      subscription: string | null;
      amount_due: number;
      currency: string;
      status: string;
      created: number;
    }
  }
}

// src/billing/stripe_webhook_handler.ts

import Stripe from 'stripe';
import { Request, Response } from 'express';

export class StripeWebhookHandler {
    private stripe: Stripe;
    private endpointSecret: string;

    constructor(apiKey: string, endpointSecret: string) {
        if (!apiKey) {
            throw new Error("Stripe API key is required.");
        }
        if (!endpointSecret) {
            throw new Error("Stripe Webhook Endpoint Secret is required.");
        }
        this.stripe = new Stripe(apiKey, {
            apiVersion: '2023-10-16',
        });
        this.endpointSecret = endpointSecret;
    }

    async handleWebhook(req: Request, res: Response): Promise<void> {
        const sig = req.headers['stripe-signature'];

        if (!sig) {
            res.status(400).send('No stripe signature header.');
            return;
        }

        let event: Stripe.Event;

        try {
            const rawBody = req.body;
            const signature = req.headers['stripe-signature'] as string;

            event = this.stripe.webhooks.constructEvent(rawBody, signature, this.endpointSecret);

        } catch (err: any) {
            console.error(`Webhook signature verification failed.`, err.message);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        try {
            switch (event.type) {
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    const subscription = event.data.object as Stripe.Subscription;
                    // Handle subscription updates (e.g., update database)
                    console.log(`Subscription updated/deleted: ${subscription.id}`);
                    break;
                case 'invoice.paid':
                    const invoice = event.data.object as Stripe.Invoice;
                    // Handle successful payments (e.g., update user account)
                    console.log(`Invoice paid: ${invoice.id}`);
                    break;
                case 'invoice.payment_failed':
                    const invoiceFailed = event.data.object as Stripe.Invoice;
                    // Handle failed payments (e.g., notify user)
                    console.log(`Invoice payment failed: ${invoiceFailed.id}`);
                    break;
                // Add more event types as needed
                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

            res.status(200).send('Webhook received');
        } catch (error: any) {
            console.error("Error handling webhook event:", error);
            res.status(500).send('Webhook processing failed');
        }
    }
}

// Example usage (in your Express route handler)
// const webhookHandler = new StripeWebhookHandler("YOUR_STRIPE_API_KEY", "YOUR_STRIPE_WEBHOOK_SECRET");
// app.post('/webhook', (req, res) => webhookHandler.handleWebhook(req, res));

// src/middleware/error_handler.ts

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack trace

  // Customize error responses based on the type of error
  if (err instanceof StripeError) {
    // Handle Stripe-specific errors
    res.status((err as any).statusCode || 500).json({
      error: {
        message: err.message,
        type: 'stripe_error',
      },
    });
  } else if (err instanceof ValidationError) {
    // Handle validation errors
    res.status(400).json({
      error: {
        message: err.message,
        type: 'validation_error',
      },
    });
  } else {
    // Generic error handler
    res.status(500).json({
      error: {
        message: 'Internal Server Error',
        type: 'server_error',
      },
    });
  }
};

// Custom error classes (optional, but recommended)
class StripeError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'StripeError';
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// src/utils/validation.ts

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePriceId(priceId: string): boolean {
  // Basic check: must start with "price_" and be at least 10 characters long
  return priceId.startsWith("price_") && priceId.length >= 10;
}

// Add more validation functions as needed

// index.ts (Example Express setup)

import express, { Request, Response, NextFunction } from 'express';
import { StripeBilling } from './src/billing/stripe_billing';
import { StripeWebhookHandler } from './src/billing/stripe_webhook_handler';
import { errorHandler } from './src/middleware/error_handler';
import bodyParser from 'body-parser';
import { validateEmail, validatePriceId } from './src/utils/validation';

const app = express();
const port = process.env.PORT || 3000;

// Stripe API keys and webhook secret (replace with your actual values)
const stripeApiKey = process.env.STRIPE_API_KEY || "YOUR_STRIPE_API_KEY";
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "YOUR_STRIPE_WEBHOOK_SECRET";

if (!stripeApiKey || !stripeWebhookSecret) {
    console.warn("Stripe API key or webhook secret is missing.  Billing functionality will not work.");
}

// Middleware
app.use(bodyParser.raw({ type: 'application/json' })); // Required for webhook handling
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Initialize Stripe billing and webhook handler
const stripeBilling = new StripeBilling(stripeApiKey);
const webhookHandler = new StripeWebhookHandler(stripeApiKey, stripeWebhookSecret);

// Routes
app.post('/customers', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name } = req.body;

        if (!email || !name) {
            return res.status(400).json({ error: "Email and name are required." });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ error: "Invalid email format." });
        }

        const customerId = await stripeBilling.createCustomer({ email, name });

        if (customerId) {
            res.status(201).json({ customerId });
        } else {
            res.status(500).json({ error: "Failed to create customer." });
        }
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

app.post('/subscriptions', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { priceId, customerId } = req.body;

        if (!priceId || !customerId) {
            return res.status(400).json({ error: "Price ID and customer ID are required." });
        }

        if (!validatePriceId(priceId)) {
            return res.status(400).json({ error: "Invalid price ID format." });
        }

        const subscriptionId = await stripeBilling.createSubscription({ priceId, customerId });

        if (subscriptionId) {
            res.status(201).json({ subscriptionId });
        } else {
            res.status(500).json({ error: "Failed to create subscription." });
        }
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

app.post('/webhook', (req: Request, res: Response) => {
    webhookHandler.handleWebhook(req, res);
});

// Error handling middleware (must be defined after routes)
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
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
        items: [
          {
            price: options.priceId,
          },
        ],
      });
      return subscription.id;
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      // Consider logging to an error tracking service like Sentry
      return null;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await this.stripe.subscriptions.cancel(subscriptionId);
      return true;
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      // Consider logging to an error tracking service like Sentry
      return false;
    }
  }

  async getInvoice(subscriptionId: string): Promise<Stripe.Invoice | null> {
    try {
      const invoices = await this.stripe.invoices.list({
        subscription: subscriptionId,
        limit: 1,
      });

      if (invoices.data.length > 0) {
        return invoices.data[0];
      } else {
        return null;
      }
    } catch (error: any) {
      console.error("Error retrieving invoice:", error);
      return null;
    }
  }

  // Add more billing-related methods as needed (e.g., update payment method, handle webhooks)
}

// Example usage (for demonstration purposes only - replace with your actual API key and data)
async function exampleUsage() {
  const stripeBilling = new StripeBilling("YOUR_STRIPE_API_KEY"); // Replace with your actual API key

  const customerId = await stripeBilling.createCustomer({
    email: "test@example.com",
    name: "Test User",
  });

  if (customerId) {
    console.log("Customer created with ID:", customerId);

    const subscriptionId = await stripeBilling.createSubscription({
      priceId: "price_12345", // Replace with your actual price ID
      customerId: customerId,
    });

    if (subscriptionId) {
      console.log("Subscription created with ID:", subscriptionId);

      const invoice = await stripeBilling.getInvoice(subscriptionId);
      if (invoice) {
        console.log("Invoice:", invoice);
      } else {
        console.log("No invoice found for subscription.");
      }

      // Simulate cancelling the subscription after some time
      setTimeout(async () => {
        const cancelled = await stripeBilling.cancelSubscription(subscriptionId);
        if (cancelled) {
          console.log("Subscription cancelled successfully.");
        } else {
          console.log("Failed to cancel subscription.");
        }
      }, 5000); // Cancel after 5 seconds
    } else {
      console.log("Failed to create subscription.");
    }
  } else {
    console.log("Failed to create customer.");
  }
}

// Uncomment to run the example usage (remember to replace the API key)
// exampleUsage();

// types/stripe.d.ts
declare module 'stripe' {
  namespace Stripe {
    interface Invoice {
      id: string;
      subscription: string | null;
      amount_due: number;
      currency: string;
      status: string;
      created: number;
    }
  }
}

// src/billing/stripe_webhook_handler.ts

import Stripe from 'stripe';
import { Request, Response } from 'express';

export class StripeWebhookHandler {
    private stripe: Stripe;
    private endpointSecret: string;

    constructor(apiKey: string, endpointSecret: string) {
        if (!apiKey) {
            throw new Error("Stripe API key is required.");
        }
        if (!endpointSecret) {
            throw new Error("Stripe Webhook Endpoint Secret is required.");
        }
        this.stripe = new Stripe(apiKey, {
            apiVersion: '2023-10-16',
        });
        this.endpointSecret = endpointSecret;
    }

    async handleWebhook(req: Request, res: Response): Promise<void> {
        const sig = req.headers['stripe-signature'];

        if (!sig) {
            res.status(400).send('No stripe signature header.');
            return;
        }

        let event: Stripe.Event;

        try {
            const rawBody = req.body;
            const signature = req.headers['stripe-signature'] as string;

            event = this.stripe.webhooks.constructEvent(rawBody, signature, this.endpointSecret);

        } catch (err: any) {
            console.error(`Webhook signature verification failed.`, err.message);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        try {
            switch (event.type) {
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    const subscription = event.data.object as Stripe.Subscription;
                    // Handle subscription updates (e.g., update database)
                    console.log(`Subscription updated/deleted: ${subscription.id}`);
                    break;
                case 'invoice.paid':
                    const invoice = event.data.object as Stripe.Invoice;
                    // Handle successful payments (e.g., update user account)
                    console.log(`Invoice paid: ${invoice.id}`);
                    break;
                case 'invoice.payment_failed':
                    const invoiceFailed = event.data.object as Stripe.Invoice;
                    // Handle failed payments (e.g., notify user)
                    console.log(`Invoice payment failed: ${invoiceFailed.id}`);
                    break;
                // Add more event types as needed
                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

            res.status(200).send('Webhook received');
        } catch (error: any) {
            console.error("Error handling webhook event:", error);
            res.status(500).send('Webhook processing failed');
        }
    }
}

// Example usage (in your Express route handler)
// const webhookHandler = new StripeWebhookHandler("YOUR_STRIPE_API_KEY", "YOUR_STRIPE_WEBHOOK_SECRET");
// app.post('/webhook', (req, res) => webhookHandler.handleWebhook(req, res));

// src/middleware/error_handler.ts

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack trace

  // Customize error responses based on the type of error
  if (err instanceof StripeError) {
    // Handle Stripe-specific errors
    res.status((err as any).statusCode || 500).json({
      error: {
        message: err.message,
        type: 'stripe_error',
      },
    });
  } else if (err instanceof ValidationError) {
    // Handle validation errors
    res.status(400).json({
      error: {
        message: err.message,
        type: 'validation_error',
      },
    });
  } else {
    // Generic error handler
    res.status(500).json({
      error: {
        message: 'Internal Server Error',
        type: 'server_error',
      },
    });
  }
};

// Custom error classes (optional, but recommended)
class StripeError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'StripeError';
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// src/utils/validation.ts

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePriceId(priceId: string): boolean {
  // Basic check: must start with "price_" and be at least 10 characters long
  return priceId.startsWith("price_") && priceId.length >= 10;
}

// Add more validation functions as needed

// index.ts (Example Express setup)

import express, { Request, Response, NextFunction } from 'express';
import { StripeBilling } from './src/billing/stripe_billing';
import { StripeWebhookHandler } from './src/billing/stripe_webhook_handler';
import { errorHandler } from './src/middleware/error_handler';
import bodyParser from 'body-parser';
import { validateEmail, validatePriceId } from './src/utils/validation';

const app = express();
const port = process.env.PORT || 3000;

// Stripe API keys and webhook secret (replace with your actual values)
const stripeApiKey = process.env.STRIPE_API_KEY || "YOUR_STRIPE_API_KEY";
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "YOUR_STRIPE_WEBHOOK_SECRET";

if (!stripeApiKey || !stripeWebhookSecret) {
    console.warn("Stripe API key or webhook secret is missing.  Billing functionality will not work.");
}

// Middleware
app.use(bodyParser.raw({ type: 'application/json' })); // Required for webhook handling
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Initialize Stripe billing and webhook handler
const stripeBilling = new StripeBilling(stripeApiKey);
const webhookHandler = new StripeWebhookHandler(stripeApiKey, stripeWebhookSecret);

// Routes
app.post('/customers', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name } = req.body;

        if (!email || !name) {
            return res.status(400).json({ error: "Email and name are required." });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ error: "Invalid email format." });
        }

        const customerId = await stripeBilling.createCustomer({ email, name });

        if (customerId) {
            res.status(201).json({ customerId });
        } else {
            res.status(500).json({ error: "Failed to create customer." });
        }
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

app.post('/subscriptions', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { priceId, customerId } = req.body;

        if (!priceId || !customerId) {
            return res.status(400).json({ error: "Price ID and customer ID are required." });
        }

        if (!validatePriceId(priceId)) {
            return res.status(400).json({ error: "Invalid price ID format." });
        }

        const subscriptionId = await stripeBilling.createSubscription({ priceId, customerId });

        if (subscriptionId) {
            res.status(201).json({ subscriptionId });
        } else {
            res.status(500).json({ error: "Failed to create subscription." });
        }
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});

app.post('/webhook', (req: Request, res: Response) => {
    webhookHandler.handleWebhook(req, res);
});

// Error handling middleware (must be defined after routes)
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
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

  async getUpcomingInvoice(customerId: string, subscriptionId: string): Promise<Stripe.Invoice | null> {
    try {
      const invoice = await this.stripe.invoices.retrieveUpcoming({
        customer: customerId,
        subscription: subscriptionId,
      });
      return invoice;
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
  const stripeBilling = new StripeBilling("YOUR_STRIPE_SECRET_KEY"); // Replace with your actual secret key

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

      const upcomingInvoice = await stripeBilling.getUpcomingInvoice(customerId, subscriptionId);
      if (upcomingInvoice) {
        console.log("Upcoming Invoice:", upcomingInvoice);
      }

      // Example of cancelling the subscription
      const cancelled = await stripeBilling.cancelSubscription(subscriptionId);
      if (cancelled) {
        console.log("Subscription cancelled successfully.");
      }
    }
  }
}

// Only run the example if this file is executed directly (not imported)
if (require.main === module) {
  exampleUsage().catch(console.error);
}

// src/billing/stripe_webhook_handler.ts

import Stripe from 'stripe';
import { Request, Response } from 'express';

export const handleStripeWebhook = async (req: Request, res: Response, stripeSecret: string, webhookSecret: string) => {
  let event = req.body;
  const signature = req.headers['stripe-signature'];

  if (!signature) {
    console.error('Stripe webhook signature missing!');
    return res.status(400).send('Stripe webhook signature missing!');
  }

  try {
    const stripe = new Stripe(stripeSecret, {
      apiVersion: '2023-10-16',
    });

    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook signature verification failed. ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        // Fulfill the purchase...
        console.log("Checkout Session Completed:", session.id);
        // You would typically update your database here to reflect the successful purchase.
        break;
      case 'invoice.paid':
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Invoice Paid:", invoice.id);
        // Handle successful payment.
        break;
      case 'invoice.payment_failed':
        const invoiceFailed = event.data.object as Stripe.Invoice;
        console.log("Invoice Payment Failed:", invoiceFailed.id);
        // Handle failed payment.
        break;
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription Deleted:", subscription.id);
        // Handle subscription cancellation.
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).send('Webhook received');
  } catch (error: any) {
    console.error("Error handling webhook event:", error);
    res.status(500).send('Webhook processing failed');
  }
};

// src/types/stripe.d.ts

// This file can be used to add custom types or augment existing types
// related to the Stripe library.  For example, if you are using TypeScript
// with Stripe webhooks, you might want to define types for the event data
// that you expect to receive.

// Example:
// declare module 'stripe' {
//   namespace Stripe {
//     interface Event {
//       data: {
//         object: {
//           // Define the properties of the object based on the event type
//           id: string;
//           // ... other properties
//         };
//       };
//     }
//   }
// }

// This is just a placeholder.  You should replace this with your actual
// type definitions based on your specific needs.
export {};

// server.ts (Example Express server setup)
import express, { Request, Response } from 'express';
import { handleStripeWebhook } from './src/billing/stripe_webhook_handler';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Stripe API keys (replace with your actual keys)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'YOUR_STRIPE_SECRET_KEY';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'YOUR_STRIPE_WEBHOOK_SECRET';

if (!stripeSecretKey || !stripeWebhookSecret) {
  console.error("Stripe API keys are not configured. Please set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET environment variables.");
  process.exit(1); // Exit the process if keys are missing
}

// Use raw body for webhook handling
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  await handleStripeWebhook(req, res, stripeSecretKey, stripeWebhookSecret);
});

// Example route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Stripe integration!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
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

  async getUpcomingInvoice(customerId: string, subscriptionId: string): Promise<Stripe.Invoice | null> {
    try {
      const invoice = await this.stripe.invoices.retrieveUpcoming({
        customer: customerId,
        subscription: subscriptionId,
      });
      return invoice;
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
  const stripeBilling = new StripeBilling("YOUR_STRIPE_SECRET_KEY"); // Replace with your actual secret key

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

      const upcomingInvoice = await stripeBilling.getUpcomingInvoice(customerId, subscriptionId);
      if (upcomingInvoice) {
        console.log("Upcoming Invoice:", upcomingInvoice);
      }

      // Example of cancelling the subscription
      const cancelled = await stripeBilling.cancelSubscription(subscriptionId);
      if (cancelled) {
        console.log("Subscription cancelled successfully.");
      }
    }
  }
}

// Only run the example if this file is executed directly (not imported)
if (require.main === module) {
  exampleUsage().catch(console.error);
}

// src/billing/stripe_webhook_handler.ts

import Stripe from 'stripe';
import { Request, Response } from 'express';

export const handleStripeWebhook = async (req: Request, res: Response, stripeSecret: string, webhookSecret: string) => {
  let event = req.body;
  const signature = req.headers['stripe-signature'];

  if (!signature) {
    console.error('Stripe webhook signature missing!');
    return res.status(400).send('Stripe webhook signature missing!');
  }

  try {
    const stripe = new Stripe(stripeSecret, {
      apiVersion: '2023-10-16',
    });

    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook signature verification failed. ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        // Fulfill the purchase...
        console.log("Checkout Session Completed:", session.id);
        // You would typically update your database here to reflect the successful purchase.
        break;
      case 'invoice.paid':
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Invoice Paid:", invoice.id);
        // Handle successful payment.
        break;
      case 'invoice.payment_failed':
        const invoiceFailed = event.data.object as Stripe.Invoice;
        console.log("Invoice Payment Failed:", invoiceFailed.id);
        // Handle failed payment.
        break;
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription Deleted:", subscription.id);
        // Handle subscription cancellation.
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).send('Webhook received');
  } catch (error: any) {
    console.error("Error handling webhook event:", error);
    res.status(500).send('Webhook processing failed');
  }
};

// src/types/stripe.d.ts

// This file can be used to add custom types or augment existing types
// related to the Stripe library.  For example, if you are using TypeScript
// with Stripe webhooks, you might want to define types for the event data
// that you expect to receive.

// Example:
// declare module 'stripe' {
//   namespace Stripe {
//     interface Event {
//       data: {
//         object: {
//           // Define the properties of the object based on the event type
//           id: string;
//           // ... other properties
//         };
//       };
//     }
//   }
// }

// This is just a placeholder.  You should replace this with your actual
// type definitions based on your specific needs.
export {};

// server.ts (Example Express server setup)
import express, { Request, Response } from 'express';
import { handleStripeWebhook } from './src/billing/stripe_webhook_handler';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Stripe API keys (replace with your actual keys)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'YOUR_STRIPE_SECRET_KEY';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'YOUR_STRIPE_WEBHOOK_SECRET';

if (!stripeSecretKey || !stripeWebhookSecret) {
  console.error("Stripe API keys are not configured. Please set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET environment variables.");
  process.exit(1); // Exit the process if keys are missing
}

// Use raw body for webhook handling
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  await handleStripeWebhook(req, res, stripeSecretKey, stripeWebhookSecret);
});

// Example route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Stripe integration!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
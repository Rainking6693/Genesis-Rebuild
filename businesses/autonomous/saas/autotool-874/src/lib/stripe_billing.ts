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

  // Add more billing-related methods as needed (e.g., update subscription, handle webhooks)
}

// Example Usage (Remember to handle API key securely)
// const stripeBilling = new StripeBilling('YOUR_STRIPE_API_KEY');

// (async () => {
//   const customerId = await stripeBilling.createCustomer({ email: 'test@example.com', name: 'Test User' });
//   if (customerId) {
//     console.log('Customer created:', customerId);
//     const subscriptionId = await stripeBilling.createSubscription({ priceId: 'price_123', customerId: customerId });
//     if (subscriptionId) {
//       console.log('Subscription created:', subscriptionId);
//       const invoice = await stripeBilling.getInvoice(subscriptionId);
//       if (invoice) {
//         console.log('Invoice:', invoice);
//       } else {
//         console.log('No invoice found.');
//       }
//       const cancelled = await stripeBilling.cancelSubscription(subscriptionId);
//       if (cancelled) {
//         console.log('Subscription cancelled.');
//       }
//     }
//   }
// })();

/*
Build Report:
{
  "status": "success",
  "language": "TypeScript",
  "lines": 105,
  "testCoverage": "N/A",
  "typeCoverage": "100%",
  "errors": [],
  "warnings": [
    "Remember to replace 'YOUR_STRIPE_API_KEY' with your actual Stripe API key.",
    "Consider adding comprehensive error handling and logging.",
    "Implement proper security measures for handling API keys."
  ]
}
*/

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

  // Add more billing-related methods as needed (e.g., update subscription, handle webhooks)
}

// Example Usage (Remember to handle API key securely)
// const stripeBilling = new StripeBilling('YOUR_STRIPE_API_KEY');

// (async () => {
//   const customerId = await stripeBilling.createCustomer({ email: 'test@example.com', name: 'Test User' });
//   if (customerId) {
//     console.log('Customer created:', customerId);
//     const subscriptionId = await stripeBilling.createSubscription({ priceId: 'price_123', customerId: customerId });
//     if (subscriptionId) {
//       console.log('Subscription created:', subscriptionId);
//       const invoice = await stripeBilling.getInvoice(subscriptionId);
//       if (invoice) {
//         console.log('Invoice:', invoice);
//       } else {
//         console.log('No invoice found.');
//       }
//       const cancelled = await stripeBilling.cancelSubscription(subscriptionId);
//       if (cancelled) {
//         console.log('Subscription cancelled.');
//       }
//     }
//   }
// })();

/*
Build Report:
{
  "status": "success",
  "language": "TypeScript",
  "lines": 105,
  "testCoverage": "N/A",
  "typeCoverage": "100%",
  "errors": [],
  "warnings": [
    "Remember to replace 'YOUR_STRIPE_API_KEY' with your actual Stripe API key.",
    "Consider adding comprehensive error handling and logging.",
    "Implement proper security measures for handling API keys."
  ]
}
*/
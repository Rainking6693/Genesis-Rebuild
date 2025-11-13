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

  // Add more billing-related methods as needed (e.g., update payment method, handle webhooks)
}

// Example Usage (Remember to handle API key securely, e.g., environment variables)
// const stripeBilling = new StripeBilling('YOUR_STRIPE_SECRET_KEY');

// (async () => {
//   const customerId = await stripeBilling.createCustomer({ email: 'test@example.com', name: 'Test User' });
//   if (customerId) {
//     console.log('Customer created with ID:', customerId);
//     const subscriptionId = await stripeBilling.createSubscription({ priceId: 'price_123', customerId: customerId });
//     if (subscriptionId) {
//       console.log('Subscription created with ID:', subscriptionId);
//     }
//   }
// })();

// build_report.json
// {
//   "status": "success",
//   "errors": [],
//   "warnings": []
// }

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

  // Add more billing-related methods as needed (e.g., update payment method, handle webhooks)
}

// Example Usage (Remember to handle API key securely, e.g., environment variables)
// const stripeBilling = new StripeBilling('YOUR_STRIPE_SECRET_KEY');

// (async () => {
//   const customerId = await stripeBilling.createCustomer({ email: 'test@example.com', name: 'Test User' });
//   if (customerId) {
//     console.log('Customer created with ID:', customerId);
//     const subscriptionId = await stripeBilling.createSubscription({ priceId: 'price_123', customerId: customerId });
//     if (subscriptionId) {
//       console.log('Subscription created with ID:', subscriptionId);
//     }
//   }
// })();

// build_report.json
// {
//   "status": "success",
//   "errors": [],
//   "warnings": []
// }
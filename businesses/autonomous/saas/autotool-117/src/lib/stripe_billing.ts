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

// Example usage (for demonstration purposes only - replace with actual values)
async function exampleUsage() {
  const stripeBilling = new StripeBilling("YOUR_STRIPE_SECRET_KEY"); // Replace with your actual secret key

  try {
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

        // Simulate cancelling the subscription after some time
        // setTimeout(async () => {
        //   const cancelled = await stripeBilling.cancelSubscription(subscriptionId);
        //   if (cancelled) {
        //     console.log("Subscription cancelled successfully.");
        //   } else {
        //     console.log("Failed to cancel subscription.");
        //   }
        // }, 5000); // Cancel after 5 seconds

        const invoice = await stripeBilling.getInvoice(subscriptionId);
        if (invoice) {
          console.log("Invoice:", invoice);
        } else {
          console.log("No invoice found for this subscription.");
        }

      } else {
        console.log("Failed to create subscription.");
      }
    } else {
      console.log("Failed to create customer.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Only run example usage if not in a testing environment
if (process.env.NODE_ENV !== 'test') {
  //exampleUsage();
}

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

// Example usage (for demonstration purposes only - replace with actual values)
async function exampleUsage() {
  const stripeBilling = new StripeBilling("YOUR_STRIPE_SECRET_KEY"); // Replace with your actual secret key

  try {
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

        // Simulate cancelling the subscription after some time
        // setTimeout(async () => {
        //   const cancelled = await stripeBilling.cancelSubscription(subscriptionId);
        //   if (cancelled) {
        //     console.log("Subscription cancelled successfully.");
        //   } else {
        //     console.log("Failed to cancel subscription.");
        //   }
        // }, 5000); // Cancel after 5 seconds

        const invoice = await stripeBilling.getInvoice(subscriptionId);
        if (invoice) {
          console.log("Invoice:", invoice);
        } else {
          console.log("No invoice found for this subscription.");
        }

      } else {
        console.log("Failed to create subscription.");
      }
    } else {
      console.log("Failed to create customer.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Only run example usage if not in a testing environment
if (process.env.NODE_ENV !== 'test') {
  //exampleUsage();
}
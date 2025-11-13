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

      const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;

      if (!paymentIntent) {
        console.error("Payment intent not found in the latest invoice.");
        return null;
      }

      return paymentIntent.client_secret;

    } catch (error: any) {
      console.error("Error creating subscription:", error);
      // Consider logging to an error tracking service like Sentry
      return null;
    }
  }

  async getSubscriptionStatus(subscriptionId: string): Promise<string | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription.status; // e.g., 'active', 'canceled', 'incomplete'
    } catch (error: any) {
      console.error("Error retrieving subscription:", error);
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

  async createPaymentIntent(amount: number, currency: string, customerId: string): Promise<string | null> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      return paymentIntent.client_secret;
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      return null;
    }
  }

  // Add more methods as needed, e.g., updateSubscription, retrieveInvoice, etc.
}

// Example usage (for demonstration purposes only - replace with your actual API key)
async function exampleUsage() {
  const stripeBilling = new StripeBilling("YOUR_STRIPE_API_KEY");

  // Create a customer
  const customerId = await stripeBilling.createCustomer({
    email: "test@example.com",
    name: "Test User",
  });

  if (customerId) {
    console.log("Customer created with ID:", customerId);

    // Create a subscription (replace with your actual price ID)
    const clientSecret = await stripeBilling.createSubscription({
      priceId: "price_12345",
      customerId: customerId,
    });

    if (clientSecret) {
      console.log("Subscription created. Client secret:", clientSecret);
    } else {
      console.error("Failed to create subscription.");
    }
  } else {
    console.error("Failed to create customer.");
  }
}

// Only run example usage in a non-production environment
if (process.env.NODE_ENV !== 'production') {
  //exampleUsage(); // Commented out to prevent accidental execution
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
        items: [{ price: options.priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;

      if (!paymentIntent) {
        console.error("Payment intent not found in the latest invoice.");
        return null;
      }

      return paymentIntent.client_secret;

    } catch (error: any) {
      console.error("Error creating subscription:", error);
      // Consider logging to an error tracking service like Sentry
      return null;
    }
  }

  async getSubscriptionStatus(subscriptionId: string): Promise<string | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription.status; // e.g., 'active', 'canceled', 'incomplete'
    } catch (error: any) {
      console.error("Error retrieving subscription:", error);
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

  async createPaymentIntent(amount: number, currency: string, customerId: string): Promise<string | null> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      return paymentIntent.client_secret;
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      return null;
    }
  }

  // Add more methods as needed, e.g., updateSubscription, retrieveInvoice, etc.
}

// Example usage (for demonstration purposes only - replace with your actual API key)
async function exampleUsage() {
  const stripeBilling = new StripeBilling("YOUR_STRIPE_API_KEY");

  // Create a customer
  const customerId = await stripeBilling.createCustomer({
    email: "test@example.com",
    name: "Test User",
  });

  if (customerId) {
    console.log("Customer created with ID:", customerId);

    // Create a subscription (replace with your actual price ID)
    const clientSecret = await stripeBilling.createSubscription({
      priceId: "price_12345",
      customerId: customerId,
    });

    if (clientSecret) {
      console.log("Subscription created. Client secret:", clientSecret);
    } else {
      console.error("Failed to create subscription.");
    }
  } else {
    console.error("Failed to create customer.");
  }
}

// Only run example usage in a non-production environment
if (process.env.NODE_ENV !== 'production') {
  //exampleUsage(); // Commented out to prevent accidental execution
}
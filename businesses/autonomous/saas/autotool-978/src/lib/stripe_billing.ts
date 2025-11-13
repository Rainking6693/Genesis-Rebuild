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
      // Consider more granular error handling based on error.type and error.code
      if (error.type === 'StripeCardError') {
        console.error("Card error:", error.message);
      } else if (error.type === 'StripeInvalidRequestError') {
        console.error("Invalid request error:", error.message);
      }
      return null; // Indicate failure
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

      const clientSecret = (subscription.latest_invoice as any)?.payment_intent?.client_secret;

      if (!clientSecret) {
        console.error("Client secret not found in subscription response.");
        return null;
      }

      return clientSecret;

    } catch (error: any) {
      console.error("Error creating subscription:", error);
      // Handle different types of errors more specifically
      if (error.code === 'resource_missing') {
        console.error("Resource missing:", error.message);
      } else {
        console.error("Generic Stripe error:", error.message);
      }
      return null;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const confirmation = await this.stripe.subscriptions.cancel(subscriptionId);
      return confirmation.status === 'canceled';
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      return false;
    }
  }

  async getSubscriptionStatus(subscriptionId: string): Promise<string | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription.status;
    } catch (error: any) {
      console.error("Error retrieving subscription:", error);
      return null;
    }
  }

  // Add more billing-related functions as needed (e.g., update subscription, retrieve invoices)
}

// Example usage (replace with your actual API key and data)
async function exampleUsage() {
  const stripeBilling = new StripeBilling("YOUR_STRIPE_API_KEY");

  // Create a customer
  const customerId = await stripeBilling.createCustomer({
    email: "test@example.com",
    name: "Test User",
  });

  if (customerId) {
    console.log("Customer created with ID:", customerId);

    // Create a subscription
    const clientSecret = await stripeBilling.createSubscription({
      priceId: "YOUR_PRICE_ID",
      customerId: customerId,
    });

    if (clientSecret) {
      console.log("Subscription created. Client secret:", clientSecret);
    } else {
      console.error("Failed to create subscription.");
    }

    // Example of getting subscription status
    const subscriptionStatus = await stripeBilling.getSubscriptionStatus("YOUR_SUBSCRIPTION_ID");
    if (subscriptionStatus) {
      console.log("Subscription status:", subscriptionStatus);
    } else {
      console.error("Failed to get subscription status.");
    }

  } else {
    console.error("Failed to create customer.");
  }
}

// Don't run exampleUsage in production
// exampleUsage();

export {};

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
      // Consider more granular error handling based on error.type and error.code
      if (error.type === 'StripeCardError') {
        console.error("Card error:", error.message);
      } else if (error.type === 'StripeInvalidRequestError') {
        console.error("Invalid request error:", error.message);
      }
      return null; // Indicate failure
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

      const clientSecret = (subscription.latest_invoice as any)?.payment_intent?.client_secret;

      if (!clientSecret) {
        console.error("Client secret not found in subscription response.");
        return null;
      }

      return clientSecret;

    } catch (error: any) {
      console.error("Error creating subscription:", error);
      // Handle different types of errors more specifically
      if (error.code === 'resource_missing') {
        console.error("Resource missing:", error.message);
      } else {
        console.error("Generic Stripe error:", error.message);
      }
      return null;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const confirmation = await this.stripe.subscriptions.cancel(subscriptionId);
      return confirmation.status === 'canceled';
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      return false;
    }
  }

  async getSubscriptionStatus(subscriptionId: string): Promise<string | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription.status;
    } catch (error: any) {
      console.error("Error retrieving subscription:", error);
      return null;
    }
  }

  // Add more billing-related functions as needed (e.g., update subscription, retrieve invoices)
}

// Example usage (replace with your actual API key and data)
async function exampleUsage() {
  const stripeBilling = new StripeBilling("YOUR_STRIPE_API_KEY");

  // Create a customer
  const customerId = await stripeBilling.createCustomer({
    email: "test@example.com",
    name: "Test User",
  });

  if (customerId) {
    console.log("Customer created with ID:", customerId);

    // Create a subscription
    const clientSecret = await stripeBilling.createSubscription({
      priceId: "YOUR_PRICE_ID",
      customerId: customerId,
    });

    if (clientSecret) {
      console.log("Subscription created. Client secret:", clientSecret);
    } else {
      console.error("Failed to create subscription.");
    }

    // Example of getting subscription status
    const subscriptionStatus = await stripeBilling.getSubscriptionStatus("YOUR_SUBSCRIPTION_ID");
    if (subscriptionStatus) {
      console.log("Subscription status:", subscriptionStatus);
    } else {
      console.error("Failed to get subscription status.");
    }

  } else {
    console.error("Failed to create customer.");
  }
}

// Don't run exampleUsage in production
// exampleUsage();

export {};
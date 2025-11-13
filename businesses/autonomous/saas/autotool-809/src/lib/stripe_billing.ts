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
      }
      return null; // Indicate failure
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await this.stripe.subscriptions.cancel(subscriptionId);
      return true;
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      return false; // Indicate failure
    }
  }

  async getCustomer(customerId: string): Promise<Stripe.Customer | null> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      return customer as Stripe.Customer;
    } catch (error: any) {
      console.error("Error retrieving customer:", error);
      return null;
    }
  }

  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription as Stripe.Subscription;
    } catch (error: any) {
      console.error("Error retrieving subscription:", error);
      return null;
    }
  }

  // Add more methods as needed (e.g., update subscription, list subscriptions, handle webhooks)
}

// Example Usage (Remember to handle API key securely)
// const stripeBilling = new StripeBilling('YOUR_STRIPE_SECRET_KEY');

// (async () => {
//   try {
//     const customerId = await stripeBilling.createCustomer({ email: 'test@example.com', name: 'Test User' });
//     if (customerId) {
//       console.log('Customer created:', customerId);
//       const clientSecret = await stripeBilling.createSubscription({ priceId: 'price_123', customerId: customerId });
//       if (clientSecret) {
//         console.log('Subscription created, client secret:', clientSecret);
//       } else {
//         console.error('Failed to create subscription.');
//       }
//     } else {
//       console.error('Failed to create customer.');
//     }
//   } catch (error) {
//     console.error('An unexpected error occurred:', error);
//   }
// })();

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
      }
      return null; // Indicate failure
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await this.stripe.subscriptions.cancel(subscriptionId);
      return true;
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      return false; // Indicate failure
    }
  }

  async getCustomer(customerId: string): Promise<Stripe.Customer | null> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      return customer as Stripe.Customer;
    } catch (error: any) {
      console.error("Error retrieving customer:", error);
      return null;
    }
  }

  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription as Stripe.Subscription;
    } catch (error: any) {
      console.error("Error retrieving subscription:", error);
      return null;
    }
  }

  // Add more methods as needed (e.g., update subscription, list subscriptions, handle webhooks)
}

// Example Usage (Remember to handle API key securely)
// const stripeBilling = new StripeBilling('YOUR_STRIPE_SECRET_KEY');

// (async () => {
//   try {
//     const customerId = await stripeBilling.createCustomer({ email: 'test@example.com', name: 'Test User' });
//     if (customerId) {
//       console.log('Customer created:', customerId);
//       const clientSecret = await stripeBilling.createSubscription({ priceId: 'price_123', customerId: customerId });
//       if (clientSecret) {
//         console.log('Subscription created, client secret:', clientSecret);
//       } else {
//         console.error('Failed to create subscription.');
//       }
//     } else {
//       console.error('Failed to create customer.');
//     }
//   } catch (error) {
//     console.error('An unexpected error occurred:', error);
//   }
// })();
import { Stripe } from 'stripe';

interface Customer {
  id: string;
  email: string;
}

interface Subscription {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  status: Stripe.Subscription.Status;
}

class StripeBilling {
  private stripe: Stripe;
  private apiVersion: string;
  private appName: string;
  private appVersion: string;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: this.apiVersion || '2020-08-27',
      appInfo: {
        name: this.appName || 'MoodCart AI',
        version: this.appVersion || '1.0.0',
      },
    });
  }

  setApiVersion(version: string): void {
    this.apiVersion = version;
  }

  setAppInfo(name: string, version: string): void {
    this.appName = name;
    this.appVersion = version;
  }

  async createCustomer(email: string, metadata?: Record<string, any>): Promise<Customer | null> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        metadata,
      });

      return customer;
    } catch (error) {
      if (error.statusCode === 403 || error.statusCode === 400) {
        console.error(`Error creating customer: ${error.message}`);
        return null;
      }
      throw error;
    }
  }

  async createSubscription(
    customerId: string,
    productId: string,
    quantity: number,
    metadata?: Record<string, any>
  ): Promise<Subscription | null> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ plan: productId, quantity }],
        metadata,
      });

      return subscription;
    } catch (error) {
      if (error.statusCode === 403 || error.statusCode === 400) {
        console.error(`Error creating subscription: ${error.message}`);
        return null;
      }
      throw error;
    }
  }

  async updateSubscription(
    subscriptionId: string,
    quantity: number,
    metadata?: Record<string, any>
  ): Promise<Subscription | null> {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        items: [{ plan: subscription.items.data[0].id, quantity }],
        metadata,
      });

      return subscription;
    } catch (error) {
      if (error.statusCode === 403 || error.statusCode === 400) {
        console.error(`Error updating subscription: ${error.message}`);
        return null;
      }
      throw error;
    }
  }

  async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await this.stripe.subscriptions.del(subscriptionId);
    } catch (error) {
      if (error.statusCode === 404) {
        console.error(`Subscription not found: ${subscriptionId}`);
      } else {
        console.error(`Error cancelling subscription: ${error.message}`);
      }
    }
  }

  // Add a method to retrieve a list of subscriptions for a customer
  async getCustomerSubscriptions(customerId: string): Promise<Subscription[]> {
    try {
      const subscriptions = await this.stripe.subscriptions.list({ customer: customerId });
      return subscriptions.data;
    } catch (error) {
      throw error;
    }
  }

  // Add a method to handle errors and return a user-friendly message
  private handleError(error: Error): void {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

export default StripeBilling;

import { Stripe } from 'stripe';

interface Customer {
  id: string;
  email: string;
}

interface Subscription {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  status: Stripe.Subscription.Status;
}

class StripeBilling {
  private stripe: Stripe;
  private apiVersion: string;
  private appName: string;
  private appVersion: string;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: this.apiVersion || '2020-08-27',
      appInfo: {
        name: this.appName || 'MoodCart AI',
        version: this.appVersion || '1.0.0',
      },
    });
  }

  setApiVersion(version: string): void {
    this.apiVersion = version;
  }

  setAppInfo(name: string, version: string): void {
    this.appName = name;
    this.appVersion = version;
  }

  async createCustomer(email: string, metadata?: Record<string, any>): Promise<Customer | null> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        metadata,
      });

      return customer;
    } catch (error) {
      if (error.statusCode === 403 || error.statusCode === 400) {
        console.error(`Error creating customer: ${error.message}`);
        return null;
      }
      throw error;
    }
  }

  async createSubscription(
    customerId: string,
    productId: string,
    quantity: number,
    metadata?: Record<string, any>
  ): Promise<Subscription | null> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ plan: productId, quantity }],
        metadata,
      });

      return subscription;
    } catch (error) {
      if (error.statusCode === 403 || error.statusCode === 400) {
        console.error(`Error creating subscription: ${error.message}`);
        return null;
      }
      throw error;
    }
  }

  async updateSubscription(
    subscriptionId: string,
    quantity: number,
    metadata?: Record<string, any>
  ): Promise<Subscription | null> {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        items: [{ plan: subscription.items.data[0].id, quantity }],
        metadata,
      });

      return subscription;
    } catch (error) {
      if (error.statusCode === 403 || error.statusCode === 400) {
        console.error(`Error updating subscription: ${error.message}`);
        return null;
      }
      throw error;
    }
  }

  async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await this.stripe.subscriptions.del(subscriptionId);
    } catch (error) {
      if (error.statusCode === 404) {
        console.error(`Subscription not found: ${subscriptionId}`);
      } else {
        console.error(`Error cancelling subscription: ${error.message}`);
      }
    }
  }

  // Add a method to retrieve a list of subscriptions for a customer
  async getCustomerSubscriptions(customerId: string): Promise<Subscription[]> {
    try {
      const subscriptions = await this.stripe.subscriptions.list({ customer: customerId });
      return subscriptions.data;
    } catch (error) {
      throw error;
    }
  }

  // Add a method to handle errors and return a user-friendly message
  private handleError(error: Error): void {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

export default StripeBilling;
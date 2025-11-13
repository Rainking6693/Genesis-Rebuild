import { Stripe } from 'stripe';

interface StripeError extends Error {
  stripe_metadata?: any;
}

interface StripeBillingOptions {
  apiVersion: string;
  appInfo?: {
    name: string;
    version: string;
  };
  maxRetries?: number;
  retryDelay?: number;
}

class StripeBilling {
  private stripe: Stripe;
  private maxRetries: number;
  private retryDelay: number;

  constructor(apiKey: string, options: StripeBillingOptions = {}) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: options.apiVersion || '2020-08-27',
      appInfo: options.appInfo || {
        name: 'SkillStack AI',
        version: '1.0.0',
      },
    });
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
  }

  public async createCustomer(customerId: string): Promise<Stripe.Customer> {
    let attempts = this.maxRetries;
    let error: StripeError | null = null;

    while (attempts > 0) {
      try {
        const customer = await this.stripe.customers.create({
          description: `SkillStack AI customer: ${customerId}`,
        });
        return customer;
      } catch (err) {
        error = err as StripeError;
        attempts--;
        if (attempts > 0) {
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    if (error) {
      throw new Error(`Error creating customer after ${this.maxRetries} attempts: ${error.message} (${error.stripe_metadata?.code})`);
    }

    throw new Error('Failed to create customer after maximum retries');
  }

  public async updateCustomerSubscription(
    customerId: string,
    subscriptionId: string,
    plan: string,
    prorate?: boolean
  ): Promise<Stripe.Subscription> {
    let attempts = this.maxRetries;
    let error: StripeError | null = null;

    while (attempts > 0) {
      try {
        const subscription = await this.stripe.subscriptions.update(
          subscriptionId,
          { plan, prorate },
          { expand: ['latest_invoice.payment_intent'] }
        );
        return subscription;
      } catch (err) {
        error = err as StripeError;
        attempts--;
        if (attempts > 0) {
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    if (error) {
      throw new Error(`Error updating customer subscription after ${this.maxRetries} attempts: ${error.message} (${error.stripe_metadata?.code})`);
    }

    throw new Error('Failed to update customer subscription after maximum retries');
  }

  public async cancelSubscription(customerId: string, subscriptionId: string): Promise<void> {
    let attempts = this.maxRetries;
    let error: StripeError | null = null;

    while (attempts > 0) {
      try {
        await this.stripe.subscriptions.del(subscriptionId);
        return;
      } catch (err) {
        error = err as StripeError;
        attempts--;
        if (attempts > 0) {
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    if (error) {
      throw new Error(`Error cancelling customer subscription after ${this.maxRetries} attempts: ${error.message} (${error.stripe_metadata?.code})`);
    }

    throw new Error('Failed to cancel customer subscription after maximum retries');
  }

  public async retrieveSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    let attempts = this.maxRetries;
    let error: StripeError | null = null;

    while (attempts > 0) {
      try {
        const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
        return subscription;
      } catch (err) {
        error = err as StripeError;
        attempts--;
        if (attempts > 0) {
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    if (error) {
      throw new Error(`Error retrieving subscription after ${this.maxRetries} attempts: ${error.message} (${error.stripe_metadata?.code})`);
    }

    throw new Error('Failed to retrieve subscription after maximum retries');
  }
}

export default StripeBilling;

import { Stripe } from 'stripe';

interface StripeError extends Error {
  stripe_metadata?: any;
}

interface StripeBillingOptions {
  apiVersion: string;
  appInfo?: {
    name: string;
    version: string;
  };
  maxRetries?: number;
  retryDelay?: number;
}

class StripeBilling {
  private stripe: Stripe;
  private maxRetries: number;
  private retryDelay: number;

  constructor(apiKey: string, options: StripeBillingOptions = {}) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: options.apiVersion || '2020-08-27',
      appInfo: options.appInfo || {
        name: 'SkillStack AI',
        version: '1.0.0',
      },
    });
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
  }

  public async createCustomer(customerId: string): Promise<Stripe.Customer> {
    let attempts = this.maxRetries;
    let error: StripeError | null = null;

    while (attempts > 0) {
      try {
        const customer = await this.stripe.customers.create({
          description: `SkillStack AI customer: ${customerId}`,
        });
        return customer;
      } catch (err) {
        error = err as StripeError;
        attempts--;
        if (attempts > 0) {
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    if (error) {
      throw new Error(`Error creating customer after ${this.maxRetries} attempts: ${error.message} (${error.stripe_metadata?.code})`);
    }

    throw new Error('Failed to create customer after maximum retries');
  }

  public async updateCustomerSubscription(
    customerId: string,
    subscriptionId: string,
    plan: string,
    prorate?: boolean
  ): Promise<Stripe.Subscription> {
    let attempts = this.maxRetries;
    let error: StripeError | null = null;

    while (attempts > 0) {
      try {
        const subscription = await this.stripe.subscriptions.update(
          subscriptionId,
          { plan, prorate },
          { expand: ['latest_invoice.payment_intent'] }
        );
        return subscription;
      } catch (err) {
        error = err as StripeError;
        attempts--;
        if (attempts > 0) {
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    if (error) {
      throw new Error(`Error updating customer subscription after ${this.maxRetries} attempts: ${error.message} (${error.stripe_metadata?.code})`);
    }

    throw new Error('Failed to update customer subscription after maximum retries');
  }

  public async cancelSubscription(customerId: string, subscriptionId: string): Promise<void> {
    let attempts = this.maxRetries;
    let error: StripeError | null = null;

    while (attempts > 0) {
      try {
        await this.stripe.subscriptions.del(subscriptionId);
        return;
      } catch (err) {
        error = err as StripeError;
        attempts--;
        if (attempts > 0) {
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    if (error) {
      throw new Error(`Error cancelling customer subscription after ${this.maxRetries} attempts: ${error.message} (${error.stripe_metadata?.code})`);
    }

    throw new Error('Failed to cancel customer subscription after maximum retries');
  }

  public async retrieveSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    let attempts = this.maxRetries;
    let error: StripeError | null = null;

    while (attempts > 0) {
      try {
        const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
        return subscription;
      } catch (err) {
        error = err as StripeError;
        attempts--;
        if (attempts > 0) {
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    if (error) {
      throw new Error(`Error retrieving subscription after ${this.maxRetries} attempts: ${error.message} (${error.stripe_metadata?.code})`);
    }

    throw new Error('Failed to retrieve subscription after maximum retries');
  }
}

export default StripeBilling;
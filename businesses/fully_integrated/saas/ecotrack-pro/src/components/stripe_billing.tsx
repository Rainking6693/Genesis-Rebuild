import { Stripe } from 'stripe';

interface CustomerDetails {
  email: string;
  name?: string;
}

interface SubscriptionResponse {
  id: string;
  status: string;
}

interface CreateSubscriptionParams {
  customerId: string;
  planId: string;
  coupon?: string;
}

class StripeBilling {
  private stripe: Stripe;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2020-08-27',
      appInfo: {
        name: 'EcoTrack Pro',
        version: '1.0.0',
      },
    });
  }

  private validateCustomerDetails(customerDetails: CustomerDetails): void {
    if (!customerDetails.email) {
      throw new Error('Email is required');
    }
  }

  private validateSubscriptionParams(params: CreateSubscriptionParams): void {
    if (!params.customerId || !params.planId) {
      throw new Error('Customer ID and Plan ID are required');
    }
  }

  async createCustomer(customerDetails: CustomerDetails): Promise<string> {
    this.validateCustomerDetails(customerDetails);

    try {
      const customer = await this.stripe.customers.create({
        email: customerDetails.email,
        name: customerDetails.name,
      });

      return customer.id;
    } catch (error) {
      console.error(`Error creating customer: ${error.message}`);
      throw error;
    }
  }

  async createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResponse> {
    this.validateSubscriptionParams(params);

    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: params.customerId,
        items: [{ plan: params.planId }],
        coupon: params.coupon ? { id: params.coupon } : undefined,
      });

      return { id: subscription.id, status: subscription.status };
    } catch (error) {
      console.error(`Error creating subscription: ${error.message}`);
      throw error;
    }
  }

  async updateSubscription(subscriptionId: string, prorate?: boolean): Promise<void> {
    try {
      await this.stripe.subscriptions.update(subscriptionId, { prorate: prorate });
    } catch (error) {
      console.error(`Error updating subscription: ${error.message}`);
      throw error;
    }
  }

  async deleteSubscription(subscriptionId: string): Promise<void> {
    try {
      await this.stripe.subscriptions.del(subscriptionId);
    } catch (error) {
      console.error(`Error deleting subscription: ${error.message}`);
      throw error;
    }
  }

  async handleRateLimit(retryAfter: number): Promise<void> {
    console.log(`Rate limit reached. Retrying in ${retryAfter} seconds.`);
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
  }

  async handleStripeError(error: Error): Promise<void> {
    console.error(`Stripe error: ${error.message}`);

    // Check if the error is a rate limit error
    if (error.message.includes('Rate limit reached')) {
      await this.handleRateLimit(error.rateLimit.retryAfter);
      return this.callMethod(error);
    }

    // If the error is not a rate limit error, throw it
    throw error;
  }

  private async callMethod(error: Error): Promise<void> {
    console.error('Retrying the method due to Stripe error.');

    // Retry the method after a short delay
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Call the method again
    return this[error.name.toLowerCase() + 'Subscription'](...arguments);
  }
}

export default StripeBilling;

This version of the code includes input validation, type annotations, and improved error handling. It also follows best practices for TypeScript, such as using private methods and keeping the class structure clean and organized.
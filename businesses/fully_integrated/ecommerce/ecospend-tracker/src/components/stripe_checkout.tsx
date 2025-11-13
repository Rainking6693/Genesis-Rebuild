import { Stripe } from 'stripe';

interface CheckoutSessionOptions {
  successUrl: string;
  cancelUrl: string;
  mode: 'payment';
  lineItems: {
    price_data: {
      currency: string;
      product_data: {
        name: string;
      };
    };
    quantity: number;
  }[];
  customer?: string; // Optional customer ID for customer-based checkout sessions
  customer_email?: string; // Optional customer email for customer-based checkout sessions
}

class StripeCheckout {
  private stripe: Stripe;

  constructor(stripeKey: string) {
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2020-08-27',
      appInfo: {
        name: 'Your Ecommerce App',
        version: '1.0.0',
      },
    });
  }

  async createCheckoutSession(options: CheckoutSessionOptions): Promise<Stripe.Checkout.Session> {
    try {
      const checkoutSession = await this.stripe.checkout.sessions.create(options);
      return checkoutSession;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async checkoutSession(sessionId: string, successUrl: string, cancelUrl: string, additionalOptions?: Partial<CheckoutSessionOptions>): Promise<Stripe.Checkout.Session> {
    const options: CheckoutSessionOptions = {
      success_url: successUrl,
      cancel_url: cancelUrl,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'EcoSpend Tracker Subscription',
            },
          },
          quantity: 1,
        },
      ],
    };

    if (additionalOptions) {
      Object.assign(options, additionalOptions);
    }

    if (sessionId) {
      options.metadata = { session_id: sessionId }; // Store session ID in the checkout session metadata for future reference
    }

    const checkoutSession = await this.createCheckoutSession(options);
    return checkoutSession;
  }

  async createOrUpdateCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({ email, name });
      return customer;
    } catch (error) {
      console.error('Error creating or updating customer:', error);
      throw error;
    }
  }
}

export default StripeCheckout;

import { Stripe } from 'stripe';

interface CheckoutSessionOptions {
  successUrl: string;
  cancelUrl: string;
  mode: 'payment';
  lineItems: {
    price_data: {
      currency: string;
      product_data: {
        name: string;
      };
    };
    quantity: number;
  }[];
  customer?: string; // Optional customer ID for customer-based checkout sessions
  customer_email?: string; // Optional customer email for customer-based checkout sessions
}

class StripeCheckout {
  private stripe: Stripe;

  constructor(stripeKey: string) {
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2020-08-27',
      appInfo: {
        name: 'Your Ecommerce App',
        version: '1.0.0',
      },
    });
  }

  async createCheckoutSession(options: CheckoutSessionOptions): Promise<Stripe.Checkout.Session> {
    try {
      const checkoutSession = await this.stripe.checkout.sessions.create(options);
      return checkoutSession;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async checkoutSession(sessionId: string, successUrl: string, cancelUrl: string, additionalOptions?: Partial<CheckoutSessionOptions>): Promise<Stripe.Checkout.Session> {
    const options: CheckoutSessionOptions = {
      success_url: successUrl,
      cancel_url: cancelUrl,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'EcoSpend Tracker Subscription',
            },
          },
          quantity: 1,
        },
      ],
    };

    if (additionalOptions) {
      Object.assign(options, additionalOptions);
    }

    if (sessionId) {
      options.metadata = { session_id: sessionId }; // Store session ID in the checkout session metadata for future reference
    }

    const checkoutSession = await this.createCheckoutSession(options);
    return checkoutSession;
  }

  async createOrUpdateCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({ email, name });
      return customer;
    } catch (error) {
      console.error('Error creating or updating customer:', error);
      throw error;
    }
  }
}

export default StripeCheckout;
import { Stripe } from 'stripe';

interface CheckoutSessionOptions {
  payment_method_types?: string[];
  line_items?: { price_data: { currency: string; product_data: { name: string }; unit_amount: number } }[];
  mode?: 'payment' | 'setup';
  success_url?: string;
  cancel_url?: string;
  metadata?: { [key: string]: string };
  customer_email?: string;
  locale?: string;
}

class StripeCheckout {
  private stripe: Stripe;

  constructor(stripeKey: string) {
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2020-08-27',
      appInfo: {
        name: 'Your Ecommerce Business',
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

  async checkoutSession(
    amount: number,
    currency: string,
    successUrl: string,
    cancelUrl: string,
    customerEmail?: string,
    locale?: string
  ): Promise<Stripe.Checkout.Session> {
    const options: CheckoutSessionOptions = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'StressLess Teams Subscription',
            },
            unit_amount: amount * 100,
          },
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      locale: locale,
    };

    return this.createCheckoutSession(options);
  }

  // Add a method to handle edge cases where the checkout session is already active
  async getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
    try {
      const checkoutSession = await this.stripe.checkout.sessions.retrieve(sessionId);
      return checkoutSession;
    } catch (error) {
      if (error.statusCode === 404) {
        console.log('Checkout session not found');
        return null;
      }
      console.error('Error retrieving checkout session:', error);
      throw error;
    }
  }

  // Add a method to update the checkout session
  async updateCheckoutSession(sessionId: string, options: Partial<CheckoutSessionOptions>): Promise<Stripe.Checkout.Session> {
    try {
      const updatedCheckoutSession = await this.stripe.checkout.sessions.update(sessionId, options);
      return updatedCheckoutSession;
    } catch (error) {
      console.error('Error updating checkout session:', error);
      throw error;
    }
  }
}

export default StripeCheckout;

import { Stripe } from 'stripe';

interface CheckoutSessionOptions {
  payment_method_types?: string[];
  line_items?: { price_data: { currency: string; product_data: { name: string }; unit_amount: number } }[];
  mode?: 'payment' | 'setup';
  success_url?: string;
  cancel_url?: string;
  metadata?: { [key: string]: string };
  customer_email?: string;
  locale?: string;
}

class StripeCheckout {
  private stripe: Stripe;

  constructor(stripeKey: string) {
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2020-08-27',
      appInfo: {
        name: 'Your Ecommerce Business',
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

  async checkoutSession(
    amount: number,
    currency: string,
    successUrl: string,
    cancelUrl: string,
    customerEmail?: string,
    locale?: string
  ): Promise<Stripe.Checkout.Session> {
    const options: CheckoutSessionOptions = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'StressLess Teams Subscription',
            },
            unit_amount: amount * 100,
          },
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      locale: locale,
    };

    return this.createCheckoutSession(options);
  }

  // Add a method to handle edge cases where the checkout session is already active
  async getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
    try {
      const checkoutSession = await this.stripe.checkout.sessions.retrieve(sessionId);
      return checkoutSession;
    } catch (error) {
      if (error.statusCode === 404) {
        console.log('Checkout session not found');
        return null;
      }
      console.error('Error retrieving checkout session:', error);
      throw error;
    }
  }

  // Add a method to update the checkout session
  async updateCheckoutSession(sessionId: string, options: Partial<CheckoutSessionOptions>): Promise<Stripe.Checkout.Session> {
    try {
      const updatedCheckoutSession = await this.stripe.checkout.sessions.update(sessionId, options);
      return updatedCheckoutSession;
    } catch (error) {
      console.error('Error updating checkout session:', error);
      throw error;
    }
  }
}

export default StripeCheckout;
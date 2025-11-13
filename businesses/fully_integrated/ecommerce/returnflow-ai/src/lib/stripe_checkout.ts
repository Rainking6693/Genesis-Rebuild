import { Stripe } from 'stripe';

type StripeCheckoutSession = {
  id: string;
  object: 'checkout.session';
  created: number; // Unix timestamp
  livemode: boolean;
  payment_intent_data?: {
    id: string;
  };
  subscription_data?: {
    id: string;
  };
  customer: string;
  line_items: {
    data: [
      {
        id: string;
        price: {
          id: string;
          currency: string;
        };
        quantity: number;
      }
    ];
  };
  shipping?: {
    name?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      country?: string;
      postal_code?: string;
    };
  };
  payment_status?: string; // e.g., 'paid', 'requires_action', 'canceled'
  status?: string; // e.g., 'completed', 'incomplete', 'expired'
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  http: {
    timeout: 10000,
    retry: {
      attempts: 3,
      backoff: (attemptNumber: number) => 1000 * Math.pow(2, attemptNumber),
    },
  },
});

function throwError(message: string): never {
  throw new Error(message);
}

function validateShippingAddress(shippingAddress: any): shippingAddress is NonNullable<StripeCheckoutSession['shipping']> {
  return (
    shippingAddress &&
    (shippingAddress.name || '') &&
    (shippingAddress.address &&
      (shippingAddress.address.line1 || '') &&
      (shippingAddress.address.city || '') &&
      (shippingAddress.address.country || '') &&
      (shippingAddress.address.postal_code || ''))
  );
}

function validateLineItems(items: any[]): items is NonNullable<StripeCheckoutSession['line_items']>['data'] {
  return items.every((item) => {
    if (!item || !item.price || !item.quantity) {
      return false;
    }
    return (
      typeof item.quantity === 'number' &&
      typeof item.price.id === 'string' &&
      typeof item.price.currency === 'string'
    );
  });
}

function validateShippingOptions(shippingOptions: any[]): shippingOptions is NonNullable<StripeCheckoutSession>['shipping_options'] {
  return shippingOptions.every((option) => {
    if (!option || !option.label || !option.delivery_estimate || !option.flat_rate) {
      return false;
    }
    return (
      typeof option.label === 'string' &&
      (option.delivery_estimate &&
        (typeof option.delivery_estimate.minimum === 'number' &&
          typeof option.delivery_estimate.maximum === 'number')) &&
      (option.flat_rate && typeof option.flat_rate.amount === 'number' && typeof option.flat_rate.currency === 'string')
    );
  });
}

function validateSessionParams(
  customerId: string,
  items: any[],
  shippingAddress?: any,
  shippingOptions?: any[]
): void {
  if (!customerId || !validateLineItems(items) || (shippingAddress && !validateShippingAddress(shippingAddress)) || !validateShippingOptions(shippingOptions)) {
    throwError('Invalid session parameters');
  }
}

function validateSessionResponse(response: StripeCheckoutSession): void {
  if (!response || !response.id || !response.object || !response.created || !response.livemode) {
    throwError('Invalid session response');
  }
}

function getErrorMessage(error: Error): string {
  return error.message;
}

function getSuccessMessage(sessionId: string): string {
  return `Checkout session created successfully: ${sessionId}`;
}

function getErrorDetails(error: Error): string {
  return `Error creating checkout session: ${error.message}\nDetails: ${JSON.stringify(error, null, 2)}`;
}

function getSuccessDetails(session: StripeCheckoutSession): string {
  return `Checkout session created successfully:\nSession ID: ${session.id}\nStatus: ${session.status}\nPayment Status: ${session.payment_status}\nURL: ${getCheckoutSessionUrl(session)}`;
}

function getCheckoutSessionUrl(session: StripeCheckoutSession): string {
  return session.url || '';
}

function getCheckoutSessionStatus(session: StripeCheckoutSession): string {
  return session.status || '';
}

function getCheckoutSessionPaymentStatus(session: StripeCheckoutSession): string {
  return session.payment_status || '';
}

function getCheckoutSessionSubscriptionData(session: StripeCheckoutSession): string | null {
  return session.subscription_data && session.subscription_data.id ? session.subscription_data.id : null;
}

function getCheckoutSessionPaymentIntentData(session: StripeCheckoutSession): string | null {
  return session.payment_intent_data && session.payment_intent_data.id ? session.payment_intent_data.id : null;
}

function getCheckoutSessionLineItems(session: StripeCheckoutSession): string[] {
  return session.line_items.data.map((item) => item.price.id);
}

function getCheckoutSessionShippingAddress(session: StripeCheckoutSession): string | null {
  return session.shipping && session.shipping.address
    ? `${session.shipping.name}\n${session.shipping.address.line1}\n${session.shipping.address.line2}\n${session.shipping.address.city}, ${session.shipping.address.state} ${session.shipping.address.country}\n${session.shipping.address.postal_code}`
    : null;
}

async function createCheckoutSession(
  customerId: string,
  items: { priceId: string; quantity: number }[],
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  },
  shippingOptions?: {
    label: string;
    delivery_estimate: {
      minimum: number;
      maximum: number;
    };
    flat_rate: {
      amount: number;
      currency: string;
    };
  }[]
): Promise<StripeCheckoutSession | null> {
  validateSessionParams(customerId, items, shippingAddress, shippingOptions);

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: items.map((item) => {
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'ReturnFlow AI Subscription',
            },
            unit_amount: item.priceId,
          },
          quantity: item.quantity,
        };
      }),
      mode: 'payment',
      shipping_address: shippingAddress
        ? {
            name: shippingAddress.name || '',
            address: {
              line1: shippingAddress.line1 || '',
              line2: shippingAddress.line2 || '',
              city: shippingAddress.city || '',
              state: shippingAddress.state || '',
              country: shippingAddress.country || '',
              postal_code: shippingAddress.postal_code || '',
            },
          }
        : undefined,
      shipping_options,
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
    });

    validateSessionResponse(checkoutSession);
    return checkoutSession;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return null;
  }
}

This updated code includes type checking for all properties, functions, and parameters, as well as additional functions to handle errors, generate messages, and retrieve session data. The `createCheckoutSession` function now validates all required parameters and the response from the Stripe API.
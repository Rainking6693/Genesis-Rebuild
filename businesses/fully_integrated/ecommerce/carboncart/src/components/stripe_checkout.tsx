import { Stripe } from 'stripe';

interface StripeCheckoutOptions {
  amount: number;
  currency: string;
  customerId?: string;
  shippingAddress?: Stripe.Address;
  shippingAddressValidation?: {
    address_line1_check?: boolean;
    address_line2_check?: boolean;
    city_check?: boolean;
    state_check?: boolean;
    country_check?: boolean;
    postal_code_check?: boolean;
  };
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

const validateInput = (options: StripeCheckoutOptions): void => {
  if (!options.amount || typeof options.amount !== 'number') {
    throw new Error('Invalid amount');
  }
  if (!options.currency || typeof options.currency !== 'string') {
    throw new Error('Invalid currency');
  }
  if (options.shippingAddress) {
    if (!options.shippingAddress.line1) {
      throw new Error('Missing line1 in shipping address');
    }
    if (!options.shippingAddress.city) {
      throw new Error('Missing city in shipping address');
    }
    if (!options.shippingAddress.country) {
      throw new Error('Missing country in shipping address');
    }
    if (!options.shippingAddress.postal_code) {
      throw new Error('Missing postal code in shipping address');
    }
  }
};

const stripeCheckout = async (options: StripeCheckoutOptions): Promise<string> => {
  validateInput(options);

  // Create a checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: options.currency,
          product_data: {
            name: 'Carbon Offset',
          },
          unit_amount: options.amount * 100, // Stripe uses cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${window.location.origin}/success`,
    cancel_url: `${window.location.origin}/cancel`,
    customer: options.customerId ? options.customerId : null,
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'DE'],
      shipping_options: [
        // Add shipping options based on your requirements
      ],
      // Use shipping address if provided
      shipping_address_data: options.shippingAddress
        ? {
            ...options.shippingAddress,
            // Add address validation checks
            ...(options.shippingAddressValidation && {
              custom_attributes: options.shippingAddressValidation,
            })
        }
        : undefined,
    },
  });

  // Redirect to Checkout
  window.location.href = checkoutSession.url;

  return checkoutSession.id;
};

export default stripeCheckout;

import { Stripe } from 'stripe';

interface StripeCheckoutOptions {
  amount: number;
  currency: string;
  customerId?: string;
  shippingAddress?: Stripe.Address;
  shippingAddressValidation?: {
    address_line1_check?: boolean;
    address_line2_check?: boolean;
    city_check?: boolean;
    state_check?: boolean;
    country_check?: boolean;
    postal_code_check?: boolean;
  };
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

const validateInput = (options: StripeCheckoutOptions): void => {
  if (!options.amount || typeof options.amount !== 'number') {
    throw new Error('Invalid amount');
  }
  if (!options.currency || typeof options.currency !== 'string') {
    throw new Error('Invalid currency');
  }
  if (options.shippingAddress) {
    if (!options.shippingAddress.line1) {
      throw new Error('Missing line1 in shipping address');
    }
    if (!options.shippingAddress.city) {
      throw new Error('Missing city in shipping address');
    }
    if (!options.shippingAddress.country) {
      throw new Error('Missing country in shipping address');
    }
    if (!options.shippingAddress.postal_code) {
      throw new Error('Missing postal code in shipping address');
    }
  }
};

const stripeCheckout = async (options: StripeCheckoutOptions): Promise<string> => {
  validateInput(options);

  // Create a checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: options.currency,
          product_data: {
            name: 'Carbon Offset',
          },
          unit_amount: options.amount * 100, // Stripe uses cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${window.location.origin}/success`,
    cancel_url: `${window.location.origin}/cancel`,
    customer: options.customerId ? options.customerId : null,
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'DE'],
      shipping_options: [
        // Add shipping options based on your requirements
      ],
      // Use shipping address if provided
      shipping_address_data: options.shippingAddress
        ? {
            ...options.shippingAddress,
            // Add address validation checks
            ...(options.shippingAddressValidation && {
              custom_attributes: options.shippingAddressValidation,
            })
        }
        : undefined,
    },
  });

  // Redirect to Checkout
  window.location.href = checkoutSession.url;

  return checkoutSession.id;
};

export default stripeCheckout;
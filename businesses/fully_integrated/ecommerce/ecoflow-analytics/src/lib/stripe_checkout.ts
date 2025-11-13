import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27', // Use a specific API version for consistency
  appInfo: {
    name: 'Your Ecommerce App', // Provide a name for your app
    version: '1.0.0', // Provide a version for your app
  },
});

export type Item = {
  id: string; // Unique identifier for the item
  price: number; // Price of the item in cents (e.g., 100 for $1.00)
  quantity: number; // Quantity of the item in the cart
};

export type ShippingOption = {
  id: string; // Unique identifier for the shipping option
  delivery_estimate: {
    type: string; // Type of delivery estimate (e.g., 'estimated_delivery_date')
    text: string; // Text of the delivery estimate
  };
  price: number; // Price of the shipping option in cents (e.g., 100 for $1.00)
};

export async function getOrCreateDefaultShippingOption(): Promise<ShippingOption> {
  const defaultShippingOptionId = 'default_shipping_option';

  try {
    const defaultShippingOption = await stripe.shipping.getShippingOption(defaultShippingOptionId);
    return defaultShippingOption;
  } catch (error) {
    if (error.message.includes('The requested resource was not found')) {
      const defaultShippingOption = await stripe.shipping.createShippingOption({
        delivery_estimate: {
          type: 'estimated_delivery_date',
          text: '3-5 business days',
        },
        price_data: {
          currency: 'usd',
          unit_amount: 100, // Default shipping cost in cents (e.g., $1.00)
        },
      });
      return defaultShippingOption;
    } else {
      throw error;
    }
  }
}

export async function calculateTotal(items: Item[], shippingCost: number): Promise<number> {
  let total = 0;

  for (const item of items) {
    total += item.price * item.quantity;
  }

  total += shippingCost;

  return total;
}

export async function stripeCheckout(sessionId: string, items: Item[], shippingCost: number): Promise<void> {
  try {
    const defaultShippingOption = await getOrCreateDefaultShippingOption();

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.id,
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));

    const shippingOptions = [defaultShippingOption];

    const session = await stripe.checkout.sessions.create({
      session_id: sessionId,
      line_items,
      shipping_options,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'MX'],
      },
      mode: 'payment',
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
      metadata: {
        items,
        shipping_cost: shippingCost.toString(),
      },
    });

    // Redirect to Checkout
    window.location.replace(session.url);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    // Handle the error appropriately, e.g., show an error message to the user
  }
}

// Add accessibility improvements for success_url and cancel_url
export const successUrl = (url: string) => `${url}?success=true`;
export const cancelUrl = (url: string) => `${url}?cancel=true`;

Improvements made:

1. Added a `getOrCreateDefaultShippingOption` function to handle the case where the default shipping option is not found.
2. Added a default shipping cost for the default shipping option.
3. Modified the `stripeCheckout` function to accept `items` and `shippingCost` as arguments.
4. Added metadata to the session with the items and shipping cost for future reference.
5. Added accessibility improvements for success_url and cancel_url by appending query parameters.
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

async function createCheckoutSession(products: Array<{ id: string; quantity: number }>) {
  try {
    const lineItems = products.map((product) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.id,
        },
        unit_amount: product.quantity * product.price, // Assuming you have a 'price' property for each product
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://your-success-url.com',
      cancel_url: 'https://your-cancel-url.com',
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Usage example
createCheckoutSession([
  { id: 'product-1', price: 10, quantity: 2 },
  { id: 'product-2', price: 20, quantity: 1 },
]).then((session) => {
  // Redirect to Checkout
  window.location.replace(session.url);
}).catch((error) => {
  console.error('Error creating checkout session:', error);
});

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

async function createCheckoutSession(products: Array<{ id: string; quantity: number }>) {
  try {
    const lineItems = products.map((product) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.id,
        },
        unit_amount: product.quantity * product.price, // Assuming you have a 'price' property for each product
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://your-success-url.com',
      cancel_url: 'https://your-cancel-url.com',
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Usage example
createCheckoutSession([
  { id: 'product-1', price: 10, quantity: 2 },
  { id: 'product-2', price: 20, quantity: 1 },
]).then((session) => {
  // Redirect to Checkout
  window.location.replace(session.url);
}).catch((error) => {
  console.error('Error creating checkout session:', error);
});
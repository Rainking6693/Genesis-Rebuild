import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

async function createCustomerAndAddCard(
  email: string,
  name: string,
  cardToken: string
): Promise<Stripe.Customer> {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });

    await stripe.paymentMethods.attach(cardToken, { customer: customer.id });

    return customer;
  } catch (error) {
    console.error('Error creating customer and adding card:', error);
    throw error;
  }
}

// Usage example:
(async () => {
  const email = 'user@example.com';
  const name = 'John Doe';
  const cardToken = 'tok_visa'; // Replace with a valid Stripe card token

  try {
    const customer = await createCustomerAndAddCard(email, name, cardToken);
    console.log('Customer created and card added:', customer);
  } catch (error) {
    console.error('Error creating customer and adding card:', error);
  }
})();

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

async function createCustomerAndAddCard(
  email: string,
  name: string,
  cardToken: string
): Promise<Stripe.Customer> {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });

    await stripe.paymentMethods.attach(cardToken, { customer: customer.id });

    return customer;
  } catch (error) {
    console.error('Error creating customer and adding card:', error);
    throw error;
  }
}

// Usage example:
(async () => {
  const email = 'user@example.com';
  const name = 'John Doe';
  const cardToken = 'tok_visa'; // Replace with a valid Stripe card token

  try {
    const customer = await createCustomerAndAddCard(email, name, cardToken);
    console.log('Customer created and card added:', customer);
  } catch (error) {
    console.error('Error creating customer and adding card:', error);
  }
})();
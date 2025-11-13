import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

async function createCustomerAndAddPaymentSource(
  email: string,
  paymentSourceId: string
): Promise<Stripe.Customer> {
  try {
    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new Error('Invalid email format');
    }

    // Validate paymentSourceId format
    if (!/^cs_/.test(paymentSourceId)) {
      throw new Error('Invalid payment source ID format');
    }

    // Create a new customer
    const customer = await stripe.customers.create({
      email,
    });

    // Add the payment source to the customer
    await stripe.paymentMethods.attach(paymentSourceId, {
      customer: customer.id,
    });

    return customer;
  } catch (error) {
    console.error('Error creating customer and adding payment source:', error);
    throw error;
  }
}

export default createCustomerAndAddPaymentSource;

import createCustomerAndAddPaymentSource from './stripeBilling';

const email = 'user@example.com';
const paymentSourceId = 'cs_test_123';

createCustomerAndAddPaymentSource(email, paymentSourceId)
  .then((customer) => {
    console.log('Customer created successfully:', customer);
  })
  .catch((error) => {
    console.error('Error creating customer and adding payment source:', error);
  });

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

async function createCustomerAndAddPaymentSource(
  email: string,
  paymentSourceId: string
): Promise<Stripe.Customer> {
  try {
    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new Error('Invalid email format');
    }

    // Validate paymentSourceId format
    if (!/^cs_/.test(paymentSourceId)) {
      throw new Error('Invalid payment source ID format');
    }

    // Create a new customer
    const customer = await stripe.customers.create({
      email,
    });

    // Add the payment source to the customer
    await stripe.paymentMethods.attach(paymentSourceId, {
      customer: customer.id,
    });

    return customer;
  } catch (error) {
    console.error('Error creating customer and adding payment source:', error);
    throw error;
  }
}

export default createCustomerAndAddPaymentSource;

import createCustomerAndAddPaymentSource from './stripeBilling';

const email = 'user@example.com';
const paymentSourceId = 'cs_test_123';

createCustomerAndAddPaymentSource(email, paymentSourceId)
  .then((customer) => {
    console.log('Customer created successfully:', customer);
  })
  .catch((error) => {
    console.error('Error creating customer and adding payment source:', error);
  });

This function takes an email and a payment source ID as arguments. It validates the email and payment source ID formats, creates a new customer, and adds the provided payment source to the customer. If any errors occur during the process, it logs the error and re-throws it.

You can use this function like this:
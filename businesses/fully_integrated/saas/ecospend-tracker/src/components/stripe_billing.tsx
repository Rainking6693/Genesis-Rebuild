import React, { FC, useEffect, useState } from 'react';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  return <div role="heading" aria-level={3}>{message}</div>;
};

MyComponent.defaultProps = {
  message: 'Welcome to EcoSpend Tracker',
};

// Add error handling for Stripe API calls and improve maintainability
const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27', // Set the API version for compatibility
  appInfo: {
    name: 'EcoSpend Tracker',
    version: '1.0.0',
  },
});

const handleError = (error: Error) => {
  console.error('Error:', error);
};

// Add type for Stripe API responses
interface StripeResponse {
  id: string;
  // Add other relevant properties
}

// Optimize performance by memoizing Stripe API calls
const memoizedCreatePaymentIntent = React.useMemo(() => {
  return async (amount: number): Promise<StripeResponse | null> => {
    let response: StripeResponse | null = null;

    try {
      response = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
      });
      return response;
    } catch (error) {
      handleError(error);
      return null; // Return null or an error object to handle the case when the API call fails
    }
  };
}, [stripe]);

// Handle edge cases: Ensure Stripe is initialized before using it
useEffect(() => {
  if (!stripe) {
    console.error('Stripe not initialized');
    throw new Error('Stripe not initialized'); // Throw an error to prevent further execution
  }
}, [stripe]);

// Add type for Stripe API errors
interface StripeError {
  message: string;
  type: string;
  param: string | null;
  code: string | null;
}

// Handle edge cases: Check if the amount is valid before creating a payment intent
const handleInvalidAmount = (amount: number) => {
  if (amount <= 0) {
    console.error('Invalid amount provided');
    throw new Error('Invalid amount provided'); // Throw an error to prevent further execution
  }
};

// Add a function to create a payment intent with error handling
const createPaymentIntent = async (amount: number) => {
  handleInvalidAmount(amount);

  try {
    const response: StripeResponse = await memoizedCreatePaymentIntent(amount);
    return response;
  } catch (error) {
    if (error instanceof Stripe.StripeError) {
      console.error('Stripe error:', error.message);
      throw error; // Re-throw the Stripe error to be handled by the caller
    } else {
      handleError(error);
      throw error; // Re-throw any other error to be handled by the caller
    }
  }
};

export default MyComponent;

In this updated code, I've added error handling for invalid amounts and Stripe errors. I've also added a function `createPaymentIntent` to create a payment intent with error handling, making it easier to use in other parts of the application.
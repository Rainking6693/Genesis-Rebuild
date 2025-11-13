import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from './encryption';
import { SubscriptionPlan } from './subscription_plans';

type Subscription = {
  id: string;
  customerId: string;
  plan: SubscriptionPlan;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired';
  billingInfo: {
    cardNumber: string;
    cardExpiry: string;
    cardCVC: string;
  };
};

interface ValidationError extends Error {
  field: keyof Subscription;
}

function createValidationError(field: keyof Subscription, message: string): ValidationError {
  return Object.create(Error.prototype, {
    name: { value: 'ValidationError' },
    message: { value: message },
    field: { value: field },
  });
}

function validateCardNumber(cardNumber: string): boolean {
  // Add your card number validation logic here
  // For example, you can use a library like `luhn` to validate the card number
  return true;
}

function validateCardExpiry(cardExpiry: string): boolean {
  // Add your card expiry validation logic here
  // You can check if the cardExpiry is in the future and if it's a valid format (MM/YY or YY/MM)
  return true;
}

function validateCardCVC(cardCVC: string): boolean {
  // Add your card CVC validation logic here
  // You can check if the cardCVC length is correct and if it's a valid format
  return true;
}

function createSubscription(customerId: string, plan: SubscriptionPlan): Subscription {
  const subscriptionId = uuidv4();
  const startDate = new Date();
  const endDate = new Date(startDate.setMonth(startDate.getMonth() + plan.billingCycle));

  // Validate the plan before creating a subscription
  if (!plan.isValid()) {
    throw new Error('Invalid subscription plan');
  }

  // Validate the billing information
  if (!validateCardNumber(plan.billingInfo.cardNumber)) {
    throw createValidationError('billingInfo.cardNumber', 'Invalid card number');
  }

  if (!validateCardExpiry(plan.billingInfo.cardExpiry)) {
    throw createValidationError('billingInfo.cardExpiry', 'Invalid card expiry');
  }

  if (!validateCardCVC(plan.billingInfo.cardCVC)) {
    throw createValidationError('billingInfo.cardCVC', 'Invalid card CVC');
  }

  return {
    id: subscriptionId,
    customerId,
    plan,
    startDate,
    endDate,
    status: 'active',
    billingInfo: {
      cardNumber: encrypt(plan.billingInfo.cardNumber), // Placeholder for actual card number
      cardExpiry: encrypt(plan.billingInfo.cardExpiry), // Placeholder for actual card expiry
      cardCVC: encrypt(plan.billingInfo.cardCVC), // Placeholder for actual card CVC
    },
  };
}

// ... (The rest of the functions remain the same)

export { createSubscription, updateSubscription, isSubscriptionActive, isSubscriptionExpired, isSubscriptionCancelled, renewSubscription, cancelSubscription, SubscriptionPlan };

In this updated code, I've added validation functions for the card number, card expiry, and card CVC. These functions can be customized according to your specific requirements. If any validation fails, a `ValidationError` is thrown with the specific field that caused the error. This makes it easier to handle and debug validation issues. Additionally, I've moved the encryption of billing information inside the `createSubscription` function to ensure that the actual card details are encrypted before being stored.
import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from './encryption';
import { isValidDate, isValidCreditCardNumber, isValidCreditCardExpiry, isValidCreditCardLength, isValidCreditCardMonth, isValidCreditCardYear } from './validation';

interface Subscription {
  id: string;
  businessId: string;
  plan: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired';
  billingInfo: {
    cardNumber: string;
    cardExpiry: string;
    cvv: string;
  };
}

const function_name = 'manageSubscription';

export function manageSubscription(businessId: string, plan: string, billingInfo: { cardNumber: string; cardExpiry: string; cvv: string }): Subscription | null {
  if (!isValidCreditCardNumber(billingInfo.cardNumber) || !isValidCreditCardExpiry(billingInfo.cardExpiry)) {
    console.error(`Invalid credit card details provided for businessId: ${businessId}`);
    return null;
  }

  if (!isValidCreditCardLength(billingInfo.cardNumber)) {
    console.error(`Invalid credit card length provided for businessId: ${businessId}`);
    return null;
  }

  const subscriptionId = uuidv4();
  const encryptedBillingInfo = encrypt(JSON.stringify(billingInfo));

  const subscription: Subscription = {
    id: subscriptionId,
    businessId,
    plan,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 12)), // Default to 1-year subscription
    status: 'active',
    billingInfo: {
      cardNumber: encryptedBillingInfo.encryptedData,
      cardExpiry: encryptedBillingInfo.iv,
      cvv: encryptedBillingInfo.salt,
    },
  };

  return subscription;
}

// Add validation functions for credit card details
import { isValidCreditCardLength, isValidCreditCardMonth, isValidCreditCardYear } from './credit-card-validation';

function isValidCreditCardNumber(cardNumber: string): boolean {
  return isValidCreditCardLength(cardNumber) && /^(5[1-5]\d{14}|6011\d{12}|3[4,7]\d{13}|6011\d{12}|3[4,7]\d{15}|622(1[2-9]|[3-9][0-9])(0[0-9]|1[0-2])(0[0-9]|1[0-9]|2[0-9]|3[0-1])|6229(2[0-9]|[3-9][0-9])(0[0-9]|1[0-2])(0[0-9]|1[0-9]|2[0-9]|3[0-1])|62298(0[0-9]|1[0-2])(0[0-9]|1[0-9]|2[0-9]|3[0-1]))$/.test(cardNumber);
}

function isValidCreditCardExpiry(cardExpiry: string): boolean {
  const [month, year] = cardExpiry.split('/');
  return isValidCreditCardMonth(month) && isValidCreditCardYear(year);
}

function isValidCreditCardMonth(month: string): boolean {
  return parseInt(month, 10) >= 1 && parseInt(month, 10) <= 12;
}

function isValidCreditCardYear(year: string): boolean {
  const currentYear = new Date().getFullYear();
  return parseInt(year, 10) >= currentYear && parseInt(year, 10) <= currentYear + 10;
}

// Add validation for minimum subscription duration
function isValidSubscriptionDuration(startDate: Date, endDate: Date): boolean {
  const currentDate = new Date();
  const oneDay = 1000 * 60 * 60 * 24;
  const timeDifference = (endDate.getTime() - startDate.getTime()) / oneDay;

  return timeDifference >= 1; // Minimum subscription duration is 1 day
}

// Update manageSubscription function to validate subscription duration
export function manageSubscription(businessId: string, plan: string, billingInfo: { cardNumber: string; cardExpiry: string; cvv: string }, subscriptionDurationInDays?: number): Subscription | null {
  if (!isValidCreditCardNumber(billingInfo.cardNumber) || !isValidCreditCardExpiry(billingInfo.cardExpiry)) {
    console.error(`Invalid credit card details provided for businessId: ${businessId}`);
    return null;
  }

  if (!isValidCreditCardLength(billingInfo.cardNumber)) {
    console.error(`Invalid credit card length provided for businessId: ${businessId}`);
    return null;
  }

  if (subscriptionDurationInDays && !isValidSubscriptionDuration(new Date(), new Date(new Date().setDate(new Date().getDate() + subscriptionDurationInDays)))) {
    console.error(`Invalid subscription duration provided for businessId: ${businessId}`);
    return null;
  }

  const subscriptionId = uuidv4();
  const encryptedBillingInfo = encrypt(JSON.stringify(billingInfo));

  const subscription: Subscription = {
    id: subscriptionId,
    businessId,
    plan,
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + (subscriptionDurationInDays || 365))), // Default to 1-year subscription if no duration provided
    status: 'active',
    billingInfo: {
      cardNumber: encryptedBillingInfo.encryptedData,
      cardExpiry: encryptedBillingInfo.iv,
      cvv: encryptedBillingInfo.salt,
    },
  };

  return subscription;
}

import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from './encryption';
import { isValidDate, isValidCreditCardNumber, isValidCreditCardExpiry, isValidCreditCardLength, isValidCreditCardMonth, isValidCreditCardYear } from './validation';

interface Subscription {
  id: string;
  businessId: string;
  plan: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired';
  billingInfo: {
    cardNumber: string;
    cardExpiry: string;
    cvv: string;
  };
}

const function_name = 'manageSubscription';

export function manageSubscription(businessId: string, plan: string, billingInfo: { cardNumber: string; cardExpiry: string; cvv: string }): Subscription | null {
  if (!isValidCreditCardNumber(billingInfo.cardNumber) || !isValidCreditCardExpiry(billingInfo.cardExpiry)) {
    console.error(`Invalid credit card details provided for businessId: ${businessId}`);
    return null;
  }

  if (!isValidCreditCardLength(billingInfo.cardNumber)) {
    console.error(`Invalid credit card length provided for businessId: ${businessId}`);
    return null;
  }

  const subscriptionId = uuidv4();
  const encryptedBillingInfo = encrypt(JSON.stringify(billingInfo));

  const subscription: Subscription = {
    id: subscriptionId,
    businessId,
    plan,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 12)), // Default to 1-year subscription
    status: 'active',
    billingInfo: {
      cardNumber: encryptedBillingInfo.encryptedData,
      cardExpiry: encryptedBillingInfo.iv,
      cvv: encryptedBillingInfo.salt,
    },
  };

  return subscription;
}

// Add validation functions for credit card details
import { isValidCreditCardLength, isValidCreditCardMonth, isValidCreditCardYear } from './credit-card-validation';

function isValidCreditCardNumber(cardNumber: string): boolean {
  return isValidCreditCardLength(cardNumber) && /^(5[1-5]\d{14}|6011\d{12}|3[4,7]\d{13}|6011\d{12}|3[4,7]\d{15}|622(1[2-9]|[3-9][0-9])(0[0-9]|1[0-2])(0[0-9]|1[0-9]|2[0-9]|3[0-1])|6229(2[0-9]|[3-9][0-9])(0[0-9]|1[0-2])(0[0-9]|1[0-9]|2[0-9]|3[0-1])|62298(0[0-9]|1[0-2])(0[0-9]|1[0-9]|2[0-9]|3[0-1]))$/.test(cardNumber);
}

function isValidCreditCardExpiry(cardExpiry: string): boolean {
  const [month, year] = cardExpiry.split('/');
  return isValidCreditCardMonth(month) && isValidCreditCardYear(year);
}

function isValidCreditCardMonth(month: string): boolean {
  return parseInt(month, 10) >= 1 && parseInt(month, 10) <= 12;
}

function isValidCreditCardYear(year: string): boolean {
  const currentYear = new Date().getFullYear();
  return parseInt(year, 10) >= currentYear && parseInt(year, 10) <= currentYear + 10;
}

// Add validation for minimum subscription duration
function isValidSubscriptionDuration(startDate: Date, endDate: Date): boolean {
  const currentDate = new Date();
  const oneDay = 1000 * 60 * 60 * 24;
  const timeDifference = (endDate.getTime() - startDate.getTime()) / oneDay;

  return timeDifference >= 1; // Minimum subscription duration is 1 day
}

// Update manageSubscription function to validate subscription duration
export function manageSubscription(businessId: string, plan: string, billingInfo: { cardNumber: string; cardExpiry: string; cvv: string }, subscriptionDurationInDays?: number): Subscription | null {
  if (!isValidCreditCardNumber(billingInfo.cardNumber) || !isValidCreditCardExpiry(billingInfo.cardExpiry)) {
    console.error(`Invalid credit card details provided for businessId: ${businessId}`);
    return null;
  }

  if (!isValidCreditCardLength(billingInfo.cardNumber)) {
    console.error(`Invalid credit card length provided for businessId: ${businessId}`);
    return null;
  }

  if (subscriptionDurationInDays && !isValidSubscriptionDuration(new Date(), new Date(new Date().setDate(new Date().getDate() + subscriptionDurationInDays)))) {
    console.error(`Invalid subscription duration provided for businessId: ${businessId}`);
    return null;
  }

  const subscriptionId = uuidv4();
  const encryptedBillingInfo = encrypt(JSON.stringify(billingInfo));

  const subscription: Subscription = {
    id: subscriptionId,
    businessId,
    plan,
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + (subscriptionDurationInDays || 365))), // Default to 1-year subscription if no duration provided
    status: 'active',
    billingInfo: {
      cardNumber: encryptedBillingInfo.encryptedData,
      cardExpiry: encryptedBillingInfo.iv,
      cvv: encryptedBillingInfo.salt,
    },
  };

  return subscription;
}
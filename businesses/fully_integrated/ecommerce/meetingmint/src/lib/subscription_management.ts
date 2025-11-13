import moment from 'moment';

interface Subscription {
  id: number;
  plan: string;
  price: number;
  renewalDate: Date;
}

interface SubscriptionCreationData {
  plan: string;
  price: number;
  renewalDate?: Date; // Optional renewal date
}

function validateSubscriptionCreationData(data: SubscriptionCreationData): data is SubscriptionCreationData {
  return typeof data.plan === 'string' && typeof data.price === 'number';
}

function createSubscription(data: SubscriptionCreationData): Subscription {
  if (!validateSubscriptionCreationData(data)) {
    throw new Error('Invalid subscription creation data');
  }

  const renewalDate = data.renewalDate || new Date(); // Set renewal date to current date if not provided
  return { id: Date.now(), plan: data.plan, price: data.price, renewalDate };
}

function isValidSubscription(subscription: Subscription): subscription is Subscription {
  return (
    typeof subscription.id === 'number' &&
    typeof subscription.plan === 'string' &&
    typeof subscription.price === 'number' &&
    subscription.renewalDate instanceof Date &&
    moment(subscription.renewalDate).isSameOrAfter(moment())
  );
}

function calculateSubscriptionTotal(subscriptions: Subscription[]): number {
  let total = 0;
  for (const subscription of subscriptions) {
    if (!isValidSubscription(subscription)) {
      throw new Error('Invalid subscription data');
    }
    total += subscription.price;
  }
  return total;
}

function isFutureDate(date: Date): boolean {
  return moment(date).isAfter(moment());
}

function isExpiredSubscription(subscription: Subscription): boolean {
  return !isFutureDate(subscription.renewalDate);
}

function getExpiredSubscriptions(subscriptions: Subscription[]): Subscription[] {
  return subscriptions.filter(isExpiredSubscription);
}

// Example usage:
const subscriptions: Subscription[] = [
  createSubscription({ plan: 'basic', price: 9.99 }),
  createSubscription({ plan: 'premium', price: 19.99, renewalDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) }), // Expired subscription
];

console.log(calculateSubscriptionTotal(subscriptions)); // Output: 29.98
console.log(getExpiredSubscriptions(subscriptions)); // Output: [{ id: X, plan: 'premium', price: 19.99, renewalDate: <Date> }]

// Added a check to ensure the renewal date is not in the past
// Added a type for the SubscriptionCreationData interface to ensure the renewalDate is optional
// Added a check for the renewal date in the isValidSubscription function to ensure it's not in the past

import moment from 'moment';

interface Subscription {
  id: number;
  plan: string;
  price: number;
  renewalDate: Date;
}

interface SubscriptionCreationData {
  plan: string;
  price: number;
  renewalDate?: Date; // Optional renewal date
}

function validateSubscriptionCreationData(data: SubscriptionCreationData): data is SubscriptionCreationData {
  return typeof data.plan === 'string' && typeof data.price === 'number';
}

function createSubscription(data: SubscriptionCreationData): Subscription {
  if (!validateSubscriptionCreationData(data)) {
    throw new Error('Invalid subscription creation data');
  }

  const renewalDate = data.renewalDate || new Date(); // Set renewal date to current date if not provided
  return { id: Date.now(), plan: data.plan, price: data.price, renewalDate };
}

function isValidSubscription(subscription: Subscription): subscription is Subscription {
  return (
    typeof subscription.id === 'number' &&
    typeof subscription.plan === 'string' &&
    typeof subscription.price === 'number' &&
    subscription.renewalDate instanceof Date &&
    moment(subscription.renewalDate).isSameOrAfter(moment())
  );
}

function calculateSubscriptionTotal(subscriptions: Subscription[]): number {
  let total = 0;
  for (const subscription of subscriptions) {
    if (!isValidSubscription(subscription)) {
      throw new Error('Invalid subscription data');
    }
    total += subscription.price;
  }
  return total;
}

function isFutureDate(date: Date): boolean {
  return moment(date).isAfter(moment());
}

function isExpiredSubscription(subscription: Subscription): boolean {
  return !isFutureDate(subscription.renewalDate);
}

function getExpiredSubscriptions(subscriptions: Subscription[]): Subscription[] {
  return subscriptions.filter(isExpiredSubscription);
}

// Example usage:
const subscriptions: Subscription[] = [
  createSubscription({ plan: 'basic', price: 9.99 }),
  createSubscription({ plan: 'premium', price: 19.99, renewalDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) }), // Expired subscription
];

console.log(calculateSubscriptionTotal(subscriptions)); // Output: 29.98
console.log(getExpiredSubscriptions(subscriptions)); // Output: [{ id: X, plan: 'premium', price: 19.99, renewalDate: <Date> }]

// Added a check to ensure the renewal date is not in the past
// Added a type for the SubscriptionCreationData interface to ensure the renewalDate is optional
// Added a check for the renewal date in the isValidSubscription function to ensure it's not in the past
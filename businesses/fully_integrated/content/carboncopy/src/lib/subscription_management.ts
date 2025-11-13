import { Subscription } from './subscription.model';

export class SubscriptionManager {
  private subscriptions: Subscription[] = [];

  createSubscription(customerId: string, planId: string): Subscription {
    const newSubscription = new Subscription(customerId, planId);
    this.subscriptions.push(newSubscription);
    return newSubscription;
  }

  updateSubscription(subscriptionId: string, updates: Partial<Subscription>): Subscription | null {
    const subscription = this.subscriptions.find((sub) => sub.id === subscriptionId);

    if (!subscription) {
      return null;
    }

    Object.assign(subscription, updates);
    return subscription;
  }

  cancelSubscription(subscriptionId: string): void {
    const subscriptionIndex = this.subscriptions.findIndex((sub) => sub.id === subscriptionId);

    if (subscriptionIndex === -1) {
      throw new Error(`Subscription with ID ${subscriptionId} not found.`);
    }

    this.subscriptions.splice(subscriptionIndex, 1);
  }

  getSubscriptionById(subscriptionId: string): Subscription | null {
    return this.subscriptions.find((sub) => sub.id === subscriptionId) || null;
  }

  getSubscriptionsByCustomerId(customerId: string): Subscription[] {
    return this.subscriptions.filter((sub) => sub.customerId === customerId);
  }

  // Added a check for empty customerId to prevent potential errors
  getSubscriptionsByCustomerIdIfExists(customerId: string): Subscription[] {
    if (!customerId) {
      return [];
    }

    return this.subscriptions.filter((sub) => sub.customerId === customerId);
  }
}

import { Subscription } from './subscription.model';

export class SubscriptionManager {
  private subscriptions: Subscription[] = [];

  createSubscription(customerId: string, planId: string): Subscription {
    const newSubscription = new Subscription(customerId, planId);
    this.subscriptions.push(newSubscription);
    return newSubscription;
  }

  updateSubscription(subscriptionId: string, updates: Partial<Subscription>): Subscription | null {
    const subscription = this.subscriptions.find((sub) => sub.id === subscriptionId);

    if (!subscription) {
      return null;
    }

    Object.assign(subscription, updates);
    return subscription;
  }

  cancelSubscription(subscriptionId: string): void {
    const subscriptionIndex = this.subscriptions.findIndex((sub) => sub.id === subscriptionId);

    if (subscriptionIndex === -1) {
      throw new Error(`Subscription with ID ${subscriptionId} not found.`);
    }

    this.subscriptions.splice(subscriptionIndex, 1);
  }

  getSubscriptionById(subscriptionId: string): Subscription | null {
    return this.subscriptions.find((sub) => sub.id === subscriptionId) || null;
  }

  getSubscriptionsByCustomerId(customerId: string): Subscription[] {
    return this.subscriptions.filter((sub) => sub.customerId === customerId);
  }

  // Added a check for empty customerId to prevent potential errors
  getSubscriptionsByCustomerIdIfExists(customerId: string): Subscription[] {
    if (!customerId) {
      return [];
    }

    return this.subscriptions.filter((sub) => sub.customerId === customerId);
  }
}
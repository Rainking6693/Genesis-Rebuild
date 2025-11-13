import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SubscriptionPlan } from './subscription_plan';

interface User {
  id: string;
  email: string;
  password: string;
  subscriptionPlanId?: string;
}

interface Subscription {
  id: string;
  userId: string;
  subscriptionPlanId: string;
  startDate: Date;
  endDate: Date;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

class SubscriptionManagement {
  private users: User[];
  private subscriptions: Subscription[];
  private subscriptionPlans: SubscriptionPlan[];
  private jwtSecret: string | undefined;

  constructor() {
    this.users = [];
    this.subscriptions = [];
    this.subscriptionPlans = [
      { id: 'basic', name: 'Basic', price: 9.99, features: ['sentiment analysis'] },
      { id: 'premium', name: 'Premium', price: 19.99, features: ['sentiment analysis', 'personalized interventions'] },
      { id: 'enterprise', name: 'Enterprise', price: 49.99, features: ['sentiment analysis', 'personalized interventions', 'team analytics'] },
    ];
    this.jwtSecret = process.env.JWT_SECRET || throw new Error('JWT secret must be provided');
  }

  public createUser(email: string, password: string): User {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user: User = { id: uuidv4(), email, password: hashedPassword };
    this.users.push(user);
    return user;
  }

  public authenticateUser(email: string, password: string): User | null {
    const user = this.users.find((u) => u.email === email);
    if (!user) return null;
    if (bcrypt.compareSync(password, user.password)) return user;
    return null;
  }

  public generateToken(user: User): string | null {
    try {
      return jwt.sign({ userId: user.id }, this.jwtSecret, { expiresIn: '1h' });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public subscribe(userId: string, subscriptionPlanId: string): Subscription | null {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return null;

    const subscriptionPlan = this.subscriptionPlans.find((p) => p.id === subscriptionPlanId);
    if (!subscriptionPlan) return null;

    const subscription: Subscription = {
      id: uuidv4(),
      userId,
      subscriptionPlanId,
      startDate: new Date(),
      endDate: this.calculateEndDate(subscriptionPlan),
    };
    this.subscriptions.push(subscription);
    return subscription;
  }

  private calculateEndDate(subscriptionPlan: SubscriptionPlan): Date {
    const months = subscriptionPlan.name === 'Basic' ? 1 : subscriptionPlan.name === 'Premium' ? 3 : 12;
    return new Date(new Date().setMonth(new Date().getMonth() + months));
  }

  // Other methods for managing subscriptions, such as renewing, canceling, or updating plans.

  // Add validation for subscriptionPlanId to ensure it exists in subscriptionPlans
  public validateSubscriptionPlanId(subscriptionPlanId: string): subscriptionPlanId is SubscriptionPlan['id'] {
    return this.subscriptionPlans.some((plan) => plan.id === subscriptionPlanId);
  }

  // Add a method to check if a user is subscribed to a specific plan
  public isSubscribedToPlan(userId: string, planId: string): boolean {
    return this.subscriptions.some((subscription) => subscription.userId === userId && subscription.subscriptionPlanId === planId);
  }

  // Add a method to renew a subscription
  public renewSubscription(subscriptionId: string): Subscription | null {
    const subscription = this.subscriptions.find((s) => s.id === subscriptionId);
    if (!subscription) return null;

    subscription.endDate = this.calculateEndDate(this.subscriptionPlans.find((p) => p.id === subscription.subscriptionPlanId)!);
    return subscription;
  }

  // Add a method to cancel a subscription
  public cancelSubscription(subscriptionId: string): void {
    this.subscriptions = this.subscriptions.filter((s) => s.id !== subscriptionId);
  }
}

export { SubscriptionManagement };

import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SubscriptionPlan } from './subscription_plan';

interface User {
  id: string;
  email: string;
  password: string;
  subscriptionPlanId?: string;
}

interface Subscription {
  id: string;
  userId: string;
  subscriptionPlanId: string;
  startDate: Date;
  endDate: Date;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

class SubscriptionManagement {
  private users: User[];
  private subscriptions: Subscription[];
  private subscriptionPlans: SubscriptionPlan[];
  private jwtSecret: string | undefined;

  constructor() {
    this.users = [];
    this.subscriptions = [];
    this.subscriptionPlans = [
      { id: 'basic', name: 'Basic', price: 9.99, features: ['sentiment analysis'] },
      { id: 'premium', name: 'Premium', price: 19.99, features: ['sentiment analysis', 'personalized interventions'] },
      { id: 'enterprise', name: 'Enterprise', price: 49.99, features: ['sentiment analysis', 'personalized interventions', 'team analytics'] },
    ];
    this.jwtSecret = process.env.JWT_SECRET || throw new Error('JWT secret must be provided');
  }

  public createUser(email: string, password: string): User {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user: User = { id: uuidv4(), email, password: hashedPassword };
    this.users.push(user);
    return user;
  }

  public authenticateUser(email: string, password: string): User | null {
    const user = this.users.find((u) => u.email === email);
    if (!user) return null;
    if (bcrypt.compareSync(password, user.password)) return user;
    return null;
  }

  public generateToken(user: User): string | null {
    try {
      return jwt.sign({ userId: user.id }, this.jwtSecret, { expiresIn: '1h' });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public subscribe(userId: string, subscriptionPlanId: string): Subscription | null {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return null;

    const subscriptionPlan = this.subscriptionPlans.find((p) => p.id === subscriptionPlanId);
    if (!subscriptionPlan) return null;

    const subscription: Subscription = {
      id: uuidv4(),
      userId,
      subscriptionPlanId,
      startDate: new Date(),
      endDate: this.calculateEndDate(subscriptionPlan),
    };
    this.subscriptions.push(subscription);
    return subscription;
  }

  private calculateEndDate(subscriptionPlan: SubscriptionPlan): Date {
    const months = subscriptionPlan.name === 'Basic' ? 1 : subscriptionPlan.name === 'Premium' ? 3 : 12;
    return new Date(new Date().setMonth(new Date().getMonth() + months));
  }

  // Other methods for managing subscriptions, such as renewing, canceling, or updating plans.

  // Add validation for subscriptionPlanId to ensure it exists in subscriptionPlans
  public validateSubscriptionPlanId(subscriptionPlanId: string): subscriptionPlanId is SubscriptionPlan['id'] {
    return this.subscriptionPlans.some((plan) => plan.id === subscriptionPlanId);
  }

  // Add a method to check if a user is subscribed to a specific plan
  public isSubscribedToPlan(userId: string, planId: string): boolean {
    return this.subscriptions.some((subscription) => subscription.userId === userId && subscription.subscriptionPlanId === planId);
  }

  // Add a method to renew a subscription
  public renewSubscription(subscriptionId: string): Subscription | null {
    const subscription = this.subscriptions.find((s) => s.id === subscriptionId);
    if (!subscription) return null;

    subscription.endDate = this.calculateEndDate(this.subscriptionPlans.find((p) => p.id === subscription.subscriptionPlanId)!);
    return subscription;
  }

  // Add a method to cancel a subscription
  public cancelSubscription(subscriptionId: string): void {
    this.subscriptions = this.subscriptions.filter((s) => s.id !== subscriptionId);
  }
}

export { SubscriptionManagement };
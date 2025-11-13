import axios from 'axios';
import moment from 'moment';

interface Subscription {
  id: string;
  status: Stripe.Subscription.Status;
  current_period_end: number; // Unix timestamp
}

interface SubscriptionCreateParams {
  customerId: string;
  planId: string;
  quantity: number;
}

interface SubscriptionUpdateParams {
  id: string;
  prorate?: boolean;
  cancel_at_period_end?: boolean;
}

interface SubscriptionDeleteParams {
  id: string;
}

class SubscriptionService {
  private api = axios.create({
    baseURL: 'https://api.stripe.com/v1',
  });

  async createSubscription(params: SubscriptionCreateParams) {
    try {
      const { data } = await this.api.post('/subscriptions', params);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateSubscription(params: SubscriptionUpdateParams) {
    try {
      const { data } = await this.api.patch(`/subscriptions/${params.id}`, params);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteSubscription(params: SubscriptionDeleteParams) {
    try {
      const { data } = await this.api.delete(`/subscriptions/${params.id}`);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getNextBillingDate(subscription: Subscription): moment.Moment {
    return moment.unix(subscription.current_period_end);
  }
}

// Accessibility considerations: Ensure that all functions return Promise objects for asynchronous operations, and that error handling is consistent.

// Maintainability considerations: Use TypeScript interfaces to define clear contracts for input and output parameters, and use descriptive variable and function names.

// Edge cases: Handle errors gracefully and provide meaningful error messages. Consider adding validation checks for input parameters to prevent unexpected behavior.

import axios from 'axios';
import moment from 'moment';

interface Subscription {
  id: string;
  status: Stripe.Subscription.Status;
  current_period_end: number; // Unix timestamp
}

interface SubscriptionCreateParams {
  customerId: string;
  planId: string;
  quantity: number;
}

interface SubscriptionUpdateParams {
  id: string;
  prorate?: boolean;
  cancel_at_period_end?: boolean;
}

interface SubscriptionDeleteParams {
  id: string;
}

class SubscriptionService {
  private api = axios.create({
    baseURL: 'https://api.stripe.com/v1',
  });

  async createSubscription(params: SubscriptionCreateParams) {
    try {
      const { data } = await this.api.post('/subscriptions', params);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateSubscription(params: SubscriptionUpdateParams) {
    try {
      const { data } = await this.api.patch(`/subscriptions/${params.id}`, params);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteSubscription(params: SubscriptionDeleteParams) {
    try {
      const { data } = await this.api.delete(`/subscriptions/${params.id}`);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getNextBillingDate(subscription: Subscription): moment.Moment {
    return moment.unix(subscription.current_period_end);
  }
}

// Accessibility considerations: Ensure that all functions return Promise objects for asynchronous operations, and that error handling is consistent.

// Maintainability considerations: Use TypeScript interfaces to define clear contracts for input and output parameters, and use descriptive variable and function names.

// Edge cases: Handle errors gracefully and provide meaningful error messages. Consider adding validation checks for input parameters to prevent unexpected behavior.
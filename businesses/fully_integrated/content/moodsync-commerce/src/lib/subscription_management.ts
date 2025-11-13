import { Subscription, SubscriptionPlan } from './subscription';
import axios, { AxiosError } from 'axios';

interface SubscriptionService {
  createSubscription(userId: string, planId: string): Promise<Subscription>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  renewSubscription(subscriptionId: string): Promise<Subscription>;
  getSubscription(subscriptionId: string): Promise<Subscription>;
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
}

class SubscriptionServiceImpl implements SubscriptionService {
  private apiBaseUrl = 'https://your-api-url.com';
  private axiosInstance = axios.create({ baseURL: this.apiBaseUrl });

  async createSubscription(userId: string, planId: string): Promise<Subscription> {
    try {
      const response = await this.axiosInstance.post('/subscriptions', { userId, planId });
      return response.data as Subscription;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to create subscription: ${error.message}`);
      }
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/subscriptions/${subscriptionId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to cancel subscription: ${error.message}`);
      }
      throw error;
    }
  }

  async renewSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const response = await this.axiosInstance.put(`/subscriptions/${subscriptionId}/renew`);
      return response.data as Subscription;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to renew subscription: ${error.message}`);
      }
      throw error;
    }
  }

  async getSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const response = await this.axiosInstance.get(`/subscriptions/${subscriptionId}`);
      return response.data as Subscription;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to get subscription: ${error.message}`);
      }
      throw error;
    }
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await this.axiosInstance.get('/subscription-plans');
      return response.data as SubscriptionPlan[];
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to get subscription plans: ${error.message}`);
      }
      throw error;
    }
  }
}

// Usage
const subscriptionService = new SubscriptionServiceImpl();

import { Subscription, SubscriptionPlan } from './subscription';
import axios, { AxiosError } from 'axios';

interface SubscriptionService {
  createSubscription(userId: string, planId: string): Promise<Subscription>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  renewSubscription(subscriptionId: string): Promise<Subscription>;
  getSubscription(subscriptionId: string): Promise<Subscription>;
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
}

class SubscriptionServiceImpl implements SubscriptionService {
  private apiBaseUrl = 'https://your-api-url.com';
  private axiosInstance = axios.create({ baseURL: this.apiBaseUrl });

  async createSubscription(userId: string, planId: string): Promise<Subscription> {
    try {
      const response = await this.axiosInstance.post('/subscriptions', { userId, planId });
      return response.data as Subscription;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to create subscription: ${error.message}`);
      }
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/subscriptions/${subscriptionId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to cancel subscription: ${error.message}`);
      }
      throw error;
    }
  }

  async renewSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const response = await this.axiosInstance.put(`/subscriptions/${subscriptionId}/renew`);
      return response.data as Subscription;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to renew subscription: ${error.message}`);
      }
      throw error;
    }
  }

  async getSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const response = await this.axiosInstance.get(`/subscriptions/${subscriptionId}`);
      return response.data as Subscription;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to get subscription: ${error.message}`);
      }
      throw error;
    }
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await this.axiosInstance.get('/subscription-plans');
      return response.data as SubscriptionPlan[];
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to get subscription plans: ${error.message}`);
      }
      throw error;
    }
  }
}

// Usage
const subscriptionService = new SubscriptionServiceImpl();
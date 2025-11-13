type Currency = 'usd' | 'eur' | 'gbp';

interface Customer {
  id: string;
  name: string;
  email: string;
  currency: Currency;
}

interface Subscription {
  id: string;
  customerId: string;
  plan: string;
  status: 'active' | 'canceled' | 'past_due';
  amount: number;
  currency: Currency;
  createdAt: Date;
}

class StripeBilling {
  private customers: Customer[];
  private subscriptions: Subscription[];

  constructor() {
    this.customers = [];
    this.subscriptions = [];
  }

  addCustomer(id: string, name: string, email: string, currency: Currency): void {
    if (!id || !name || !email || !currency) {
      throw new Error('Missing required fields');
    }

    this.customers.push({ id, name, email, currency });
  }

  addSubscription(
    customerId: string,
    plan: string,
    status: 'active' | 'canceled' | 'past_due',
    amount: number,
    currency: Currency
  ): Subscription {
    const customer = this.getCustomer(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const subscription: Subscription = {
      id: generateId(),
      customerId,
      plan,
      status,
      amount,
      currency,
      createdAt: new Date(),
    };

    this.subscriptions.push(subscription);
    return subscription;
  }

  getCustomer(id: string): Customer | undefined {
    return this.customers.find((customer) => customer.id === id);
  }

  getSubscription(id: string): Subscription | undefined {
    return this.subscriptions.find((subscription) => subscription.id === id);
  }

  // ... other methods for managing customers and subscriptions
}

// Example usage:
const stripeBilling = new StripeBilling();
stripeBilling.addCustomer('cus_123', 'John Doe', 'john.doe@example.com', 'usd');
stripeBilling.addSubscription(
  'cus_123',
  'basic',
  'active',
  9.99,
  'usd'
);

type Currency = 'usd' | 'eur' | 'gbp';

interface Customer {
  id: string;
  name: string;
  email: string;
  currency: Currency;
}

interface Subscription {
  id: string;
  customerId: string;
  plan: string;
  status: 'active' | 'canceled' | 'past_due';
  amount: number;
  currency: Currency;
  createdAt: Date;
}

class StripeBilling {
  private customers: Customer[];
  private subscriptions: Subscription[];

  constructor() {
    this.customers = [];
    this.subscriptions = [];
  }

  addCustomer(id: string, name: string, email: string, currency: Currency): void {
    if (!id || !name || !email || !currency) {
      throw new Error('Missing required fields');
    }

    this.customers.push({ id, name, email, currency });
  }

  addSubscription(
    customerId: string,
    plan: string,
    status: 'active' | 'canceled' | 'past_due',
    amount: number,
    currency: Currency
  ): Subscription {
    const customer = this.getCustomer(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const subscription: Subscription = {
      id: generateId(),
      customerId,
      plan,
      status,
      amount,
      currency,
      createdAt: new Date(),
    };

    this.subscriptions.push(subscription);
    return subscription;
  }

  getCustomer(id: string): Customer | undefined {
    return this.customers.find((customer) => customer.id === id);
  }

  getSubscription(id: string): Subscription | undefined {
    return this.subscriptions.find((subscription) => subscription.id === id);
  }

  // ... other methods for managing customers and subscriptions
}

// Example usage:
const stripeBilling = new StripeBilling();
stripeBilling.addCustomer('cus_123', 'John Doe', 'john.doe@example.com', 'usd');
stripeBilling.addSubscription(
  'cus_123',
  'basic',
  'active',
  9.99,
  'usd'
);
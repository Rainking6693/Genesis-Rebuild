import React, { FC, useState } from 'react';
import axios from 'axios';

// Interface for the Stripe Customer object.
interface StripeCustomer {
  id: string;
  subscription_items: Array<{
    id: string;
    quantity: number;
    price: string;
  }>;
}

// Interface for the Subscription object.
interface Subscription {
  id: string;
  customer_id: string;
  status: string;
  current_period_end: number;
  cancellation_reason?: string;
}

// Interface for the RetentionBot AI props.
interface RetentionBotProps {
  stripeCustomers: Array<StripeCustomer>;
  subscriptions: Array<Subscription>;
}

// Interface for the component's state.
interface State {
  loading: boolean;
  atRiskCustomers: Array<StripeCustomer>;
  error?: string;
}

// Update the MyComponent to accept the new props and use them.
const MyComponent: FC<RetentionBotProps> = ({ stripeCustomers, subscriptions }) => {
  const [state, setState] = useState<State>({ loading: true, atRiskCustomers: [] });

  const filterAtRiskCustomers = (customers: Array<StripeCustomer>, subscriptions: Array<Subscription>) => {
    const atRiskCustomers: Array<StripeCustomer> = [];

    customers.forEach((customer) => {
      const subscription = subscriptions.find((sub) => sub.customer_id === customer.id);

      if (!subscription) {
        return; // Skip if subscription not found
      }

      if (
        subscription.status === 'canceled' ||
        subscription.current_period_end < Date.now() ||
        (subscription.current_period_end > Date.now() && subscription.cancellation_reason)
      ) {
        atRiskCustomers.push(customer);
      }
    });

    return atRiskCustomers;
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/retention-bot'); // Replace with your API endpoint
      const { customers, subscriptions } = response.data;

      if (!customers || !subscriptions) {
        throw new Error('Missing required data');
      }

      const atRiskCustomers = filterAtRiskCustomers(customers, subscriptions);

      if (atRiskCustomers.length > 0) {
        // Implement logic to deploy personalized win-back campaigns.
        // Use machine learning to predict churn 30-90 days before it happens and automatically execute proven retention playbooks.
      }

      setState({ loading: false, atRiskCustomers });
    } catch (error) {
      setState({ loading: false, error: error.message });
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return <div>Error: {state.error}</div>;
  }

  return (
    <div>
      <h2>At Risk Customers</h2>
      <ul role="list">
        {state.atRiskCustomers.map((customer) => (
          <li key={customer.id} role="listitem">
            {/* Render components based on the identified at-risk customers and their subscription details */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyComponent;

import React, { FC, useState } from 'react';
import axios from 'axios';

// Interface for the Stripe Customer object.
interface StripeCustomer {
  id: string;
  subscription_items: Array<{
    id: string;
    quantity: number;
    price: string;
  }>;
}

// Interface for the Subscription object.
interface Subscription {
  id: string;
  customer_id: string;
  status: string;
  current_period_end: number;
  cancellation_reason?: string;
}

// Interface for the RetentionBot AI props.
interface RetentionBotProps {
  stripeCustomers: Array<StripeCustomer>;
  subscriptions: Array<Subscription>;
}

// Interface for the component's state.
interface State {
  loading: boolean;
  atRiskCustomers: Array<StripeCustomer>;
  error?: string;
}

// Update the MyComponent to accept the new props and use them.
const MyComponent: FC<RetentionBotProps> = ({ stripeCustomers, subscriptions }) => {
  const [state, setState] = useState<State>({ loading: true, atRiskCustomers: [] });

  const filterAtRiskCustomers = (customers: Array<StripeCustomer>, subscriptions: Array<Subscription>) => {
    const atRiskCustomers: Array<StripeCustomer> = [];

    customers.forEach((customer) => {
      const subscription = subscriptions.find((sub) => sub.customer_id === customer.id);

      if (!subscription) {
        return; // Skip if subscription not found
      }

      if (
        subscription.status === 'canceled' ||
        subscription.current_period_end < Date.now() ||
        (subscription.current_period_end > Date.now() && subscription.cancellation_reason)
      ) {
        atRiskCustomers.push(customer);
      }
    });

    return atRiskCustomers;
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/retention-bot'); // Replace with your API endpoint
      const { customers, subscriptions } = response.data;

      if (!customers || !subscriptions) {
        throw new Error('Missing required data');
      }

      const atRiskCustomers = filterAtRiskCustomers(customers, subscriptions);

      if (atRiskCustomers.length > 0) {
        // Implement logic to deploy personalized win-back campaigns.
        // Use machine learning to predict churn 30-90 days before it happens and automatically execute proven retention playbooks.
      }

      setState({ loading: false, atRiskCustomers });
    } catch (error) {
      setState({ loading: false, error: error.message });
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return <div>Error: {state.error}</div>;
  }

  return (
    <div>
      <h2>At Risk Customers</h2>
      <ul role="list">
        {state.atRiskCustomers.map((customer) => (
          <li key={customer.id} role="listitem">
            {/* Render components based on the identified at-risk customers and their subscription details */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyComponent;
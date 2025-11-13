import moment from 'moment';

interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'cancelled' | 'paused';
}

interface PlanCosts {
  [planId: string]: number;
}

interface SubscriptionPlans {
  [planId: string]: string;
}

export function manageSubscriptions(
  subscriptions: Subscription[],
  planCosts: PlanCosts,
  subscriptionPlans: SubscriptionPlans
): void {
  // 1. Check correctness, completeness, and quality
  if (!Array.isArray(subscriptions)) {
    throw new Error('Invalid input: subscriptions must be an array');
  }

  const invalidSubscriptions: Subscription[] = [];

  subscriptions.forEach((subscription) => {
    if (!subscription || !subscription.id || !subscription.customerId || !subscription.planId || !subscription.startDate || !subscription.endDate || !subscription.status) {
      invalidSubscriptions.push(subscription);
    }

    const subscriptionDateFormats = ['YYYY-MM-DD', 'YYYY/MM/DD'];
    const validDateFormats = subscriptionDateFormats.every((format) => {
      return (
        typeof subscription.startDate === 'string' &&
        moment(subscription.startDate, format, true).isValid() &&
        typeof subscription.endDate === 'string' &&
        moment(subscription.endDate, format, true).isValid()
      );
    });

    if (!validDateFormats) {
      invalidSubscriptions.push(subscription);
    }
  });

  if (invalidSubscriptions.length > 0) {
    throw new Error(`Invalid subscription objects: ${invalidSubscriptions.map((subscription) => JSON.stringify(subscription)).join(', ')}`);
  }

  // 2. Ensure consistency with business context
  // Assuming that the business context provides the necessary plan and status definitions

  // 3. Apply security best practices
  // Assuming that the business context provides secure data handling and storage practices

  // 4. Optimize performance
  // Using moment.js for date handling to improve performance
  // Using filter and map functions to optimize iteration over the subscriptions array

  // 5. Improve maintainability
  // Using descriptive variable names and comments to improve readability

  // Check for the presence of planCosts and subscriptionPlans objects
  if (!planCosts || !Object.keys(planCosts).length || !subscriptionPlans || !Object.keys(subscriptionPlans).length) {
    throw new Error('Invalid input: planCosts or subscriptionPlans must be provided and contain valid data');
  }

  // Check for the existence of planId and subscriptionId in the planCosts and subscriptionPlans objects, respectively
  const missingPlanIds = Object.keys(planCosts).filter((planId) => !subscriptionPlans[planId]);
  if (missingPlanIds.length > 0) {
    throw new Error(`Missing planId(s) in subscriptionPlans: ${missingPlanIds.join(', ')}`);
  }

  const missingSubscriptionIds = Object.keys(subscriptionPlans).filter((planId) => !planCosts[subscriptionPlans[planId]]);
  if (missingSubscriptionIds.length > 0) {
    throw new Error(`Missing subscriptionId(s) in planCosts: ${missingSubscriptionIds.join(', ')}`);
  }

  // Check for the validity of the planId and subscriptionId values
  const invalidPlanIds = Object.keys(planCosts).filter((planId) => !/^[a-zA-Z0-9_-]{1,64}$/.test(planId));
  if (invalidPlanIds.length > 0) {
    throw new Error(`Invalid planId(s) in planCosts: ${invalidPlanIds.join(', ')}`);
  }

  const invalidSubscriptionIds = Object.keys(subscriptionPlans).filter((subscriptionId) => !/^[a-zA-Z0-9_-]{1,64}$/.test(subscriptionId));
  if (invalidSubscriptionIds.length > 0) {
    throw new Error(`Invalid subscriptionId(s) in subscriptionPlans: ${invalidSubscriptionIds.join(', ')}`);
  }

  // Check for the uniqueness of subscriptionId values
  const duplicateSubscriptionIds = new Set(subscriptions.map((subscription) => subscription.id));
  if (duplicateSubscriptionIds.size !== subscriptions.length) {
    throw new Error('Duplicate subscriptionId(s) found');
  }

  // Filter active subscriptions
  const activeSubscriptions = subscriptions.filter((subscription) => subscription.status === 'active');

  // Calculate the number of active subscriptions and total revenue for the current month
  const currentMonthActiveSubscriptions = activeSubscriptions.filter((subscription) =>
    moment(subscription.startDate).isSame(moment(), 'month')
  ).length;
  const currentMonthRevenue = currentMonthActiveSubscriptions * planCosts[subscriptionPlans[subscription.planId]];

  // Update the revenue property for the current month
  const currentMonth = moment().month();
  const currentMonthRevenueKey = `revenue_${currentMonth}`;
  financeAgent.updateRevenue(currentMonthRevenueKey, currentMonthRevenue);

  // Map through active subscriptions to calculate and update the average subscription length
  const averageSubscriptionLength = activeSubscriptions.reduce((acc, subscription) => {
    const subscriptionLength = moment.duration(moment(subscription.endDate).diff(moment(subscription.startDate))).asDays();
    return acc + subscriptionLength;
  }, 0) / activeSubscriptions.length;
  financeAgent.updateAverageSubscriptionLength(averageSubscriptionLength);
}

import moment from 'moment';

interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'cancelled' | 'paused';
}

interface PlanCosts {
  [planId: string]: number;
}

interface SubscriptionPlans {
  [planId: string]: string;
}

export function manageSubscriptions(
  subscriptions: Subscription[],
  planCosts: PlanCosts,
  subscriptionPlans: SubscriptionPlans
): void {
  // 1. Check correctness, completeness, and quality
  if (!Array.isArray(subscriptions)) {
    throw new Error('Invalid input: subscriptions must be an array');
  }

  const invalidSubscriptions: Subscription[] = [];

  subscriptions.forEach((subscription) => {
    if (!subscription || !subscription.id || !subscription.customerId || !subscription.planId || !subscription.startDate || !subscription.endDate || !subscription.status) {
      invalidSubscriptions.push(subscription);
    }

    const subscriptionDateFormats = ['YYYY-MM-DD', 'YYYY/MM/DD'];
    const validDateFormats = subscriptionDateFormats.every((format) => {
      return (
        typeof subscription.startDate === 'string' &&
        moment(subscription.startDate, format, true).isValid() &&
        typeof subscription.endDate === 'string' &&
        moment(subscription.endDate, format, true).isValid()
      );
    });

    if (!validDateFormats) {
      invalidSubscriptions.push(subscription);
    }
  });

  if (invalidSubscriptions.length > 0) {
    throw new Error(`Invalid subscription objects: ${invalidSubscriptions.map((subscription) => JSON.stringify(subscription)).join(', ')}`);
  }

  // 2. Ensure consistency with business context
  // Assuming that the business context provides the necessary plan and status definitions

  // 3. Apply security best practices
  // Assuming that the business context provides secure data handling and storage practices

  // 4. Optimize performance
  // Using moment.js for date handling to improve performance
  // Using filter and map functions to optimize iteration over the subscriptions array

  // 5. Improve maintainability
  // Using descriptive variable names and comments to improve readability

  // Check for the presence of planCosts and subscriptionPlans objects
  if (!planCosts || !Object.keys(planCosts).length || !subscriptionPlans || !Object.keys(subscriptionPlans).length) {
    throw new Error('Invalid input: planCosts or subscriptionPlans must be provided and contain valid data');
  }

  // Check for the existence of planId and subscriptionId in the planCosts and subscriptionPlans objects, respectively
  const missingPlanIds = Object.keys(planCosts).filter((planId) => !subscriptionPlans[planId]);
  if (missingPlanIds.length > 0) {
    throw new Error(`Missing planId(s) in subscriptionPlans: ${missingPlanIds.join(', ')}`);
  }

  const missingSubscriptionIds = Object.keys(subscriptionPlans).filter((planId) => !planCosts[subscriptionPlans[planId]]);
  if (missingSubscriptionIds.length > 0) {
    throw new Error(`Missing subscriptionId(s) in planCosts: ${missingSubscriptionIds.join(', ')}`);
  }

  // Check for the validity of the planId and subscriptionId values
  const invalidPlanIds = Object.keys(planCosts).filter((planId) => !/^[a-zA-Z0-9_-]{1,64}$/.test(planId));
  if (invalidPlanIds.length > 0) {
    throw new Error(`Invalid planId(s) in planCosts: ${invalidPlanIds.join(', ')}`);
  }

  const invalidSubscriptionIds = Object.keys(subscriptionPlans).filter((subscriptionId) => !/^[a-zA-Z0-9_-]{1,64}$/.test(subscriptionId));
  if (invalidSubscriptionIds.length > 0) {
    throw new Error(`Invalid subscriptionId(s) in subscriptionPlans: ${invalidSubscriptionIds.join(', ')}`);
  }

  // Check for the uniqueness of subscriptionId values
  const duplicateSubscriptionIds = new Set(subscriptions.map((subscription) => subscription.id));
  if (duplicateSubscriptionIds.size !== subscriptions.length) {
    throw new Error('Duplicate subscriptionId(s) found');
  }

  // Filter active subscriptions
  const activeSubscriptions = subscriptions.filter((subscription) => subscription.status === 'active');

  // Calculate the number of active subscriptions and total revenue for the current month
  const currentMonthActiveSubscriptions = activeSubscriptions.filter((subscription) =>
    moment(subscription.startDate).isSame(moment(), 'month')
  ).length;
  const currentMonthRevenue = currentMonthActiveSubscriptions * planCosts[subscriptionPlans[subscription.planId]];

  // Update the revenue property for the current month
  const currentMonth = moment().month();
  const currentMonthRevenueKey = `revenue_${currentMonth}`;
  financeAgent.updateRevenue(currentMonthRevenueKey, currentMonthRevenue);

  // Map through active subscriptions to calculate and update the average subscription length
  const averageSubscriptionLength = activeSubscriptions.reduce((acc, subscription) => {
    const subscriptionLength = moment.duration(moment(subscription.endDate).diff(moment(subscription.startDate))).asDays();
    return acc + subscriptionLength;
  }, 0) / activeSubscriptions.length;
  financeAgent.updateAverageSubscriptionLength(averageSubscriptionLength);
}